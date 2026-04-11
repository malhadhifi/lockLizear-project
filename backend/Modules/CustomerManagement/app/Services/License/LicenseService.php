<?php
namespace Modules\CustomerManagement\Services\License;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Modules\CustomerManagement\Actions\GenerateLicenseExcelAction;
use Modules\CustomerManagement\Actions\GenerateLicenseFileAction;
use Modules\CustomerManagement\Actions\ResendLicenseFileAction;
use Modules\CustomerManagement\Models\CustomerLicense;
use Modules\CustomerManagement\Models\Voucher;
use Modules\CustomerManagement\Notifications\SendGroupLicenseEmailNotification;
use Modules\CustomerManagement\Notifications\SendLicenseEmailNotification;
use Modules\CustomerManagement\Services\LicenseDocuments\LicenseDocumentService;
use Modules\CustomerManagement\Services\LicensePublications\LicensePublicationService;

class LicenseService
{
    protected $publicationService;
    protected $documentService;

    public function __construct(
        LicensePublicationService $publicationService,
        LicenseDocumentService $documentService
    ) {
        $this->publicationService = $publicationService;
        $this->documentService = $documentService;
    }
    public function createLicense(array $data)
    {
        return DB::transaction(function () use ($data) {

            // 1. إنشاء الرخصة الأساسية
            $license = CustomerLicense::create([
                'publisher_id' => $data['publisher_id'],
                'name' => $data['name'],
                'email' => $data['email'],
                'company' => $data['company'] ?? null,
                'note' => $data['note'] ?? null,
                'type' => $data['type'], // 'individual' أو 'group'
                'max_devices' => 1,
                'valid_from' => $data['valid_from'],
                'never_expires' => $data['never_expires'],
                'valid_until' => $data['never_expires'] ? null : $data['valid_until'],
                'send_via_email' => $data['send_via_email'],
                'status' => 'active',
            ]);

            // 2. ربط المنشورات (إذا تم إرسالها)
            if (!empty($data['publications'])) {
                // نجهز البيانات للجدول الوسيط
                $publicationPivot = [];
                foreach ($data['publications'] as $pubId) {
                    $publicationPivot[$pubId] = ['status' => 'active', 'access_mode' => 'unlimited'];
                }
                $license->publications()->attach($publicationPivot);
            }

            // 3. ربط الملفات (إذا تم إرسالها)
            if (!empty($data['documents'])) {
                // نجهز البيانات للجدول الوسيط
                $documentPivot = [];
                foreach ($data['documents'] as $docId) {
                    $documentPivot[$docId] = ['status' => 'active', 'access_mode' => 'baselimited'];
                }
                $license->documents()->attach($documentPivot);
            }

            // 4. معالجة الرخصة الجماعية (إنشاء الكروت في جدول vouchers)
            if ($data['type'] === 'group' && !empty($data['count_license'])) {
                $vouchersData = [];
                for ($i = 0; $i < $data['count_license']; $i++) {
                    $vouchersData[] = [
                        'customer_license_id' => $license->id,
                        'pin_code' => $this->generateUniquePin(),
                        'status' => 'available',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
                // إدراج الكروت دفعة واحدة
                Voucher::insert($vouchersData);
            }

            // 5. بناء وتوليد الملف (دائماً نولده لكي نحفظ الرابط للتحميل لاحقاً)
            $generatedFileData = [];

            if ($data['type'] === 'group') {
                // توليد إكسل للرخصة الجماعية
                $generatedFileData = app(GenerateLicenseExcelAction::class)->execute($license);
            } else {
                // توليد ملف LZPK المشفر للرخصة الفردية
                $generatedFileData = app(GenerateLicenseFileAction::class)->execute($license);
            }

            // 6. التحقق من حقل إرسال البريد (إذا كان true، نرسل الملف الذي تم توليده في الخطوة السابقة)
            if ($data['send_via_email']) {
                if ($data['type'] === 'group') {
                    // إرسال الإشعار الجماعي
                    Notification::route('mail', $license->email)
                        ->notify(new SendGroupLicenseEmailNotification(
                            $license,
                            $generatedFileData['file_path'],
                            $generatedFileData['file_name']
                        ));
                } else {
                    // إرسال الإشعار الفردي
                    Notification::route('mail', $license->email)
                        ->notify(new SendLicenseEmailNotification(
                            $license,
                            $generatedFileData['file_path'],
                            $generatedFileData['file_name']
                        ));
                }

            }

            return $license;
        });
    }

    /**
     * دالة مساعدة لتوليد رقم سري فريد (PIN) للكرت
     */
    private function generateUniquePin()
    {
        do {
            $pin = strtoupper(Str::random(12));
        } while (Voucher::where('pin_code', $pin)->exists());

        return $pin;
    }

    /**
     * جلب قائمة الرخص مع الفلاتر والبحث
     */
    public function getLicenses(array $filters)
    {
        // استخدام withCount لجلب عدد الكروت من جدول vouchers
        $query = CustomerLicense::withCount('vouchers');

        // 1. فلتر البحث (في الاسم، الإيميل، أو الشركة)
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('email', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('company', 'like', '%' . $filters['search'] . '%');
            });
        }

        // 2. فلتر العرض (show)
        $now = \Carbon\Carbon::now();

        switch ($filters['show']) {
            case 'registered':
                $query->whereNotNull('registered_at');
                break;
            case 'not_registered':
                $query->whereNull('registered_at');
                break;
            case 'suspend':
                $query->where('status', 'suspend');
                break;
            case 'expired':
                // منتهية الصلاحية: لها تاريخ انتهاء، والتاريخ في الماضي
                $query->where('never_expires', false)
                    ->where('valid_until', '<', $now);
                break;
        }

        // 3. الترتيب

      // إذا كان الترتيب بالشركة، نجعله تصاعدياً (أبجدياً)، وإلا تنازلياً (أحدث شيء)

        $sortBy = $filters['sort'] ?? 'id';
        $sortColumn = match ($sortBy) {
            'name' => 'name',
            'company' => 'company',
            'published_at' => 'published_at',
            default => 'id',
        };

        $sortDirection = $sortBy === "company" || $sortColumn === "name" ? 'asc' : 'desc';

        $query->orderBy($sortColumn, $sortDirection);

        return $query->paginate($filters['limit']);
    }

