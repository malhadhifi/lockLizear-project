<?php

namespace Modules\ReaderApp\Trait;// أو حسب مسار ملفاتك

use Carbon\Carbon;

trait DocumentDynamicStatusTrait
{
    /**
     * دالة مركزية لحساب حالة الملف اللحظية (valid, suspend, revoked, expired)
     * بناءً على التواريخ والأيام والجدول الوسيط
     */
    public function evaluateDynamicStatus($doc, $pivot, $sourceType)
    {
        // 1. الفحص الثابت (Hard Stops) - الأولوية للقرارات الإدارية
        if ($pivot && isset($pivot->status) && $pivot->status === 'revoked') {
            return 'revoked';
        }

        if ($doc->status === 'suspend' || ($pivot && isset($pivot->status) && $pivot->status === 'suspend')) {
            return 'suspend';
        }



        // 2. الفحص الديناميكي (Dynamic Time Check)
        $controls = $doc->securityControls;
        $expiryDate = null;

        // أ) استخراج تواريخ الانتهاء حسب نوع الصلاحية (Overrides)
        if ($sourceType === 'publication' && $pivot && $pivot->access_mode !== 'unlimited') {
            $expiryDate = $pivot->valid_until; // يأخذ تاريخ نهاية المنشور

        } elseif ($sourceType === 'selected_customers' && $pivot) {
            if ($pivot->access_mode === 'limited') {
                $expiryDate = $pivot->valid_until; // تجاوز بتاريخ محدد
            } elseif ($pivot->access_mode === 'baselimited') {
                $expiryDate = $controls->expiry_date ?? null;

            }
        } else {
            // مسار (all_customers) أو المنشور اللامحدود (يأخذ الإعدادات الأصلية للملف)
            $expiryDate = $controls->expiry_date ?? null;
        }

        // ب) مقصلة التاريخ الثابت (Fixed Date)
        if ($expiryDate && now()->greaterThan(Carbon::parse($expiryDate))) {
            return 'expired';
        }

        // إذا نجا الملف من كل هذه المقاصل الزمنية، فهو صالح!
        return 'valid';
    }
}
