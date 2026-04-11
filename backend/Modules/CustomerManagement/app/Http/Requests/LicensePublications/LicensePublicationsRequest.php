<?php

namespace Modules\CustomerManagement\Http\Requests\LicensePublications;

use App\Http\Requests\BaseRequest;

class LicensePublicationsRequest extends BaseRequest
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
            'sort' => 'in:id,name,date',
            'limit' => 'integer|min:25',
            // الفلاتر المحددة التي طلبتها بالضبط
            'show' => 'in:all,with_access,not_access',
        ];
    }
}
?>
