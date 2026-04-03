<?php
namespace Modules\Library\Http\Requests\Documents;

use App\Http\Requests\BaseRequest;

class IndexDocumentRequest extends BaseRequest
{
    public function authorize()
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'sort_by'        => $this->sort_by ?? 'id',
            // يقبل per_page من الفرنت أو show_at_least وإلا القيمة الافتراضية 25
            'show_at_least'  => (int) ($this->per_page ?? $this->show_at_least ?? 25),
            'per_page'       => (int) ($this->per_page ?? $this->show_at_least ?? 25),
            'show'           => $this->show ?? 'all',
            'page'           => (int) ($this->page ?? 1),
        ]);
    }

    public function rules()
    {
        return [
            'search'          => 'nullable|string|max:100',
            'sort_by'         => 'in:id,title,description,published',
            'show_at_least'   => 'integer|min:1|max:100',
            'per_page'        => 'integer|min:1|max:100',
            'page'            => 'integer|min:1',
            'show'            => 'nullable|in:all,valid,suspended,expired,not_yet_expired,expired_on',
            'expired_on_date' => 'required_if:show,expired_on|nullable|date',
        ];
    }
}
