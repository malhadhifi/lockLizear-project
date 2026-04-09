<?php

namespace Modules\ReaderApp\Services\Auth;

use Modules\CustomerManagement\Models\CustomerDevice;

class DeviceManagementService
{
    /**
     * مزامنة أو إنشاء جهاز العميل
     */
    public function syncDevice($reader, array $deviceInfo, string $ipAddress)
    {
        // 1. البحث عن الجهاز بواسطة بصمته (hardware_id)
        $device = CustomerDevice::where('hardware_id', $deviceInfo['hardware_id'])->first();

        if ($device) {
            // 2. إذا كان موجوداً: نقوم بتحديث الـ IP وتاريخ المزامنة وربطه بالعميل
            $device->update([
                'reader_id' => $reader->id,
                'ip_address' => $ipAddress,
                'last_synced_at' => now(),
                // يمكنك تحديث اسم الجهاز والإصدارات أيضاً إذا تغيرت
                'name' => $deviceInfo['name'] ?? $device->name,
                'app_version' => $deviceInfo['app_version'] ?? $device->app_version,
            ]);
        } else {
            // 3. إذا لم يكن موجوداً: نقوم بإنشائه وربطه بالعميل
            $device = CustomerDevice::create([
                'reader_id' => $reader->id,
                'hardware_id' => $deviceInfo['hardware_id'],
                'name' => $deviceInfo['name'],
                'device_type' => $deviceInfo['device_type'],
                'os_version' => $deviceInfo['os_version'] ?? null,
                'app_version' => $deviceInfo['app_version'] ?? null,
                'ip_address' => $ipAddress,
                'last_synced_at' => now(),
                'status' => 'active', // افتراضياً الجهاز نشط
            ]);
        }

        return $device;
    }
}
