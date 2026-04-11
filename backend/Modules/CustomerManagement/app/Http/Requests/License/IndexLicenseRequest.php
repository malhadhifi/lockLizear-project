<?php
namespace Modules\CustomerManagement\Http\Requests\License;

use App\Http\Requests\BaseRequest;


class IndexLicenseRequest extends BaseRequest
{
    public function authorize()
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'sort' => $this->sort_by ?? 'id',
            'limit' => $this->show_at_least ?? 25,
            'show' => $this->show ?? 'all',
        ]);
    }

    public function rules()
    {
        return [
            'search' => 'nullable|string|max:100',
            // الترتيب مسموح حسب الشركة، تاريخ البدء، أو المعرف
            'sort' => 'in:company,name,published_at,id',
            'limit' => 'integer|min:25',

            'show' => 'in:all,registered,not_registered,suspend,expired',
        ];
    }
}
?>
