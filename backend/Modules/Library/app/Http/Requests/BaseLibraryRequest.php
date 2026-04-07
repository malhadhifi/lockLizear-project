<?php

namespace Modules\Library\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * هذا هو "الأب" الذي سترث منه كل طلبات تطبيق القارئ
 */
abstract class BaseLibraryRequest extends FormRequest
{
    use \App\Traits\ApiResponseTrait;

    /**
     * اعتراض أخطاء التحقق (Validation) وتغليفها بالغلاف الموحد
     */
    protected function failedValidation(Validator $validator)
    {
        $response = $this->sendResponse(
            false,
            4020, // كود: بيانات المدخلات غير صحيحة
            $validator->errors(), // نضع تفاصيل الأخطاء داخل الـ data
            422
        );

        throw new HttpResponseException($response);
    }
}
