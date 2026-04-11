<?php

namespace Modules\CustomerManagement\Actions;

use Illuminate\Support\Facades\Storage;
use Modules\CustomerManagement\Models\CustomerLicense;
use Modules\CustomerManagement\Services\License\CreateFileLicenseService;

class GenerateLicenseFileAction
{
    protected $licenseFactory;

    public function __construct(CreateFileLicenseService $licenseFactory)
    {
        $this->licenseFactory = $licenseFactory;
    }

    public function execute(CustomerLicense $license)
    {
        // 1. توليد الملف المشفر (نمرر null للـ reader و voucher لأنها رخصة لم تُفعل بعد)
        $cryptoResult = $this->licenseFactory->createLicenseFile($license);

        // 2. تحديد المسار والحفظ (مجلد محمي داخل storage/app)
        $fileName = 'lic_' . $license->id . '_' . time() . '.lzpk';
        $filePath = 'customer_licenses/' . $fileName;

        Storage::disk('local')->put($filePath, $cryptoResult['binary_file']);

        // 3. تحديث مسار الملف في قاعدة البيانات
        $license->update(['file_path' => $filePath]);

        // // 4. تجهيز الملف للحدث (Notification) لإرساله بالإيميل
        // $encodedFile = base64_encode($cryptoResult['binary_file']);

        return [
            'file_name' => $fileName,
            'file_path' => $filePath,
            // 'encoded_file' => $encodedFile
        ];
    }
}
