<?php
namespace Modules\CustomerManagement\Transformers\License;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class CustomerLicenseDetailsResource extends JsonResource
{
    public function toArray($request)
    {
        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'company' => $this->company,
            'note' => $this->note,
            'type' => $this->type, // فردية أو جماعية

            // صياغة الحالة والتسجيل كما فعلنا سابقاً
            'status' => $this->status === 'active' ? 'enabled' : 'suspend',
            'registered' => $this->registered_at ? 'register at ' . Carbon::parse($this->registered_at)->format('Y-m-d') : 'not registers',

            // جلب التواريخ
            'start_date' => $this->valid_from ? Carbon::parse($this->valid_from)->format('Y-m-d') : null,
            'never_expires' => (bool) $this->never_expires,
            'valid_until' => $this->valid_until ? Carbon::parse($this->valid_until)->format('Y-m-d') : null,
            'download_url' => $this->file_path ? url("api/customer-management/customer-licenses/{$this->id}/download") : null,

            'publications_count' => $this->publications ? $this->publications->count() : 0,
            'documents_count' => $this->documents ? $this->documents->count() : 0,
            'publications' => $this->whenLoaded('publications'),
            'documents'    => $this->whenLoaded('documents'),
        ];

        // إذا كانت رخصة جماعية، نجلب عدد الكروت
        if ($this->type === 'group') {
            $data['count_license'] = $this->vouchers_count ?? 0;
        }

        return $data;
    }
}
