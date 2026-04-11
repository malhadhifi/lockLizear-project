<?php
namespace Modules\Library\Http\Requests\Documents;

use App\Http\Requests\BaseRequest;


class DocumentActionRequest extends BaseRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            // يدعم ملف واحد أو عدة ملفات
            'document_ids' => 'required|array|min:1',
            'document_ids.*' => 'integer|exists:documents,id',

            // الإجراءات التي طلبتها
            'action' => 'required|in:deleted,suspend,active',
        ];
    }
}
?>
