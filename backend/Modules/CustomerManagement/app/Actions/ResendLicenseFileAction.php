<?php

namespace Modules\CustomerManagement\Actions;

use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Modules\CustomerManagement\Models\CustomerLicense;
use Modules\CustomerManagement\Notifications\SendGroupLicenseEmailNotification;
use Modules\CustomerManagement\Notifications\SendLicenseEmailNotification;

class ResendLicenseFileAction
{
    public function execute(CustomerLicense $license)
    {
        // 1. التحقق من وجود الإيميل ومسار الملف في قاعدة البيانات
        if (empty($license->email) || empty($license->file_path)) {
            return false;
        }

        // 2. التحقق من أن الملف موجود فعلياً في السيرفر
        if (!Storage::disk('local')->exists($license->file_path)) {
            return false;
        }

        // استخراج اسم الملف من المسار
        $fileName = basename($license->file_path);

        // 3. توجيه الإرسال بناءً على نوع الرخصة
        if ($license->type === 'group') {

            Notification::route('mail', $license->email)
                ->notify(new SendGroupLicenseEmailNotification(
                    $license,
                    $license->file_path,
                    $fileName
                ));

        } else {



            Notification::route('mail', $license->email)
                ->notify(new SendLicenseEmailNotification(
                    $license,
                    $license->file_path,
                    $fileName
                ));
        }

        return true;
    }
}
