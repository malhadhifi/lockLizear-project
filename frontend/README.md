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
