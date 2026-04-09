<?php
namespace Modules\CustomerManagement\Services\LicenseDocuments;

use Modules\CustomerManagement\Models\CustomerLicense;
use Modules\Library\Models\Document;


class LicenseDocumentService
{
    public function getCustomerDocuments(int $customerLicenseId, array $filters)
    {
        // 1. جلب الملفات المخصصة للعملاء المحددين فقط، وتحميل علاقة الحماية وعلاقة العميل المحدد
        $query = Document::where('access_scope', 'selected_customers')
            ->with([
                'securityControls',
                'customers' => function ($q) use ($customerLicenseId) {
                    $q->where('customer_licenses.id', $customerLicenseId);
                }
            ]);

        // 2. فلتر البحث
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        // 3. فلتر العرض المعقد (show)
        $show = $filters['show'];

        // دوال مساعدة لمنع التكرار
        $hasAccessCondition = function ($q) use ($customerLicenseId) {
            $q->where('customer_licenses.id', $customerLicenseId)
                ->where('license_documents.status', '!=', 'revoked');
        };

        // تطبيق فلتر الوصول (Access)
        if (in_array($show, ['with_access', 'access_video', 'access_pdf'])) {
            $query->whereHas('customers', $hasAccessCondition);
        } elseif (in_array($show, ['not_access', 'not_access_video', 'not_access_pdf'])) {
            $query->whereDoesntHave('customers', $hasAccessCondition);
        }

        // تطبيق فلتر النوع (Type)
        if (in_array($show, ['video', 'access_video', 'not_access_video'])) {
            $query->where('type', 'video');
        } elseif (in_array($show, ['pdf', 'access_pdf', 'not_access_pdf'])) {
            $query->where('type', 'pdf');
        }

        // 4. الترتيب
        $sortDirection = $filters['sort_by'] === 'title' ? 'asc' : 'desc';
        $query->orderBy($filters['sort_by'], $sortDirection);

        return $query->paginate($filters['show_at_least']);
    }


    /**
     * تحديث صلاحيات وصول عميل محدد لمجموعة ملفات مباشرة
     */
    public function updateDocumentsAccess(int $customerLicenseId, array $data)
    {
        // جلب العميل (الرخصة)
        $customerLicense =CustomerLicense::findOrFail($customerLicenseId);

        $pivotData = [];

        if ($data['action'] === 'unlimited') {
            $pivotData = [
                'access_mode' => 'unlimited',
                'valid_from' => null,
                'valid_until' => null,
                'status' => 'active',
            ];
        } elseif ($data['action'] === 'limited') {
            $pivotData = [
                'access_mode' => 'limited',
                'valid_from' => $data['valid_from'],
                'valid_until' => $data['valid_until'],
                'status' => 'active',
            ];
        } elseif ($data['action'] === 'baselimited') {
            // الوصول العادي (الخيار الرابع الجديد)
            $pivotData = [
                'access_mode' => 'baselimited',
                'valid_from' => null,
                'valid_until' => null,
                'status' => 'active',
            ];
        } elseif ($data['action'] === 'revoke') {
            // إلغاء الوصول
            $pivotData = [
                'status' => 'revoked',
            ];
        }

        // تشكيل المصفوفة
        $syncData = [];
        foreach ($data['document_ids'] as $docId) {
            $syncData[$docId] = $pivotData;
        }

        // تنفيذ التحديث على الجدول الوسيط (تأكد أن علاقة documents معرفة في موديل العميل)
        $customerLicense->documents()->syncWithoutDetaching($syncData);

        return true;
    }
}
?>
