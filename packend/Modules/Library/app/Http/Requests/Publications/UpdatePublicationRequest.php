<?php

namespace Modules\Library\Http\Requests\Publications;

use Modules\Library\Http\Requests\BaseLibraryRequest;



class UpdatePublicationRequest extends BaseLibraryRequest
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
