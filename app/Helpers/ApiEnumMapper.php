<?php

namespace App\Helpers;

/**
 * كلاس مركزي للتحويل بين الحالات النصية (في قاعدة البيانات)
 * والأرقام (Enums) التي يفهمها تطبيق القارئ والناشر (C#)
 */
class ApiEnumMapper
{
    // ========================================================
    // الجزء الأول: من نص (Database) إلى رقم (C#)
    // ========================================================

    public static function licenseType($type): int
    {
        return match ($type) {
            'individual', 'group' => 1,
            'voucher' => 2,
            default => 0,
        };
    }

    public static function status($status): int
    {
        return match ($status) {
            'active', 'valid', 'available' => 1,
            'suspend', 'suspended' => 2,
            'revoked' => 3,
            default => 0,
        };
    }

    public static function expiryMode($mode): int
    {
        return match ($mode) {
            'never', 'unlimited' => 1,
            'fixed_date', 'limited' => 2,
            'days_from_first_use' => 3,
            default => 0,
        };
    }

    public static function verifyMode($mode): int
    {
        return match ($mode) {
            'never' => 1,
            'each_time' => 2,
            'only_when_internet' => 3,
            'every_x_days' => 4,
            'after_x_days_then_never' => 5,
            default => 0,
        };
    }

    public static function documentType($type): int
    {
        return match ($type) {
            'pdf' => 1,
            'video' => 2,
            default => 0,
        };
    }

 public static function accessScope($scope): int
    {
        return match ($scope) {
           'all_customers' => 1 ,
            'selected_customers'=>2,
            'publication'=>3,
            default => 1, // القيمة الافتراضية كما حددتها أنت
        };
    }


    // ========================================================
    // الجزء الثاني: من رقم (C#) إلى نص (Database) [التحويل العكسي]
    // ========================================================

    public static function documentTypeToString(int $type): string
    {
        return match ($type) {
            1 => 'pdf',
            2 => 'video',
            default => 'pdf', // قيمة افتراضية لتجنب الأخطاء
        };
    }

    public static function expiryModeToString(int $mode): string
    {
        return match ($mode) {
            1 => 'never',
            2 => 'fixed_date',
            3 => 'days_from_first_use',
            default => 'never',
        };
    }

    public static function verifyModeToString(int $mode): string
    {
        return match ($mode) {
            1 => 'never',
            2 => 'each_time',
            3 => 'only_when_internet',
            4 => 'every_x_days',
            5 => 'after_x_days_then_never',
            default => 'never',
        };
    }


    public static function accessScopeToString(int $scope): string
    {
        return match ($scope) {
            1 => 'all_customers',
            2 => 'selected_customers',
            3 => 'publication',
            default => 'selected_customers', // القيمة الافتراضية كما حددتها أنت
        };
    }

}
