<?php
namespace Modules\Library\Http\Requests\Publications;

use Modules\Library\Http\Requests\BaseLibraryRequest;



class IndexPublicationRequest extends BaseLibraryRequest
{
    public function authorize()
    {
        return true;
    }

    /**
     * دمج القيم الافتراضية إذا لم يتم إرسالها من الويب
     */
    protected function prepareForValidation()
    {
        $this->merge([
            // إذا لم يتم إرسال ترتيب، اجعله حسب تاريخ الإنشاء
            'sort_by' => $this->sort_by ?? 'created_at',
            // إذا لم يتم تحديد العدد، اعرض 25 كقيمة افتراضية
            'show_at_least' => $this->show_at_least ?? 25,
            // إذا لم يتم تحديد نوع العرض، اجعله يعرض الكل
            'show' => $this->show ?? 'all',
        ]);
    }

    public function rules()
    {
        return [
            // حقل البحث يظل nullable لأنه لا يوجد له قيمة افتراضية (إما يبحث أو يتركه فارغاً)
            'search' => 'nullable|string|max:100',

            // باقي الحقول سيتم فحصها والتأكد أنها من ضمن الخيارات المسموحة فقط
            'sort_by' => 'in:name,created_at',
            'show_at_least' => 'integer|min:1',
            'show' => 'in:all,obey_yes,obey_no',
        ];
    }
}
?>
