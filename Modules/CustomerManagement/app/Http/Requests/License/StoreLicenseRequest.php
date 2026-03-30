<?php
namespace Modules\CustomerManagement\Http\Requests\License;

use App\Http\Requests\BaseRequest;

class StoreLicenseRequest extends BaseRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            // حقل الناشر (يجب إرساله أو يمكن أخذه من Auth مستقبلاً)
            // 'publisher_id' => 'required|exists:publishers,id',

            // البيانات الأساسية للرخصة
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'company' => 'nullable|string|max:255', // بديل organization_name
            'note' => 'nullable|string|max:255',

            // التواريخ والصلاحية
            'valid_from' => 'required|date',
            'never_expires' => 'required|boolean',
            'valid_until' => 'required_if:never_expires,false|nullable|date|after_or_equal:valid_from',

            // إعدادات الرخصة
            'type' => 'required|in:individual,group', // يحدد هل هي فردية أم جماعية
            'count_license' => 'required_if:type,group|nullable|integer|min:1',
            'send_via_email' => 'required|boolean',

            // المصفوفات (اختيارية)
            'documents' => 'nullable|array',
            'documents.*' => 'integer|exists:documents,id',

            'publications' => 'nullable|array',
            'publications.*' => 'integer|exists:publications,id',

            // حقل عدد الكروت مطلوب فقط إذا كان نوع الرخصة "جماعية"

        ];
    }
}
