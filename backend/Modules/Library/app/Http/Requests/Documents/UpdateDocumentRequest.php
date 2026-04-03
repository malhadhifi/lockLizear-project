<?php
namespace Modules\Library\Http\Requests\Documents;

use App\Http\Requests\BaseRequest;

class UpdateDocumentRequest extends BaseRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            // حقول جدول documents
            'note'         => 'nullable|string',
            'status'       => 'nullable|in:valid,suspended',

            // حقول جدول document_security_controls
            'expiry_date'           => 'nullable|date',
            'expiry_mode'           => 'nullable|in:fixed_date,days_from_first_use,never',
            'expiry_days'           => 'nullable|integer|min:1',
            'verify_mode'           => 'nullable|in:never,each_time,only_when_internet,every_x_days,after_x_days_then_never',
            'verify_frequency_days' => 'nullable|integer|min:1',
            'grace_period_days'     => 'nullable|integer|min:0',
            'max_views_allowed'     => 'nullable|integer|min:0',
        ];
    }
}
