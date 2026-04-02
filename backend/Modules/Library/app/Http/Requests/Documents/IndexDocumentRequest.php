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
            'sort_by' => $this->sort_by ?? 'id',
                        'show_at_least' => $this->per_page ?? $this->show_at_least ?? 25,
            'show' => $this->show ?? 'all',
        ]);
    }

    public function rules()
    {
        return [
            'search' => 'nullable|string|max:100',
            // الترتيب مسموح به حسب الـ id، العنوان، أو الوصف
            'sort_by' => 'in:id,title,description,published',
            'show_at_least' => 'integer|min:1',

            //  اضفنا  فلتره  valid
            // خيارات العرض التي طلبتها
            'show' => 'nullable|in:all,valid,suspended,expired,not_yet_expired,expired_on',

            // هذا الحقل مطلوب فقط إذا اختار المستخدم فلتر 'expired_on'
            'expired_on_date' => 'required_if:show,expired_on|nullable|date'
        ];
    }
}
?>
