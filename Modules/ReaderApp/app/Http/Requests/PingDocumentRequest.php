<?php

namespace Modules\ReaderApp\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Traits\ApiResponseTrait;

class PingDocumentRequest extends FormRequest
{
    use ApiResponseTrait;

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'hardware_id' => 'required|string',
            'document_uuid' => 'required|string',
            'last_connected_at' => 'required|date', // تاريخ آخر اتصال للملف في قاعدة الموبايل

            // بيانات الرخصة (مطلوبة دائماً إلا إذا كان الملف للجميع، لكن الأفضل إرسالها دائماً)
            'license_type' => 'nullable|in:individual,voucher',
            'license_id' => 'nullable|integer', // رقم الرخصة أو رقم الكرت
            'publication_id' => 'nullable|integer', // إذا كان الملف يتبع منشوراً
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->sendResponse(false, 4020, $validator->errors(), 422)
            
        );
    }
}
