<?php

namespace Modules\Library\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class DocumentDetailsResource extends JsonResource
{
    public function toArray($request)
    {
        $controls = $this->securityControls;
        $now      = Carbon::now();

        // 1. معالجة حقل الانتهاء
        $expires = 'never';
        if ($controls) {
            if ($controls->expiry_mode === 'fixed_date') {
                $expires = $controls->expiry_date
                    ? Carbon::parse($controls->expiry_date)->format('Y-m-d')
                    : 'never';
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
            'id'          => $this->id,
            'title'       => $this->title,
            'published'   => $this->published_at
                ? Carbon::parse($this->published_at)->format('Y-m-d')
                : null,
            'expires'     => $expires,
            'status'      => $currentStatus,
            'access'      => $this->access_scope,
            'note'        => $this->description,
            'customers_count'    => $this->customerlicense_count ?? 0,
            'publication_count'  => $this->publication_count ?? 0,

            // تفاصيل إضافية
            'details' => [
                'views'           => $controls ? ($controls->max_views_allowed ?? 'غير محدود') : 'غير محدود',
                'publisher_name'  => $this->publisher ? $this->publisher->name : 'غير معروف',
                'published_at'    => $this->published_at
                    ? Carbon::parse($this->published_at)->format('Y-m-d H:i:s')
                    : null,
                'validation_check'  => $validationMsg,
                'original_filename' => $this->original_filename,
                'file_size'         => $this->size,
            ],

            // إعدادات الحماية الكاملة (DRM)
            'security' => [
                'expiry_mode'           => $controls?->expiry_mode ?? 'never',
                'expiry_date'           => $controls?->expiry_date
                    ? Carbon::parse($controls->expiry_date)->format('Y-m-d')
                    : null,
                'expiry_days'           => $controls?->expiry_days,
                'verify_mode'           => $controls?->verify_mode ?? 'never',
                'verify_frequency_days' => $controls?->verify_frequency_days,
                'grace_period_days'     => $controls?->grace_period_days,
                'max_views_allowed'     => $controls?->max_views_allowed,
                'print_mode'            => $controls?->print_mode ?? 'disabled',
                'max_prints_allowed'    => $controls?->max_prints_allowed,
                'log_views'             => (bool) ($controls?->log_views ?? false),
                'log_prints'            => (bool) ($controls?->log_prints ?? false),
            ],
        ];
    }
}
