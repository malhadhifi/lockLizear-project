<?php

namespace Modules\CustomerManagement\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Modules\CustomerManagement\Models\CustomerLicense;

class SendGroupLicenseEmailNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $license;
    protected $filePath;
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
        return (new MailMessage)
            ->subject('كروت التفعيل للرخصة الجماعية الخاصة بك')
            ->line('مرحباً ' . $this->license->name)
            ->line('مرفق طيه ملف Excel يحتوي على جميع كروت التفعيل (PIN Codes) الخاصة برخصتكم.')
            ->line('عدد الكروت المصدرة: ' . $this->license->vouchers()->count())
            // إرفاق الملف المباشر من مجلد الـ Storage
            ->attach(storage_path('app/' . $this->filePath), [
                'as' => $this->fileName,
                'mime' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ]);
    }
}
