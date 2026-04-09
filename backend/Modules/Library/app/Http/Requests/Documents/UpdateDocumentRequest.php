<?php
namespace Modules\Library\Http\Requests\Documents;

use App\Http\Requests\BaseRequest;

class UpdateDocumentRequest extends BaseRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'note' => 'nullable|string',
            'expiry_date' => 'nullable|date',
        ];
    }
}
?>
