<?php
namespace Modules\Library\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class DocumentResource extends JsonResource
{
    public function toArray($request)
    {
        $expiredDate = null;
        $controls = $this->securityControls;

        // التحقق ديناميكياً: إذا كان له تاريخ ثابت وهو في الماضي، نرجع التاريخ
        if ($controls && $controls->expiry_mode === 'fixed_date' && $controls->expiry_date) {
            $date = Carbon::parse($controls->expiry_date);
            if ($date->isPast()) {
                $expiredDate = $date->format('Y-m-d');
            }
        }

        return [
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->title,
            // تغيير الاسم للواجهة بناءً على طلبك
            'note' => $this->description,
            'status' => $this->status,
            'published' => $this->published_at ? Carbon::parse($this->published_at)->format('Y-m-d') : null,
            // يرجع التاريخ إذا كان منتهياً، وإلا يرجع null
            'expired' => $expiredDate,
        ];
    }
}
?>
