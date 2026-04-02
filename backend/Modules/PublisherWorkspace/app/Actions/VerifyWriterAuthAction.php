<?php

namespace Modules\PublisherWorkspace\Actions;

use Modules\PublisherWorkspace\Models\PublisherLicense;
use Modules\PublisherWorkspace\Models\PublisherDevice;
use Modules\PublisherWorkspace\Services\LicenseFactoryService;
use Exception;

class VerifyWriterAuthAction
{
    protected $cryptoService;

    public function __construct(LicenseFactoryService $cryptoService)
    {
        $this->cryptoService = $cryptoService;
    }

    public function execute(int $licenseId, string $encryptedPayload)
    {
        // 1. البحث عن الرخصة
        $license = PublisherLicense::with('devices')->find($licenseId);
        if (!$license || $license->status !== 'active') {
            // 3000 => 'عفواً، هذه الرخصة محظورة أو موقوفة.' (موجود مسبقاً في قاموسك)
            throw new Exception('license_suspended_or_not_found', 3000);
        }

        // 2. فك التشفير والتحقق من التوقيع
        try {
            $verifiedData = $this->cryptoService->decryptAndVerifyWriterRequest(
                $encryptedPayload,
                $license->public_certificate
            );
        } catch (Exception $e) {
            // 4063 => 'فشل التحقق من التشفير أو التوقيع الرقمي للطلب.'
            throw new Exception('payload_decryption_failed', 4063);
        }

        // 3. التحقق من الجهاز (Hardware ID)
        $hardwareId = $verifiedData['hardware_id'] ?? null;
        if (!$hardwareId) {
            // 4020 => 'بيانات المدخلات غير صحيحة أو ناقصة' (موجود مسبقاً)
            throw new Exception('hardware_id_missing', 4020);
        }

        $device = $license->devices()->where('hardware_id', $hardwareId)->first();

        // إذا كان الجهاز جديداً
        if (!$device) {
            // هل الباقة تسمح بجهاز جديد؟
            if ($license->devices()->count() >= $license->actual_devices_allowed) {
                // 4034 => 'لقد تجاوزت الحد الأقصى للأجهزة المسموحة لهذه الرخصة.' (موجود مسبقاً)
                throw new Exception('max_devices_reached', 4034);
            }

            // تسجيل الجهاز الجديد
            $device = PublisherDevice::create([
                'publisher_license_id' => $license->id,
                'hardware_id' => $hardwareId,
                'status' => 'active',
                'last_ip' => request()->ip(),
            ]);
        } elseif ($device->status === 'revoked') {
            // 2000 => 'تم حظر هذا الجهاز من قبل الإدارة.' (موجود مسبقاً)
            throw new Exception('device_blocked', 2000);
        }

        // 4. تحديث آخر ظهور للجهاز
        $device->update(['last_ip' => request()->ip()]);

        // 5. تجهيز بيانات الرد
        return [
            'status' => 'authorized',
            'quotas' => [
                'max_documents' => $license->actual_max_documents,
                'batch_size' => $license->actual_batch_size,
            ]
        ];
    }
}
