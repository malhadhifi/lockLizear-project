<!-- <!DOCTYPE html>
<html dir="rtl" lang="ar">

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #000;
            line-height: 1.4;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #ccc;
            padding: 25px;
        }

        .header {
            border-bottom: 2px solid #000;
            margin-bottom: 20px;
            padding-bottom: 10px;
        }

        .header h1 {
            margin: 0;
            font-size: 20px;
            letter-spacing: 2px;
        }

        .section-title {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 15px;
        }

        .data-grid {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
        }

        .data-grid td {
            padding: 5px 0;
            font-size: 14px;
        }

        .label {
            width: 140px;
            color: #555;
        }

        .value {
            font-family: 'Courier New', Courier, monospace;
            font-weight: bold;
        }

        .steps {
            font-size: 14px;
            margin-bottom: 20px;
        }

        .steps ol {
            padding-right: 20px;
            margin: 10px 0;
        }

        .footer {
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }

        .btn {
            display: inline-block;
            padding: 8px 15px;
            border: 1px solid #000;
            text-decoration: none;
            color: #000;
            font-weight: bold;
            font-size: 13px;
        }
    </style>
</head>

<body>

    <div class="container">
        <div class="header">
            <h1>KODIK SYSTEMS</h1>
        </div>

        <p style="font-size: 14px;">تم إنشاء حساب الناشر الخاص بك بنجاح. بيانات الدخول وتعليمات التنصيب موصلة أدناه:</p>

        <div class="section-title">بيانات لوحة الإدارة (Admin Portal)</div>
        <table class="data-grid">
            <tr>
                <td class="label">رابط الدخول:</td>
                <td><a href="{{ $adminPanelUrl }}">{{ $adminPanelUrl }}</a></td>
            </tr>
            <tr>
                <td class="label">كلمة المرور:</td>
                <td class="value">{{ $temporaryPassword }}</td>
            </tr>
        </table>

        <div class="section-title">تنصيب نظام التشفير (KODIK Writer)</div>
        <div class="steps">
            <ol>
                <li>قم بتحميل البرنامج من الرابط: <a href="{{ $writerDownloadUrl }}" class="btn">Download Writer</a>
                </li>
                <li>قم بفتح ملف الرخصة المرفق <strong>({{ $licenseFileName }}.lzpk)</strong> لتسجيل النظام على جهازك.
                </li>
            </ol>
        </div>

        <div class="footer">
            هذا البريد تم إنشاؤه آلياً.<br>
            &copy; KODIK Systems International.
        </div>
    </div>

</body>

</html> -->




<!DOCTYPE html>
<html dir="rtl" lang="ar">

<head>
       
    <meta charset="UTF-8">
        <style>
        body {
            font-family: Tahoma, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }

        .header {
            background-color: #2c3e50;
            color: white;
            padding: 15px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }

        .content {
            padding: 20px;
            background-color: #f9f9f9;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }

        .warning {
            color: red;
            font-weight: bold;
        }
    </style>
</head>

<body>
 <div class="container">
        <div class="header">
          <h2>إصدار رخصة ناشر جديدة</h2>
         </div>

      <div class="content">
           <p>مرحباً <strong>{{ $publisher->name }}</strong>،</p>
           <p>يسعدنا انضمامك إلى منصتنا لحماية وتشفير المحتوى الرقمي.</p>

           <p>لقد تم إنشاء حسابك بنجاح. تجد في <strong>المرفقات</strong> ملف الرخصة الخاص بك بصيغة
                (<code>.lzpk</code>).</p>

            <h3>خطوات البدء:</h3>
           <ol>
                 <li>قم بتحميل برنامج (Writer) الخاص بنا من موقعنا.</li>
                 <li>قم بتحميل الملف المرفق في هذا الإيميل إلى جهازك.</li>
              <li>افتح برنامج (Writer) واستورد ملف الرخصة لتبدأ بتشفير ملفاتك.</li>
                 </ol>

        </div>

    <div class="footer">
           <p>مع تحيات،<br>فريق الدعم الفني - نظام الحماية</p>
           </div>
        </div>
</body>

</html>
