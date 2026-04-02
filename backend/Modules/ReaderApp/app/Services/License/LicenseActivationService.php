<?php

namespace Modules\ReaderApp\Services\License;

use Modules\CustomerManagement\Models\CustomerLicense;
use Modules\CustomerManagement\Models\CustomerDevice;
use Modules\CustomerManagement\Models\Voucher;
use Illuminate\Support\Facades\DB;
use Exception;

class LicenseActivationService
{
    /**
     * الدالة الرئيسية الموجهة للتفعيل
     */
    public function activate($reader, array $data)
    {
        // 1. جلب الجهاز والتحقق منه
        $device = CustomerDevice::where('hardware_id', $data['hardware_id'])
            ->where('reader_id', $reader->id)
            ->first();

        if (!$device) {
            throw new Exception('device_not_found', 2001); // كود 2001: الجهاز غير مسجل
        }

        // 2. توجيه الطلب حسب نوع التفعيل
        if ($data['activation_type'] === 'license_id') {
            return $this->activateIndividualLicense($reader, $device, $data['activation_key']);
        } else {
            return $this->activateVoucher($reader, $device, $data['activation_key']);
        }
    }

    /**
     * مسار 1: تفعيل رخصة فردية (ملف مباشر)
     */
    private function activateIndividualLicense($reader, $device, $licenseId)
    {
        return DB::transaction(function () use ($reader, $device, $licenseId) {
            $license = CustomerLicense::lockForUpdate()->find($licenseId);

            if (!$license || $license->type !== 'individual')
                throw new Exception('not_found', 4030);

            // فحص حالة وتواريخ الرخصة
            $this->validateLicenseRules($license);

            // 🌟 المنطق الجديد (بدون جدول وسيط): فحص الارتباط بالجهاز
            if ($license->customer_devices_id) {
                // هل هي مرتبطة بنفس جهاز الطالب الحالي؟
                if ($license->customer_devices_id === $device->id) {
                    return ['code' => 1021, 'license_id' => $license->id]; // خروج ناجح: مفعل مسبقاً
                } else {
                    // مرتبطة بجهاز آخر! نرفض التفعيل
                    throw new Exception('max_devices', 4034);
                }
            }

            // فحص الملكية (إذا كانت الرخصة مسجلة باسم طالب آخر)
            if ($license->reader_id && $license->reader_id !== $reader->id) {
                throw new Exception('used_by_other', 4033);
            }

            // 🌟 النجاح: تسجيل الملكية للعميل وربط الجهاز مباشرة في جدول الرخصة
            $license->update([
                'reader_id' => $reader->id,
                'customer_devices_id' => $device->id, // تحديث حقل الجهاز مباشرة
                'registered_at' => $license->registered_at ?? now()
            ]);

            return ['code' => 1020, 'license_id' => $license->id, 'voucher_id' => null]; // تم التفعيل بنجاح
        });
    }

    /**
     * مسار 2: تفعيل كرت (Voucher) تابع لرخصة جماعية
     */
    private function activateVoucher($reader, $device, $pinCode)
    {
        return DB::transaction(function () use ($reader, $device, $pinCode) {
            $voucher = Voucher::with('license')->lockForUpdate()->where('pin_code', $pinCode)->first();

            if (!$voucher)
                throw new Exception('not_found', 4030);
            if ($voucher->status === 'revoked')
                throw new Exception('suspended', 4036);

            $license = $voucher->license;
            $this->validateLicenseRules($license);

            // 🌟 المنطق الجديد (بدون جدول وسيط): فحص الارتباط بالجهاز في جدول الكروت
            // ملاحظة: يُفترض أنك أضفت حقل 'customer_devices_id' في جدول 'vouchers' أيضاً
            if ($voucher->customer_devices_id) {
                if ($voucher->customer_devices_id === $device->id) {
                    return ['code' => 1021, 'license_id' => $license->id]; // مفعل مسبقاً
                } else {
                    throw new Exception('max_devices', 4034); // الكرت مستخدم في جهاز آخر
                }
            }

            if ($voucher->used_by_customer_id && $voucher->used_by_customer_id !== $reader->id) {
                throw new Exception('used_by_other', 4033);
            }

            // 🌟 النجاح: تسجيل الكرت باسم الطالب وربط الجهاز مباشرة في جدول الكروت
            $voucher->update([
                'used_by_customer_id' => $reader->id,
                'customer_devices_id' => $device->id, // تحديث حقل الجهاز
                'status' => 'active',
                'activated_at' => now()
            ]);

            return ['code' => 1020, 'license_id' => $license->id, 'voucher_id'=> $voucher->id]; // تم التفعيل بنجاح
        });
    }

    /**
     * دالة مساعدة لفحص قواعد الرخصة (مشتركة بين المسارين)
     */
    private function validateLicenseRules($license)
    {
        if ($license->status === 'suspend')
            throw new Exception('suspended', 4036);
        
        if ($license->valid_from && now()->isBefore($license->valid_from)) {
            throw new Exception('not_started', 4031);
        }

        if (!$license->never_expires && $license->valid_until && now()->isAfter($license->valid_until)) {
            throw new Exception('expired', 4032);
        }
    }
}
