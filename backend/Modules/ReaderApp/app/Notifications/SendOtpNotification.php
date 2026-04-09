<?php

namespace Modules\ReaderApp\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendOtpNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $otpCode;

    public function __construct($otpCode)
    {
        $this->otpCode = $otpCode;
    }

    /**
     * تحديد قنوات الإرسال (هنا نستخدم الإيميل فقط، ولاحقاً يمكن إضافة 'nexmo' أو 'twilio' للـ SMS)
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * شكل الرسالة عند الإرسال عبر الإيميل
     */
    public function toMail($notifiable)
    {
        // نربط الإشعار بنفس قالب الـ Blade الذي صممناه سابقاً
        return (new MailMessage)
            ->subject('كود التحقق الخاص بك (OTP)')
            ->view('readerapp::emails.otp_template', [
                'otpCode' => $this->otpCode
            ]);
    }
}
