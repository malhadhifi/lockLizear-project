<?php

namespace Modules\Library\Http\Requests\Publications;


use App\Http\Requests\BaseRequest;
class StorePublicationRequest extends BaseRequest
{
    public function authorize()
    {
        return $this->user() !== null;
    }

protected function prepareForValidation()
{
    $this->merge([
        'publisher_id' => $this->user()->id,
    ]);
}

public function rules()
{
    return [
        'name'         => 'required|string|max:64',
        'description'  => 'nullable|string',
        'obey'         => 'boolean',
        
        // 🌟 أضف هذا السطر:
        // نضعه كـ 'required' لكي يظهر في مصفوفة الـ validated
        // وبما أننا دمجناه في prepareForValidation فهو دائماً موجود
        'publisher_id' => 'required|integer', 
    ];
}



   


}
