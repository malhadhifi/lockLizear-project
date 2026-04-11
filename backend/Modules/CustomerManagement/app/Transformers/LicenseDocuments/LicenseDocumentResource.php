<?php


namespace Modules\CustomerManagement\Transformers\LicenseDocuments;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class LicenseDocumentResource extends JsonResource
{
    public function toArray($request)
    {
        $controls = $this->securityControls;
        $now = Carbon::now();

        // 1. معالجة حقل الانتهاء (expires) مع إضافة كلمة expired في حال الانتهاء
        $expires = 'never';
        if ($controls) {
            if ($controls->expiry_mode === 'fixed_date' && $controls->expiry_date) {
                $date = Carbon::parse($controls->expiry_date);
                if ($date->isPast()) {
                    $expires = 'expired ' . $date->format('Y-m-d');
                } else {
                    $expires = $date->format('Y-m-d');
                }
            } elseif ($controls->expiry_mode === 'days_from_first_use') {
                $expires = $controls->expiry_days . ' days';
            }
        }

        // 2. معالجة حقل الوصول المباشر (direct_access)
// نتحقق أولاً هل العلاقة موجودة، ثم نجلب العنصر الأول منها
        $customerLicense = $this->customerlicense ? $this->customerlicense->first() : null;
        $directAccess = 'no'; // الافتراضي إذا لم يكن مربوطاً أو تم إلغاؤه

        if ($customerLicense && $customerLicense->pivot->status !== 'revoked') {
            $mode = $customerLicense->pivot->access_mode;

            if ($mode === 'baselimited') {
                $directAccess = 'yes';
            } elseif ($mode === 'unlimited') {
                $directAccess = 'unlimited';
            } elseif ($mode === 'limited') {
                $from = Carbon::parse($customerLicense->pivot->valid_from)->format('Y-m-d');
                $to = Carbon::parse($customerLicense->pivot->valid_until)->format('Y-m-d');
                $directAccess = $from . ' for ' . $to;
            }
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'published' => $this->published_at ? Carbon::parse($this->published_at)->format('Y-m-d') : null,
            'status' => $this->status,
            'type' => $this->type,
            'expires' => $expires,
            'direct_access' => $directAccess,
        ];
    }
}
