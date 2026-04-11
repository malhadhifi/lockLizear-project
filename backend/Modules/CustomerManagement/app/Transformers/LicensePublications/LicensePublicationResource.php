<?php
namespace Modules\CustomerManagement\Transformers\LicensePublications;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class LicensePublicationResource extends JsonResource
{
    public function toArray($request)
    {
        // استخراج بيانات الرخصة (العميل) من العلاقة
        $customerLicense = $this->customerlicense->first();
        $access = 'no';
        $date = Carbon::parse($this->created_at)->format('Y-m-d');
        if ($customerLicense && $customerLicense->pivot->status !== 'revoked') {
            if ($customerLicense->pivot->access_mode === 'unlimited') {
                $access = 'unlimited';
            } else {
                $from = Carbon::parse($customerLicense->pivot->valid_from)->format('Y-m-d');
                $to = Carbon::parse($customerLicense->pivot->valid_until)->format('Y-m-d');
                $access = $from . ' to ' . $to;
            }
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'obey' => $this->obey ? 'yes' : 'no',
            'access' => $access,
            'date_at' => $date,
        ];
    }
}
?>
