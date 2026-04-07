<?php

namespace Modules\Library\Http\Requests\Publications;

use Modules\Library\Http\Requests\BaseLibraryRequest;

class StorePublicationRequest extends BaseLibraryRequest
{
    public function authorize()
    {
        return true; // تأكد من وضع صلاحيات المستخدم هنا لاحقاً
    }

    public function rules()
    {
        return [
            // الاسم مطلوب، ويجب ألا يتجاوز 64 حرف، ويجب ألا يتكرر لنفس الناشر (اختياري حسب البزنس)
            'name' => 'required|string|max:64',
            'description' => 'nullable|string',
            'obey' => 'boolean',
            // سنفترض أن معرف الناشر يأتي من الجلسة (Auth) أو يتم إرساله (أو الافتراضي 1)
            'publisher_id' => 'nullable|exists:publishers,id',
        ];
    }
}
