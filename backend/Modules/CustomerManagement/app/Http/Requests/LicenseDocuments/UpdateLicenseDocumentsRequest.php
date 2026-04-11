<?php
namespace Modules\CustomerManagement\Http\Requests\LicenseDocuments;

use App\Http\Requests\BaseRequest;


class UpdateLicenseDocumentsRequest extends BaseRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            // الإجراءات الأربعة المتاحة
            'action' => 'required|in:access,unlimited,limited,revoke',

            'document_ids' => 'required|array|min:1',
            'document_ids.*' => 'integer|exists:documents,id',

            // التواريخ مطلوبة فقط في حالة الوصول المحدود
            'valid_from' => 'required_if:action,limited|nullable|date',
            'valid_until' => 'required_if:action,limited|nullable|date|after_or_equal:valid_from',
        ];
    }
}
?>
