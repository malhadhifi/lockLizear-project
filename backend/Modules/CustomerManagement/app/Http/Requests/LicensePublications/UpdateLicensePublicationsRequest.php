<?php
namespace Modules\CustomerManagement\Http\Requests\LicensePublications;

use App\Http\Requests\BaseRequest;


class UpdateLicensePublicationsRequest extends BaseRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            // الإجراء المطلوب تنفيذه
            'action' => 'required|in:unlimited,limited,revoke',

            // مصفوفة المنشورات المستهدفة
            'publication_ids' => 'required|array|min:1',
            'publication_ids.*' => 'integer|exists:publications,id', // يجب أن تكون المنشورات موجودة في قاعدة البيانات

            // التواريخ مطلوبة فقط إذا كان الإجراء "limited"
            'valid_from' => 'required_if:action,limited|nullable|date',
            'valid_until' => 'required_if:action,limited|nullable|date|after_or_equal:valid_from',
        ];
    }
}
?>
