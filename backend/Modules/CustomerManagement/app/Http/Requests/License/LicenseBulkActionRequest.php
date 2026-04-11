<?php
namespace Modules\CustomerManagement\Http\Requests\License;

use App\Http\Requests\BaseRequest;

class LicenseBulkActionRequest extends BaseRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'license_ids' => 'required|array|min:1',
            'license_ids.*' => 'integer|exists:customer_licenses,id',

            // الإجراءات المطلوبة
            'action' => 'required|in:suspend,active,delete,grant_access_to_publication,grant_access_to_documents,resend_license',

            // مصفوفة المنشورات مطلوبة فقط في حالة منح وصول للمنشورات
            'publication_ids' => 'required_if:action,grant_access_to_publication|array|min:1',
            'publication_ids.*' => 'integer|exists:publications,id',

            // مصفوفة الملفات مطلوبة فقط في حالة منح وصول للملفات
            'document_ids' => 'required_if:action,grant_access_to_documents|array|min:1',
            'document_ids.*' => 'integer|exists:documents,id',
        ];
    }
}
?>
