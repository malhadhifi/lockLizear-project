<?php

namespace Modules\ReaderApp\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;
use App\Traits\ApiResponseTrait;

class RegisterReaderRequest extends BaseRequest
{
    use ApiResponseTrait; // نستخدم التريت الخاص بنا هنا أيضاً

    public function authorize()
    {
        return true; // مسموح للجميع بالتسجيل
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:readers,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8', // يمكنك إضافة شروط أقوى لاحقاً

            // مصفوفة الجهاز (إجبارية)
            'device_info' => 'required|array',
            'device_info.hardware_id' => 'required|string',
            'device_info.name' => 'required|string',
            'device_info.device_type' => 'required|string', // نوع الجهاز (مثال: Windows, Android)
            'device_info.os_version' => 'nullable|string',
            'device_info.app_version' => 'nullable|string',
        ];
    }

    /**
     * إجبار لارافل على إرجاع خطأ التحقق بنفس التصميم الموحد الخاص بنا
     */

}
