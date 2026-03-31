<?php

namespace Modules\PublisherWorkspace\Services;

use Modules\PublisherWorkspace\Models\PublisherLicense;
use Modules\PublisherWorkspace\Models\PublisherDevice;
use Exception; // 👈 استدعاء الكلاس الأساسي للأخطاء

class WriterActivationService
{
    /**
     * تفعيل جهاز جديد أو تسجيل دخوله
     */
    public function activateDevice(array $data, string $ipAddress)
    {
        // 1. التحقق المزدوج
        $license = PublisherLicense::with('publisher', 'package')
            ->where('publisher_id', $data['publisher_id'])
            ->where('license_key', $data['license_key'])
            ->first();

        if (!$license || $license->status !== 'active') {
            // 4060 => بيانات الرخصة غير متطابقة أو منتهية
            throw new Exception('license_invalid', 4060);
        }

        $publisher = $license->publisher;

        if ($publisher->status !== 'active') {
            // 4061 => حساب الناشر موقوف
            throw new Exception('account_suspended', 4061);
        }

        // 2. البحث عن الجهاز أو إنشاؤه
        $device = PublisherDevice::where('publisher_license_id', $license->id)
            ->where('hardware_id', $data['hardware_id'])
            ->first();

        if ($device) {
            if ($device->status === 'revoked') {
                // 2000 => تم حظر هذا الجهاز من قبل الإدارة
                throw new Exception('device_blocked', 2000);
            }

            // تحديث بيانات الجهاز
            $device->update([
                'device_name' => $data['device_name'] ?? $device->device_name,
                'last_ip' => $ipAddress,
                'last_synced_at' => now(),
            ]);
        } else {
            // فحص حد الأجهزة المسموح به
            $allowedDevices = $license->package->base_devices_allowed ?? 1;

            $activeCount = PublisherDevice::where('publisher_license_id', $license->id)
                ->where('status', 'active')
                ->count();

            if ($activeCount >= $allowedDevices) {
                // 4034 => تجاوزت الحد الأقصى للأجهزة
                throw new Exception('max_devices_reached', 4034);
            }

            // إنشاء الجهاز الجديد
            $device = PublisherDevice::create([
                'publisher_id' => $publisher->id,
                'publisher_license_id' => $license->id,
                'hardware_id' => $data['hardware_id'],
                'device_name' => $data['device_name'] ?? 'Unknown Device',
                'os_version' => $data['os_version'] ?? null,
                'app_version' => $data['app_version'] ?? null,
                'last_ip' => $ipAddress,
                'last_synced_at' => now(),
                'status' => 'active'
            ]);
        }

        // 3. إصدار التوكن
        $publisher->tokens()->where('name', 'WriterApp_' . $data['hardware_id'])->delete();
        $token = $publisher->createToken('WriterApp_' . $data['hardware_id'], ['writer-access'])->plainTextToken;

        return [
            'token' => $token,
            'publisher' => $publisher,
            'device_id' => $device->id
        ];
    }

    /**
     * نبض الجهاز (Ping)
     */
    public function pingDevice($publisher, string $hardwareId, string $ipAddress)
    {
        $device = PublisherDevice::where('publisher_id', $publisher->id)
            ->where('hardware_id', $hardwareId)
            ->first();

        if (!$device) {
            // 2001 => هذا الجهاز غير مسجل. يرجى تسجيل الدخول.
            throw new Exception('device_not_found', 2001);
        }

        if ($publisher->status !== 'active' || $device->status === 'revoked') {
            $publisher->currentAccessToken()->delete();
            // 4062 => تم حظر الحساب أو الجهاز، يرجى تسجيل الخروج
            throw new Exception('account_or_device_blocked', 4062);
        }

        // تحديث النبض
        $device->update([
            'last_ip' => $ipAddress,
            'last_synced_at' => now(),
        ]);

        return true;
    }
}
