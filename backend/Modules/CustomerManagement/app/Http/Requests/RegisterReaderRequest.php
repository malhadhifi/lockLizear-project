<?php

namespace Modules\CustomerManagement\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterReaderRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:readers,email',
            'password'    => 'required|string|min:8|confirmed',
            'hardware_id' => 'required|string|max:255',
            'device_name' => 'nullable|string|max:255',
            'device_type' => 'nullable|string|max:100',
            'os_version'  => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'        => 'الاسم مطلوب.',
            'email.required'       => 'البريد الإلكتروني مطلوب.',
            'email.unique'         => 'هذا البريد الإلكتروني مسجل مسبقاً.',
            'password.required'    => 'كلمة المرور مطلوبة.',
            'password.min'         => 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.',
            'password.confirmed'   => 'كلمتا المرور غير متطابقتين.',
            'hardware_id.required' => 'معرّف الجهاز مطلوب.',
        ];
    }
}
