<?php
namespace Modules\Library\Http\Requests\Documents;

use App\Http\Requests\BaseRequest;

class UpdateDocumentRequest extends BaseRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            // 'note' => 'nullable|string',
            // 'expiry_date' => 'nullable|date',
            // وصف المستند
            'note' => 'nullable|string|max:2000',

            // إعدادات انتهاء الصلاحية
            'expiry_mode' => 'nullable|in:none,never,fixed_date,days_from_first_use',
            'expiry_date' => 'nullable|date',
            'expiry_days' => 'nullable|integer|min:1',

            // إعدادات التحقق
            'verify_mode' => 'nullable|in:none,periodic,on_every_open',
            'verify_frequency_days' => 'nullable|integer|min:1',
            'grace_period_days' => 'nullable|integer|min:0',

            // حد المشاهدات
            'max_views_allowed' => 'nullable|integer|min:0',

            // إعدادات الطباعة والسجلات السجلات الجديدة
            'print_mode' => 'nullable|in:disabled,unlimited,limited',
            'max_prints_allowed' => 'nullable|integer|min:0',
            'log_views' => 'nullable|boolean',
            'log_prints' => 'nullable|boolean',
        ];
    }

    public function messages()
    {
        return [
            'expiry_mode.in' => 'expiry_mode must be: none, fixed_date, or days_from_first_use',
            'verify_mode.in' => 'verify_mode must be: none, periodic, or on_every_open',
        ];
    }
}

?>
