<?php

namespace Modules\CustomerManagement\Http\Requests\License;

use App\Http\Requests\BaseRequest;

class StoreLicenseRequest extends BaseRequest
{
    public function authorize()
    {
        // يفضل أن تتأكد هنا أن الطلب قادم من مستخدم مسجل دخول فعلاً
        return auth('publisher_api')->user() !== null;
    }

    /**
     * هذه الدالة السحرية تعمل قبل التحقق
     * نقوم فيها بدمج بيانات إضافية للطلب أو تعديلها
     */
    protected function prepareForValidation()
    {
        $user = auth('publisher_api')->user();
        if ($user) {
            $this->merge([
                // نجبر الطلب على استخدام رقم الناشر من التوكن الحالي
                'publisher_id' => $user->id,
            ]);
        }
    }

    public function rules()
    {
        return [
            // الآن هذا الحقل سيجد الـ publisher_id الذي حقنّاه في الدالة السابقة
            'publisher_id' => 'required|exists:publishers,id',

            // البيانات الأساسية للرخصة
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'company' => 'nullable|string|max:255',
            'note' => 'nullable|string|max:255',

            // التواريخ والصلاحية
            'valid_from' => 'required|date',
            'never_expires' => 'required|boolean',
            'valid_until' => 'required_if:never_expires,false|nullable|date|after_or_equal:valid_from',

            // إعدادات الرخصة
            'type' => 'required|in:individual,group',
            'count_license' => 'required_if:type,group|nullable|integer|min:1',
            'send_via_email' => 'required|boolean',

            // المصفوفات (اختيارية)
            'documents' => 'nullable|array',
            'documents.*' => 'integer|exists:documents,id',

            'publications' => 'nullable|array',
            'publications.*' => 'integer|exists:publications,id',
        ];
    }
}
