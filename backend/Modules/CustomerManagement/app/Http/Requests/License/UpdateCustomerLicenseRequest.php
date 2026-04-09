<?php
namespace Modules\CustomerManagement\Http\Requests\License;

use App\Http\Requests\BaseRequest;

class UpdateCustomerLicenseRequest extends BaseRequest{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'company' => 'nullable|string|max:255',
            'note' => 'nullable|string|max:255',

            // يجب أن ترسل الواجهة 'active' أو 'suspend' للتحديث
            'status' => 'sometimes|in:active,suspend',

            'valid_from' => 'sometimes|date',
            'never_expires' => 'sometimes|boolean',

            // تاريخ الانتهاء مطلوب فقط إذا كان never_expires = false
            'valid_until' => 'required_if:never_expires,false|nullable|date|after_or_equal:valid_from',
            // ---------------------------------------------------------
            // إضافة التحقق من تعديلات المنشورات المدمجة
            // ---------------------------------------------------------
            'publications_actions' => 'nullable|array',
            'publications_actions.*.action' => 'required_with:publications_actions|in:unlimited,limited,revoke',
            'publications_actions.*.publication_ids' => 'required_with:publications_actions|array|min:1',
            'publications_actions.*.publication_ids.*' => 'integer|exists:publications,id',
            'publications_actions.*.valid_from' => 'required_if:publications_actions.*.action,limited|nullable|date',
            'publications_actions.*.valid_until' => 'required_if:publications_actions.*.action,limited|nullable|date|after_or_equal:publications_actions.*.valid_from',

            // ---------------------------------------------------------
            // إضافة التحقق من تعديلات الملفات المدمجة
            // ---------------------------------------------------------
            'documents_actions' => 'nullable|array',
            'documents_actions.*.action' => 'required_with:documents_actions|in:unlimited,limited,baselimited,revoke',
            'documents_actions.*.document_ids' => 'required_with:documents_actions|array|min:1',
            'documents_actions.*.document_ids.*' => 'integer|exists:documents,id',
            'documents_actions.*.valid_from' => 'required_if:documents_actions.*.action,limited|nullable|date',
            'documents_actions.*.valid_until' => 'required_if:documents_actions.*.action,limited|nullable|date|after_or_equal:documents_actions.*.valid_from',
        ];
    }
}
?>
