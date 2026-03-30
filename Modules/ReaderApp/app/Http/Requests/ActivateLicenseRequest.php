<?php

namespace Modules\ReaderApp\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Traits\ApiResponseTrait;

class ActivateLicenseRequest extends FormRequest
{
    use ApiResponseTrait;

    public function authorize()
    {
        return true; // مسموح للجميع طالما أنهم مسجلين دخول (سيتم حمايته بـ middleware لاحقاً)
    }

    public function rules()
    {
        return [
            'hardware_id' => 'required|string',
            'activation_type' => 'required|in:license_id,voucher_code', // يقبل قيمتين فقط
            'activation_key' => 'required|string', // قد يكون رقماً (ID) أو نصاً (Pin Code)
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->sendResponse(false, 4020, $validator->errors(), 422)
        );
    }
}
