<?php

namespace Modules\ReaderApp\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;
use App\Traits\ApiResponseTrait;

class LoginReaderRequest extends BaseRequest
{
    use ApiResponseTrait;

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'email' => 'required|email',
            'password' => 'required|string',

            // مصفوفة الجهاز (إجبارية تماماً مثل التسجيل)
            'device_info' => 'required|array',
            'device_info.hardware_id' => 'required|string',
            'device_info.name' => 'required|string',
            'device_info.device_type' => 'required|string',
            'device_info.os_version' => 'nullable|string',
            'device_info.app_version' => 'nullable|string',
        ];
    }
}
