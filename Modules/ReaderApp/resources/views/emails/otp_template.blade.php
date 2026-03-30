<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { background-color: #ffffff; padding: 30px; border-radius: 8px; max-width: 500px; margin: 0 auto; text-align: center; box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
        .otp-code { font-size: 32px; font-weight: bold; color: #2c3e50; letter-spacing: 5px; margin: 20px 0; padding: 15px; background-color: #ecf0f1; border-radius: 5px; }
        .footer { margin-top: 30px; font-size: 12px; color: #7f8c8d; }
    </style>
</head>
<body>
    <div class="container">
        <h2>مرحباً بك في تطبيق القارئ!</h2>
        <p>لقد تلقينا طلباً للتحقق من بريدك الإلكتروني. يرجى استخدام الكود التالي لإكمال العملية:</p>

        <div class="otp-code">
            {{ $otpCode }}
        </div>

        <p>هذا الكود صالح لمدة <strong>15 دقيقة</strong> فقط. إذا لم تقم بهذا الطلب، يرجى تجاهل هذه الرسالة.</p>

        <div class="footer">
            &copy; {{ date('Y') }} جميع الحقوق محفوظة.
        </div>
    </div>
</body>
</html>
