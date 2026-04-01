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

            'download_url' => $this->file_path ? route('customer-licenses.download', $this->id) : null,

        ];

        // إذا كانت رخصة جماعية، نجلب عدد الكروت
        if ($this->type === 'group') {
            $data['count_license'] = $this->vouchers_count ?? 0;
        }

        return $data;
    }
}
?>
public function toArray($request)
{
return [
'id' => $this->id,
'name' => $this->name,
'email' => $this->email,
// ... الحقول السابقة ...

// إرجاع رابط التحميل إذا كان الملف موجوداً

// إذا أردت توفير خيار "إعادة توليد" الملف في حال فُقد أو حُدثت البيانات
'has_file' => (bool) $this->file_path,
];
}
