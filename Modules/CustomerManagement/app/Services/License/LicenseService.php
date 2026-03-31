<?php
namespace Modules\CustomerManagement\Services\License;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Modules\CustomerManagement\Models\CustomerLicense;
use Modules\CustomerManagement\Models\Voucher;

class LicenseService
{
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

            // 5. التحقق من حقل إرسال البريد
            if ($data['send_via_email']) {
                if ($data['type'] === 'group') {
                    // TODO: إرسال الكروت بملف إكسل للرخصة الجماعية
                } else {
                    // TODO: إرسال بيانات الرخصة الفردية
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
            case 'suspended':
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
        $sortDirection = $filters['sort_by'] === 'name'|| $filters['sort_by'] === 'company' ? 'asc' : 'desc';
        $query->orderBy($filters['sort_by'], $sortDirection);

        return $query->paginate($filters['show_at_least']);
    }
}
