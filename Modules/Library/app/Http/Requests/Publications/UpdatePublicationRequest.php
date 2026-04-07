<?php

namespace Modules\Library\Http\Requests\Publications;

use App\Http\Requests\BaseRequest;




class UpdatePublicationRequest extends BaseRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            // لاحظ: حقل name غير موجود هنا لمنع تعديله تماماً
            'description' => 'nullable|string',
            'obey' => 'boolean',
        ];
    }
}
