<?php

namespace Modules\ReaderApp\Services\Auth;

use Modules\CustomerManagement\Models\CustomerLicense;
use Modules\CustomerManagement\Models\Voucher;
use Modules\CustomerManagement\Models\CustomerDevice;
use Modules\ReaderApp\Services\License\LicensePayloadBuilderService;

class UserContentService
{
    protected $payloadBuilder;

    public function __construct(LicensePayloadBuilderService $payloadBuilder)
    {
        $this->payloadBuilder = $payloadBuilder;
    }

    /**
     * جلب الرخص الصالحة فقط، تحديث ارتباطها بالجهاز الجديد، وتحويلها لقوالب
     */
    public function getAllUserContent(int $readerId)
    {
        $allPayloads = [];

        // 1. جلب الجهاز الحالي النشط لهذا الطالب (تم إنشاؤه أو تحديثه للتو في AuthService)
        $currentDevice = CustomerDevice::where('reader_id', $readerId)->first();
        if (!$currentDevice) {
            return []; // كإجراء أمني إضافي
        }

        $deviceId = $currentDevice->id;

        // =========================================================
        // أ) معالجة الرخص الفردية والجماعية المباشرة
        // =========================================================
        $directLicenses = CustomerLicense::where('reader_id', $readerId)
            ->where('status', '!=', 'revoked')
            ->where('status', '!=', 'suspend') // تجاهل الموقوفة كلياً
            ->get();

        foreach ($directLicenses as $license) {
            // فحص الانتهاء الزمني
            if (!$license->never_expires && $license->valid_until && now()->isAfter($license->valid_until)) {
                continue; // تخطي الرخصة المنتهية
            }
            if ($license->valid_from && now()->isBefore($license->valid_from)) {
                continue; // تخطي الرخصة التي لم يبدأ تاريخها بعد
            }

            // 🌟 التحديث السحري (Lazy Update):
            // إذا كانت الرخصة مربوطة بجهاز قديم، نحدثها لترتبط بالجهاز الحالي الجديد!
            if ($license->customer_devices_id !== $deviceId) {
                $license->update(['customer_devices_id' => $deviceId]);
            }

            // بناء القالب
            $allPayloads[] = $this->payloadBuilder->buildPayload($license->id, $readerId);
        }

        // =========================================================
        // ب) معالجة الكروت (Vouchers)
        // =========================================================
        $usedVouchers = Voucher::with('license')
            ->where('used_by_customer_id', $readerId)
            ->where('status', '!=', 'revoked')
            ->get();

        foreach ($usedVouchers as $voucher) {
            $license = $voucher->license;

            // فحص الرخصة الأم للكرت (تجاهل المعلقة أو المسحوبة)
            if (!$license || $license->status === 'suspend' || $license->status === 'revoked') {
                continue;
            }
            // فحص تواريخ الرخصة الأم
            if (!$license->never_expires && $license->valid_until && now()->isAfter($license->valid_until)) {
                continue;
            }
            if ($license->valid_from && now()->isBefore($license->valid_from)) {
                continue;
            }

            // 🌟 التحديث السحري للكروت:
            // إذا كان الكرت مربوطاً بجهاز قديم، نحدثه ليرتبط بالجهاز الحالي!
            if ($voucher->customer_devices_id !== $deviceId) {
                $voucher->update(['customer_devices_id' => $deviceId]);
            }

            // بناء القالب وتمرير رقم الكرت
            $allPayloads[] = $this->payloadBuilder->buildPayload($voucher->customer_license_id, $readerId, $voucher->id);
        }

        return $allPayloads;
    }
}
