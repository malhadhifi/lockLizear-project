<?php

namespace Modules\Library\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class DocumentDetailsResource extends JsonResource
{
    public function toArray($request)
    {
        $controls = $this->securityControls;
        $now = Carbon::now();

        // 1. معالجة حقل الانتهاء (expires)
        $expires = 'never';
        if ($controls) {
            if ($controls->expiry_mode === 'fixed_date') {
                $expires = $controls->expiry_date ? Carbon::parse($controls->expiry_date)->format('Y-m-d') : 'never';
            } elseif ($controls->expiry_mode === 'days_from_first_use') {
                $expires = $controls->expiry_days . ' days';
            }
        }

        // 2. معالجة الحالة (status) مع تجاوزها إذا كان التاريخ ثابتاً ومنتهياً
        $currentStatus = $this->status;
        if ($controls && $controls->expiry_mode === 'fixed_date' && $controls->expiry_date) {
            if (Carbon::parse($controls->expiry_date)->isPast()) {
                $currentStatus = 'expired';
            }
        }

        // 3. معالجة رسائل التحقق (validation check)
        $validationMsg = 'لا يوجد إعدادات حماية';
        if ($controls) {
            switch ($controls->verify_mode) {
                case 'never':
                    $validationMsg = 'لا يتطلب الاتصال بالإنترنت للتحقق.';
                    break;
                case 'each_time':
                    $validationMsg = 'يتطلب التحقق عبر الإنترنت في كل مرة يتم فتح الملف.';
                    break;
                case 'only_when_internet':
                    $validationMsg = 'يتم التحقق في الخلفية فقط عند توفر اتصال بالإنترنت.';
                    break;
                case 'every_x_days':
                    $validationMsg = 'يجب الاتصال بالإنترنت للتحقق كل ' . $controls->verify_frequency_days . ' أيام.';
                    break;
                case 'after_x_days_then_never':
                    $validationMsg = 'يجب التحقق بعد ' . $controls->verify_frequency_days . ' أيام من أول استخدام، ثم لا يطلب التحقق أبداً.';
                    break;
            }
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'published' => $this->published_at ? Carbon::parse($this->published_at)->format('Y-m-d') : null,
            'expires' => $expires,
            'status' => $currentStatus,
            'access' => $this->access_scope,
            'note' => $this->description,

            // كائن التفاصيل (Details Object)
            'details' => [
                'views' => $controls ? ($controls->max_views_allowed ?? 'غير محدود') : 'غير محدود',
                'publisher_name' => $this->publisher ? $this->publisher->name : 'غير معروف', // افترضت أن حقل اسم الناشر هو name
                'published_at' => $this->published_at ? Carbon::parse($this->published_at)->format('Y-m-d H:i:s') : null,
                'validation_check' => $validationMsg,
                'original_name' => $this->original_filename, // أضفت الاسم الأصلي للملف ليكون مفيداً
            ]
        ];
    }
}
?>
