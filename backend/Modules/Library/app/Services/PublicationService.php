<?php
namespace Modules\Library\Services;

use Modules\Library\Models\Publication;

class PublicationService
{
    /**
     * إنشاء منشور جديد
     */
    public function createPublication(array $data)
    {
        // إذا لم يتم إرسال obey، نضع قيمته الافتراضية false
        $data['obey'] = $data['obey'] ?? false;
        
        // الافتراضي للـ publisher_id هو 1 لتجنب أخطاء قاعدة البيانات أثناء التطوير
        $data['publisher_id'] = $data['publisher_id'] ?? 1;

        return Publication::create($data);
    }

    /**
     * تعديل منشور موجود
     */
    public function updatePublication(Publication $publication, array $data)
    {
        // حماية إضافية: نضمن إزالة حقل الاسم إذا تم إرساله بالخطأ من الواجهة
        unset($data['name']);

        $data['obey'] = $data['obey'] ?? $publication->obey;

        $publication->update($data);

        return $publication;
    }




    /**
     * جلب المنشورات مع الفلترة
     */
    public function getPublications(array $filters)
    {
        $query = Publication::withCount(["documents","customerlicense"]);

        // 1. فلتر البحث (في الاسم والوصف)
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        // 2. فلتر الالتزام بالتاريخ (Show)
        if (!empty($filters['show']) && $filters['show'] !== 'all') {
            $obeyValue = $filters['show'] === 'obey_yes' ? true : false;
            $query->where('obey', $obeyValue);
        }

        // 3. الترتيب (Sort by)
        $sortBy = $filters['sort_by'] ?? 'created_at';
        // إذا كان الترتيب بالاسم نجعله تصاعدي، وإذا بالتاريخ نجعله تنازلي (الأحدث أولاً)
        $sortDirection = $sortBy === 'created_at' ? 'desc' : 'asc';
        $query->orderBy($sortBy, $sortDirection);

        // 4. عدد النتائج في الصفحة (Show at least)
        $limit = $filters['show_at_least'] ?? 25;

        // إرجاع البيانات بنظام التقسيم (Pagination)
        return $query->paginate($limit);
    }

    /**
     * تنفيذ الإجراءات الجماعية (حذف أو إيقاف)
     */
    public function executeBulkAction(array $ids, string $action)
    {
        // نستخدم whereIn لتطبيق التعديل على كل الـ IDs دفعة واحدة
        $query = Publication::whereIn('id', $ids);

        switch ($action) {
            case 'deleted':
                // لارافل سيقوم بتحديث حقل deleted_at تلقائياً (Soft Delete)
                $query->delete();
                break;

            case 'suspended':
                // تحديث حالة المنشور إلى suspend
                $query->update(['status' => 'suspend']);
                break;

            case 'active':
                // إعادة التفعيل (ميزة إضافية مجانية لك)
                $query->update(['status' => 'active']);
                break;
        }

        return true;
    }
}
?>
