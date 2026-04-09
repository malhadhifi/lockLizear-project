<?php

namespace Modules\CustomerManagement\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ReaderOtpNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected string $otp;

    public function __construct(string $otp)
    {
        $this->otp = $otp;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('كود التحقق من بريدك الإلكتروني - SecureDocs')
            ->greeting('مرحباً ' . $notifiable->name . '،')
            ->line('شكراً لتسجيلك في منصة SecureDocs.')
            ->line('كود التحقق الخاص بك هو:')
            ->line('**' . $this->otp . '**')
            ->line('هذا الكود صالح لمدة **10 دقائق** فقط.')
            ->line('إذا لم تقم بهذا الطلب، تجاهل هذا البريد.')
            ->salutation('فريق SecureDocs');
    }
}
