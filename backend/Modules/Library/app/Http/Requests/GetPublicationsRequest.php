<?php

namespace Modules\Library\Http\Requests;

use App\Http\Requests\BaseRequest;


class GetPublicationsRequest extends BaseRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            // هذا الحقل تم حقنه بواسطة الـ Middleware
            'publisher_id' => 'required|exists:publishers,id',
        ];
    }
}
