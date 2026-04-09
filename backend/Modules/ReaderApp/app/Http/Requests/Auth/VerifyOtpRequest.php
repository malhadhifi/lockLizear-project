<?php

namespace Modules\ReaderApp\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Traits\ApiResponseTrait;

class VerifyOtpRequest extends FormRequest
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
            'otp_code' => 'required|string|min:5', // تأكد أن الرقم من 4 خانات
            'hardware_id' => 'required|string', // لربط التوكن بالجهاز
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->sendResponse(false, 4020, $validator->errors(), 422)
        );
    }
}
