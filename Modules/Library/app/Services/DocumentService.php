<?php
namespace Modules\Library\Services;


use Carbon\Carbon;
use Modules\Library\Models\Document;

class DocumentService
{
    public function getDocuments(array $filters, int $publisherId)
    {
        // نحمل إعدادات الحماية مع الملف لتجنب مشكلة N+1
        $query = Document::with('securityControls')
            ->where("access_scope", "selected_customers")
            ->where("publisher_id", $publisherId);

        // 1. فلتر البحث
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        // 2. فلتر العرض (الخيارات)
        $now = Carbon::now();

        switch ($filters['show']) {
            case 'suspend':
                $query->where('status', 'suspend');
                break;

            case 'expired':
                // الملف منتهي الصلاحية إذا كان fixed_date وتاريخه أقدم من الآن
                $query->whereHas('securityControls', function ($q) use ($now) {
                    $q->where('expiry_mode', 'fixed_date')
                        ->where('expiry_date', '<', $now);
                });
                break;

            case 'not_yet_expired':
                // الملف غير منتهي إذا كان fixed_date وتاريخه أكبر من الآن
                $query->whereHas('securityControls', function ($q) use ($now) {
                    $q->where('expiry_mode', 'fixed_date')
                        ->where('expiry_date', '>=', $now);
                });
                break;

            case 'expired_on':
                // البحث عن تاريخ محدد (نتجاهل الوقت ونطابق اليوم فقط)
                $query->whereHas('securityControls', function ($q) use ($filters) {
                    $q->where('expiry_mode', 'fixed_date')
                        ->whereDate('expiry_date', $filters['expired_on_date']);
                });
                break;
        }

        // 3. الترتيب
        // إذا كان الترتيب بالعنوان نجعله أبجدياً (asc)، وإلا فنجعله تنازلياً (desc)
        $sortDirection = $filters['sort_by'] === 'title' ? 'asc' : 'desc';
        $query->orderBy($filters['sort_by'], $sortDirection);

        return $query->paginate($filters['show_at_least']);
    }


    /**
     * تنفيذ الإجراءات على الملفات (حذف، إيقاف، تفعيل)
     */
    public function executeAction(array $ids, string $action)
    {
        $query = Document::whereIn('id', $ids);

        switch ($action) {
            case 'deleted':
                // حذف آمن (Soft Delete) بناءً على إعدادات جدولك
                $query->delete();
                break;

            case 'suspend':
                $query->update(['status' => 'suspend']);
                break;

            case 'active':
                // ملاحظة: قمنا بتغييرها إلى 'valid' لتطابق عمود الـ ENUM في قاعدتك
                $query->update(['status' => 'valid']);
                break;
        }

        return true;
    }


    /**
     * جلب تفاصيل مستند واحد مع إعدادات الحماية والناشر
     */
    public function getDocumentDetails(int $id)
    {
        // نحمل العلاقات دفعة واحدة باستخدام with
        return Document::with(['securityControls', 'publisher'])->findOrFail($id);
    }


    /**
     * تعديل بيانات الملف (الوصف والتاريخ فقط)
     */
    /**
     * تعديل بيانات الملف (الوصف وتاريخ الانتهاء)
     */
    public function updateDocument(int $id, array $data)
    {
        $document = Document::with('securityControls')->findOrFail($id);

        // 1. تحديث الوصف في جدول documents
        if (array_key_exists('note', $data)) {
            $document->description = $data['note'];
            $document->save();
        }

        // 2. تحديث تاريخ الانتهاء في جدول document_security_controls
        if (array_key_exists('expiry_date', $data)) {
            $controls = $document->securityControls;
            if ($controls) {
                $controls->expiry_date = $data['expiry_date'];

                // لضمان عمل التاريخ، نتأكد أن وضع الانتهاء مضبوط على تاريخ ثابت
                $controls->expiry_mode = 'fixed_date';
                $controls->save();
            }
        }

        return true;
    }
}
?>