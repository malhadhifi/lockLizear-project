<?php

namespace Modules\CustomerManagement\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue; // للإرسال في الخلفية (طابور المهام)
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Modules\CustomerManagement\Models\CustomerLicense;

class SendLicenseEmailNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $license;
    protected $encodedFileData;
    protected $fileName;

    public function __construct(CustomerLicense $license, string $encodedFileData, string $fileName)
    {
        $this->license = $license;
        $this->encodedFileData = $encodedFileData;
        $this->fileName = $fileName;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $subject = $this->license->type === 'group'
            ? 'مرفق كروت تفعيل الرخص الخاصة بك'
            : 'مرفق ملف تفعيل الرخصة الخاصة بك';

        return (new MailMessage)
            ->subject($subject)
            // مسار قالب الإيميل (HTML) الذي سنقوم بإنشائه لاحقاً
            ->view('customermanagement::emails.customer_license', [
                'license' => $this->license
            ])
            // فك تشفير الـ Base64 وإرفاق الملف بالاسم والصيغة الصحيحة
            ->attachData(base64_decode($this->encodedFileData), $this->fileName, [
                'mime' => 'application/octet-stream',
            ]);
    }
}
