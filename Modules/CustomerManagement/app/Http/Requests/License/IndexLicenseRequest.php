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
            'sort_by' => $this->sort_by ?? 'id',
            'show_at_least' => $this->show_at_least ?? 25,
            'show' => $this->show ?? 'all',
        ]);
    }

    public function rules()
    {
        return [
            'search' => 'nullable|string|max:100',
            // الترتيب مسموح حسب الشركة، تاريخ البدء، أو المعرف
            'sort_by' => 'in:company,name,valid_from,id',
            'show_at_least' => 'integer|min:25',
            // الفلاتر المطلوبة
            'show' => 'in:all,registered,not_registered,suspend,expired',
        ];
    }
}
?>