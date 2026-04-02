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
            'sort_by' => $this->sort_by ?? 'name',
            'show_at_least' => $this->show_at_least ?? 25,
            'access_status' => $this->access_status ?? 'all', // all, granted, denied
        ]);
    }

    public function rules()
    {
        return [
            'search' => 'nullable|string|max:100',
            'sort_by' => 'in:name,created_at',
            'show_at_least' => 'integer|min:25',
            'show' => 'in:all,with_access,without_access',
        ];
    }
}
?>