    /**
     * تنفيذ الإجراءات الجماعية على الرخص
     */
    public function handleBulkActions(array $data)
    {
        $ids = $data['license_ids'];
        $action = $data['action'];

        return DB::transaction(function () use ($ids, $action, $data) {
            $query = CustomerLicense::whereIn('id', $ids);

            switch ($action) {
                case 'suspend':
                    $query->update(['status' => 'suspend']);
                    break;

                case 'active':
                    $query->update(['status' => 'active']);
                    break;

                case 'delete':
                    $query->delete(); // Soft Delete
                    break;

                case 'grant_access_to_publication':
                    $this->bulkGrantAccess($ids, 'publications', $data['publication_ids'], [
                        'status' => 'active',
                        'access_mode' => 'unlimited'
                    ]);
                    break;

                case 'grant_access_to_documents':
                    $this->bulkGrantAccess($ids, 'documents', $data['document_ids'], [
                        'status' => 'active',
                        'access_mode' => 'baselimited'
                    ]);
                    break;
                case 'resend_license':
                    $licenses = $query->get();

                    // استدعاء الأكشن المخصص لإعادة الإرسال
                    $resendAction = app(ResendLicenseFileAction::class);

                    foreach ($licenses as $license) {
                        $resendAction->execute($license);
                    }
                    break;

            }
            return true;
        });
    }

    /**
     * دالة مساعدة لربط مصفوفة رخص بمصفوفة موارد (منشورات أو ملفات)
     */
    private function bulkGrantAccess(array $licenseIds, string $relation, array $resourceIds, array $pivotData)
    {
        $licenses = CustomerLicense::whereIn('id', $licenseIds)->get();

        // تجهيز بيانات الجدول الوسيط
        $syncData = [];
        foreach ($resourceIds as $id) {
            $syncData[$id] = $pivotData;
        }

        foreach ($licenses as $license) {
            // استخدام العلاقة (publications() أو documents()) ديناميكياً
            $license->{$relation}()->syncWithoutDetaching($syncData);
        }
    }

    /**
     * جلب تفاصيل رخصة واحدة مع عدد الكروت (للرخصة الجماعية)
     */
    public function getLicenseDetails(int $id)
    {
        return CustomerLicense::with([
            // 1. جلب المنشورات (الـ ID فقط)
            'publications' => function ($query) {
                $query->select('publications.id') // 🚀 جلب الـ ID فقط
                    ->where('license_publications.status', '!=', 'revoked');
            },

            // 2. جلب المستندات (الـ ID فقط)
            'documents' => function ($query) {
                $query->select('documents.id') // 🚀 جلب الـ ID فقط
                    ->where('license_documents.status', '!=', 'revoked');
            }
        ])
            ->withCount(['vouchers'])
            ->findOrFail($id);
    }
    /**
     * تحديث بيانات رخصة محددة (الحقول المسموحة فقط)
     */

    public function updateLicense(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $license = CustomerLicense::findOrFail($id);

            // 1. تحديث البيانات الأساسية (عزل الإجراءات المدمجة)
            $mainData = collect($data)->except(['publications_action', 'documents_action'])->toArray();

            if (isset($mainData['never_expires']) && $mainData['never_expires'] == true) {
                $mainData['valid_until'] = null;
            }

            if (!empty($mainData)) {
                $license->update($mainData);
            }

            // 2. تمرير الإجراء الموحد للمنشورات إلى خدمتك الجاهزة
            if (!empty($data['publications_action'])) {
                // الكائن publications_action يطابق تماماً ما تتوقعه خدمتك (action, publication_ids, valid_from...)
                $this->publicationService->updatePublicationsAccess($id, $data['publications_action']);
            }

            // 3. تمرير الإجراء الموحد للملفات إلى خدمتك الجاهزة
            if (!empty($data['documents_action'])) {
                $this->documentService->updateDocumentsAccess($id, $data['documents_action']);
            }

            return $license;
        });
    }
}

