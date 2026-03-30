<?php

namespace App\Helpers;

/**
 * كلاس مركزي لتحويل الحالات النصية من قاعدة البيانات
 * إلى أرقام (Enums) ليفهمها تطبيق القارئ (C#)
 */
class ApiEnumMapper
{
    // 1. نوع الرخصة (License Type)
    public static function licenseType($type): int
    {
        return match ($type) {
            'individual','group' => 1,
            'voucher' => 2,
            default => 0, // غير معروف
        };
    }

    // 2. الحالة العامة (Status) - للرخص، المنشورات، الملفات، والكروت
    public static function status($status): int
    {
        return match ($status) {
            'active', 'valid', 'available' => 1, // نشط / صالح
            'suspend', 'suspended' => 2, // معلق / موقوف
            'revoked' => 3, // مسحوب / تم إبطاله
            default => 0, // غير معروف
        };
    }

    // 3. وضع الصلاحية (Expiry Mode / Valid Mode)
    public static function expiryMode($mode): int
    {
        return match ($mode) {
            'never','unlimited' => 1, // لا ينتهي أبداً
            'fixed_date','limited' => 2, // تاريخ ثابت
            'days_from_first_use' => 3, // بعد أول فتح للملف
            default => 0, // غير معروف
        };
    }
    public static function verifyMode($mode): int
    {
        return match ($mode) {
            'never' => 1, // لا ينتهي أبداً
            'each_time' => 2,
            'only_when_internet' => 3,
            'every_x_days' => 4,
            'after_x_days_then_never' => 5,
            default => 0, // غير معروف
        };
    }

    // 4. نوع الملف (Document Type)
    public static function documentType($type): int
    {
        return match ($type) {
            'pdf' => 1,
            'video' => 2,
            default => 0,
        };
    }

}
