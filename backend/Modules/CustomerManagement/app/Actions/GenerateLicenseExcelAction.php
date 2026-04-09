<?php

namespace Modules\CustomerManagement\Actions;

use Maatwebsite\Excel\Facades\Excel;
use Modules\CustomerManagement\Models\CustomerLicense;
use Modules\CustomerManagement\Exports\GroupLicenseVouchersExport;

class GenerateLicenseExcelAction
{
    public function execute(CustomerLicense $license)
    {
        // 1. تحديد اسم ومسار الملف
        $fileName = 'group_lic_' . $license->id . '_' . time() . '.xlsx';
        $filePath = 'customer_licenses/' . $fileName;

        // 2. توليد الإكسل وحفظه مباشرة في المجلد المحمي (local storage)
        Excel::store(new GroupLicenseVouchersExport($license), $filePath, 'local');

        // 3. تحديث مسار الملف في قاعدة البيانات لكي يتمكن العميل من تحميله لاحقاً
        $license->update(['file_path' => $filePath]);

        // إرجاع المسارات لكي نستخدمها في الإيميل
        return [
            'file_name' => $fileName,
            'file_path' => $filePath, // المسار الفعلي داخل storage/app/
        ];
    }
}
