<?php

namespace Modules\ReaderApp\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Traits\ApiResponseTrait;

class ResendOtpRequest extends FormRequest
{
    use ApiResponseTrait;

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            // يجب أن يكون الإيميل موجوداً في جدول readers
            'email' => 'required|email|exists:readers,email',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $response = $this->sendResponse(
            false,
            4020, // كود: بيانات المدخلات غير صحيحة
            $validator->errors(),
            422
        );

        throw new HttpResponseException($response);
    }
}
