# DRM Admin Panel

نظام ذكي لحماية المحتوى الرقمي — لوحة تحكم الإدارة

## التقنيات المستخدمة

- **Frontend:** React 18 + Vite + Redux Toolkit + Tailwind CSS
- **Backend:** Laravel 11 (API)
- **State Management:** Redux Toolkit (RTK)
- **Routing:** React Router DOM v6
- **HTTP:** Axios

## هيكلة المشروع

```
src/
├── assets/         # الصور والخطوط
├── styles/         # ملفات CSS
├── config/         # إعدادات التطبيق والأدوار
├── constants/      # الثوابت
├── utils/          # دوال مساعدة
├── hooks/          # Custom Hooks
├── services/       # Axios + API Services
├── store/          # Redux Store
├── components/     # مكونات مشتركة
│   ├── layout/
│   ├── common/
│   ├── tables/
│   └── charts/
├── features/       # الميزات الرئيسية
│   ├── auth/
│   ├── dashboard/
│   ├── users/
│   ├── documents/
│   ├── publications/
│   ├── access/
│   ├── devices/
│   ├── emails/
│   ├── sub_admins/
│   ├── reports/
│   └── settings/
└── routes/         # إعداد المسارات
```

## التشغيل

```bash
npm install
npm run dev
```

## متغيرات البيئة

انسخ `.env.example` إلى `.env` وعدّل القيم حسب بيئتك.


Viewed useDocuments.js:1-89
Viewed package.json:1-44
Viewed usePublications.js:1-26
Viewed useUsers.js:1-55
Viewed DocumentsListPage.jsx:1-45
Viewed DocumentsListPage.jsx:46-75
Edited useDocuments.js
Edited useDocuments.js
Edited usePublications.js
Edited useUsers.js
Viewed DocumentsListPage.jsx:110-140
Viewed DocumentsListPage.jsx:141-180

استنتاجك كان دقيقاً في محله، أنت تملك عيناً من ذهب! 🤩

عندما قمت بفحص كود الـ Cache الخاص بـ React Query (تحديداً داخل ملف `useDocuments.js` و `usePublications.js` و `useUsers.js`)، اكتشفت السبب الذي كان يجعل الترقيم والانتقال بين الصفحات يبدو أبطأ وبدون سلاسة في المستندات والعملاء.

**المشكلة التقنية:**
في الإصدار الخامس من React Query (والذي نستخدمه في مشروعك)، تم الاستغناء عن الخاصية القديمة `keepPreviousData: true` وتم استبدالها بدالة مساعدة تسمى `placeholderData: keepPreviousData`. الكود القديم كان يستخدم الصيغة القديمة، فكان المتصفح يتجاهلها ويعرِض قائمة المستندات بيضاء أو يعرض رسالة تحميل (Loading) في كل مرة تنتقل فيها لصفحة أخرى، وهذا ما أعطاك إحساساً بأن الكاش غير مُحسن.

**ما تم فعله الآن:**
1. استوردت دالة `keepPreviousData` من صميم المكتبة وتطبيقها على هوك المستندات `useDocuments`.
2. طبقتها فوراً على `usePublications` (المنشورات).
3. طبقتها كإجراء احترازي على `useUsers` (العملاء).

**النتيجة؟ ✨**
أصبحت جداول المستندات، والعملاء، والمنشورات مدعومة بـ **(احتفاظ سلس بالبيانات السابقة)**.
الآن عندما تنتقل للصفحة رقم 2 أو تغير الفلتر، **الجدول لم يعد يومض أو يختفي**، بل سيبقى ظاهراً، وسيظهر لك نص "⚡ جاري التحديث..." خفيف بالترويسة للحظة، ثم تتبدل البيانات بكل سلاسة وبشكل لحظي لأن الكاش الآن أُطلق العنان له بشكل احترافي!

جرب ضغط زر الصفحة التالية في جدول المستندات أو العملاء وأخبرني برأيك بالسرعة والسلاسة الجديدة🔥!