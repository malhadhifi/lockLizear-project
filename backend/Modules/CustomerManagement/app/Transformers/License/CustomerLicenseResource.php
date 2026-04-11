<?php
namespace Modules\CustomerManagement\Transformers\License;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class CustomerLicenseResource extends JsonResource
{
    public function toArray($request)
    {
        // 1. تجهيز بيانات ui_status الأساسية
        $uiStatus = [
            'registration' => $this->registered_at ? 'register at ' . Carbon::parse($this->registered_at)->format('Y-m-d') : 'not registers',
            'account_status' => $this->status === 'active' ? 'enabled' : 'suspend',
        ];

        // 2. التحقق من انتهاء الصلاحية
        $isExpired = !$this->never_expires && $this->valid_until && Carbon::parse($this->valid_until)->isPast();

        if ($isExpired) {
            // إذا كانت منتهية
            $uiStatus['expired_on'] = 'expired on ' . Carbon::parse($this->valid_until)->format('Y-m-d');
        } else {
            // إذا لم تكن منتهية نرجع تاريخ البدء
            $uiStatus['valid_from'] = 'valid from ' . Carbon::parse($this->valid_from)->format('Y-m-d');
            // if (!$this->never_expires && $this->valid_until) {
            //     $uiStatus['valid_until'] = 'valid until ' . Carbon::parse($this->valid_until)->format('Y-m-d');
            // }
            // elseif($this->never_expires){
            //     $uiStatus['valid_until'] = 'valid until never';
            // }
        }


        // 3. تجهيز المصفوفة النهائية
        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'type' => $this->type,
            'ui_status' => $uiStatus,
        ];

        // 4. إرجاع الشركة فقط إذا لم تكن null
        if (!is_null($this->company)) {
            $data['company'] = $this->company;
        }

        // 5. إرجاع عدد الكروت فقط إذا كانت الرخصة جماعية
        if ($this->type === 'group') {
            $data['count_license'] = $this->vouchers_count ?? 0;
        }

        return $data;
    }
}
?>
