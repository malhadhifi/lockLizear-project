<?php

namespace Modules\CustomerManagement\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Storage;
use Modules\CustomerManagement\Models\CustomerLicense;

class SendLicenseEmailNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $license;
    protected $filePath; // 👈 نمرر المسار فقط بدلاً من الملف الكامل
    protected $fileName;

    public function __construct(CustomerLicense $license, string $filePath, string $fileName)
    {
        $this->license = $license;
        $this->filePath = $filePath;
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

        // 👈 الطابور هو من يقوم بقراءة الملف من السيرفر أثناء الإرسال وليس قبل
        $fileContent = Storage::disk('local')->get($this->filePath);

        return (new MailMessage)
            ->subject($subject)
            ->view('customermanagement::emails.customer_license', [
                'license' => $this->license
            ])
            // نرفق الملف مباشرة (لا نحتاج لفك التشفير لأن get تجلبه كثنائي جاهز)
            ->attachData($fileContent, $this->fileName, [
                'mime' => 'application/octet-stream',
            ]);
    }
}
