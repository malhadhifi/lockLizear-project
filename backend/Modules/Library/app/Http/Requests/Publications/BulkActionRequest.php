<?php
namespace Modules\Library\Http\Requests\Publications;

use App\Http\Requests\BaseRequest;




class BulkActionRequest extends BaseRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            // يجب أن يرسل مصفوفة تحتوي على ID واحد على الأقل
            'publication_ids' => 'required|array|min:1',
            // كل عنصر في المصفوفة يجب أن يكون رقماً وموجوداً في جدول المنشورات
            'publication_ids.*' => 'integer|exists:publications,id',

            // الإجراء يجب أن يكون واحداً من هذه الخيارات (أضفت active تحسباً لفك الإيقاف مستقبلاً)
            'action' => 'required|in:delete,suspend,active',
        ];
    }
}
?>
