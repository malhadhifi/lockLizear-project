<?php

namespace Modules\ReaderApp\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;
use App\Traits\ApiResponseTrait;

class LogoutReaderRequest extends BaseRequest
{
    use ApiResponseTrait;

    public function authorize()
    {
        // مسموح فقط للمستخدمين المسجلين دخولهم (سيتم حماية الراوت بـ auth:sanctum)
        return true;
    }

    public function rules()
    {
        return [
            'hardware_id' => 'required|string',
        ];
    }
}
