<?php

namespace Modules\CustomerManagement\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerifyEmailRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'email'    => 'required|email|exists:readers,email',
            'otp_code' => 'required|string|size:6',
        ];
    }

    public function messages(): array
    {
        return [
            'email.exists'      => 'هذا البريد الإلكتروني غير موجود.',
            'otp_code.required' => 'كود التحقق مطلوب.',
            'otp_code.size'     => 'كود التحقق يجب أن يكون 6 أرقام.',
        ];
    }
}
