<?php
namespace Modules\Library\Http\Requests\Documents;

use App\Http\Requests\BaseRequest;


class IndexDocumentRequest extends BaseRequest
{
    public function authorize()
    {
        return $this->user() !== null;
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
            // الترتيب مسموح به حسب الـ id، العنوان، أو الوصف
            'sort_by' => 'in:id,title,description',
            'show_at_least' => 'integer|min:1',

            // خيارات العرض التي طلبتها
            'show' => 'in:all,suspend,expired,not_yet_expired,expired_on',

            // هذا الحقل مطلوب فقط إذا اختار المستخدم فلتر 'expired_on'
            'expired_on_date' => 'required_if:show,expired_on|nullable|date'
        ];
    }
}
?>