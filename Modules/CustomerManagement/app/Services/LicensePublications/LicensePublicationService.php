<?php
namespace Modules\CustomerManagement\Services\LicensePublications;

use Modules\CustomerManagement\Models\CustomerLicense;
use Modules\Library\Models\Publication;
class LicensePublicationService
{
    public function getCustomerPublications(int $customerLicenseId, array $filters)
    {
        $query = Publication::with([
            'customerlicense' => function ($q) use ($customerLicenseId) {
                $q->where('customer_licenses.id', $customerLicenseId);
            }
        ]);

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        if ($filters['access_status'] === 'granted') {
            $query->whereHas('customers', function ($q) use ($customerLicenseId) {
                $q->where('customer_licenses.id', $customerLicenseId)
                    ->where('license_publications.status', '!=', 'revoked');
            });
        } elseif ($filters['access_status'] === 'denied') {
            $query->whereDoesntHave('customers', function ($q) use ($customerLicenseId) {
                $q->where('customer_licenses.id', $customerLicenseId)
                    ->where('license_publications.status', '!=', 'revoked');
            });
        }

        $sortDirection = $filters['sort_by'] === 'created_at' ? 'desc' : 'asc';
        $query->orderBy($filters['sort_by'], $sortDirection);

        return $query->paginate($filters['show_at_least']);
    }


    /**
     * تحديث صلاحيات وصول عميل محدد لمجموعة منشورات
     */
    public function updatePublicationsAccess(int $customerLicenseId, array $data)
    {
        // 1. جلب رخصة العميل
        $customerLicense = CustomerLicense::findOrFail($customerLicenseId);

        // 2. تجهيز البيانات التي ستُحفظ في الجدول الوسيط بناءً على الإجراء المختار
        $pivotData = [];

        if ($data['action'] === 'unlimited') {
            $pivotData = [
                'access_mode' => 'unlimited',
                'valid_from' => null,
                'valid_until' => null,
                'status' => 'active',
            ];
        } elseif ($data['action'] === 'limited') {
            $pivotData = [
                'access_mode' => 'limited',
                'valid_from' => $data['valid_from'],
                'valid_until' => $data['valid_until'],
                'status' => 'active',
            ];
        } elseif ($data['action'] === 'revoke') {
            // في حال الإلغاء، نكتفي بتغيير الحالة إلى revoked
            $pivotData = [
                'status' => 'revoked',
            ];
        }

        // 3. تشكيل المصفوفة بالصيغة التي تفهمها دالة syncWithoutDetaching في لارافل
        // الصيغة المطلوبة: [ id1 => ['status' => 'active'], id2 => ['status' => 'active'] ]
        $syncData = [];
        foreach ($data['publication_ids'] as $pubId) {
            $syncData[$pubId] = $pivotData;
        }

        // 4. تنفيذ التحديث أو الإضافة على الجدول الوسيط
        $customerLicense->publications()->syncWithoutDetaching($syncData);

        return true;
    }


}
?>
