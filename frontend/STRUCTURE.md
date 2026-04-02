# 🏗️ هيكلة المشروع الكاملة

## 📁 البنية الكاملة

```
drm-admin-panel/
├── public/                      # الملفات العامة
│   ├── vite.svg
│   └── favicon.ico
│
├── src/
│   ├── features/            # الوحدات الرئيسية (Feature-Based Architecture)
│   │   ├── auth/           # وحدة المصادقة
│   │   │   ├── pages/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── PasswordInput.jsx
│   │   │   ├── services/
│   │   │   │   └── authService.js
│   │   │   ├── store/
│   │   │   │   └── authSlice.js
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.js
│   │   │   └── utils/
│   │   │       └── tokenManager.js
│   │   │
│   │   ├── users/          # وحدة إدارة المستخدمين
│   │   │   ├── pages/
│   │   │   │   ├── Users.jsx
│   │   │   │   ├── UserDetail.jsx
│   │   │   │   └── UserCreate.jsx
│   │   │   ├── components/
│   │   │   │   ├── UserTable.jsx
│   │   │   │   ├── UserForm.jsx
│   │   │   │   ├── UserFilters.jsx
│   │   │   │   └── UserImportExport.jsx
│   │   │   ├── services/
│   │   │   │   └── usersService.js
│   │   │   ├── store/
│   │   │   │   └── usersSlice.js
│   │   │   ├── hooks/
│   │   │   │   └── useUsers.js
│   │   │   └── utils/
│   │   │       └── userHelpers.js
│   │   │
│   │   ├── videos/         # وحدة إدارة الفيديوهات
│   │   │   ├── pages/
│   │   │   │   ├── Videos.jsx
│   │   │   │   ├── VideoDetail.jsx
│   │   │   │   └── VideoUpload.jsx
│   │   │   ├── components/
│   │   │   │   ├── VideoCard.jsx
│   │   │   │   ├── VideoPlayer.jsx
│   │   │   │   ├── VideoUploadForm.jsx
│   │   │   │   └── VideoFilters.jsx
│   │   │   ├── services/
│   │   │   │   └── videosService.js
│   │   │   ├── store/
│   │   │   │   └── videosSlice.js
│   │   │   ├── hooks/
│   │   │   │   └── useVideos.js
│   │   │   └── utils/
│   │   │       └── videoHelpers.js
│   │   │
│   │   ├── publications/ # وحدة المنشورات/الكورسات
│   │   │   ├── pages/
│   │   │   │   ├── Publications.jsx
│   │   │   │   ├── PublicationDetail.jsx
│   │   │   │   └── PublicationCreate.jsx
│   │   │   ├── components/
│   │   │   │   ├── PublicationCard.jsx
│   │   │   │   ├── PublicationForm.jsx
│   │   │   │   └── VideoSelector.jsx
│   │   │   ├── services/
│   │   │   │   └── publicationsService.js
│   │   │   ├── store/
│   │   │   │   └── publicationsSlice.js
│   │   │   ├── hooks/
│   │   │   │   └── usePublications.js
│   │   │   └── utils/
│   │   │       └── publicationHelpers.js
│   │   │
│   │   ├── reports/        # وحدة التقارير
│   │   │   ├── pages/
│   │   │   │   ├── Reports.jsx
│   │   │   │   ├── ViewsReport.jsx
│   │   │   │   └── UsersReport.jsx
│   │   │   ├── components/
│   │   │   │   ├── ReportCard.jsx
│   │   │   │   ├── DateRangePicker.jsx
│   │   │   │   └── ExportButton.jsx
│   │   │   ├── services/
│   │   │   │   └── reportsService.js
│   │   │   ├── store/
│   │   │   │   └── reportsSlice.js
│   │   │   ├── hooks/
│   │   │   │   └── useReports.js
│   │   │   └── utils/
│   │   │       └── reportHelpers.js
│   │   │
│   │   ├── access/         # وحدة إدارة الصلاحيات
│   │   │   ├── pages/
│   │   │   │   ├── AccessControl.jsx
│   │   │   │   └── UserAccess.jsx
│   │   │   ├── components/
│   │   │   │   ├── PermissionsTable.jsx
│   │   │   │   ├── AccessForm.jsx
│   │   │   │   └── UserSelector.jsx
│   │   │   ├── services/
│   │   │   │   └── accessService.js
│   │   │   ├── store/
│   │   │   │   └── accessSlice.js
│   │   │   ├── hooks/
│   │   │   │   └── useAccess.js
│   │   │   └── utils/
│   │   │       └── accessHelpers.js
│   │   │
│   │   ├── settings/       # وحدة الإعدادات
│   │   │   ├── pages/
│   │   │   │   ├── Settings.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── SystemSettings.jsx
│   │   │   ├── components/
│   │   │   │   ├── ProfileForm.jsx
│   │   │   │   ├── PasswordChangeForm.jsx
│   │   │   │   └── SettingsTab.jsx
│   │   │   ├── services/
│   │   │   │   └── settingsService.js
│   │   │   ├── store/
│   │   │   │   └── settingsSlice.js
│   │   │   ├── hooks/
│   │   │   │   └── useSettings.js
│   │   │   └── utils/
│   │   │       └── settingsHelpers.js
│   │   │
│   │   └── dashboard/      # وحدة لوحة التحكم الرئيسية
│   │       ├── pages/
│   │       │   └── Dashboard.jsx
│   │       ├── components/
│   │       │   ├── StatsCard.jsx
│   │       │   ├── RecentActivity.jsx
│   │       │   └── QuickActions.jsx
│   │       └── services/
│   │           └── dashboardService.js
│   │
│   ├── components/          # المكونات المشتركة
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── EmptyState.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── UserMenu.jsx
│   │   │   └── Breadcrumb.jsx
│   │   │
│   │   └── charts/
│   │       ├── PieChart.jsx
│   │       ├── BarChart.jsx
│   │       ├── LineChart.jsx
│   │       └── AreaChart.jsx
│   │
│   ├── services/            # خدمات API العامة
│   │   ├── api.js          # Axios instance
│   │   ├── interceptors.js
│   │   └── errorHandler.js
│   │
│   ├── store/               # Redux Store العام
│   │   ├── store.js
│   │   └── rootReducer.js
│   │
│   ├── routes/              # نظام التوجيه
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   │
│   ├── utils/               # دوال مساعدة
│   │   ├── helpers.js
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── parseCSV.js
│   │
│   ├── hooks/               # Custom React Hooks
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   ├── usePagination.js
│   │   └── useClickOutside.js
│   │
│   ├── constants/           # الثوابت
│   │   ├── index.js
│   │   ├── roles.js
│   │   ├── statuses.js
│   │   └── messages.js
│   │
│   ├── assets/              # الملفات الثابتة
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   └── placeholder.png
│   │   └── icons/
│   │       └── [SVG icons]
│   │
│   ├── App.jsx              # المكون الرئيسي
│   ├── main.jsx             # نقطة الدخول
│   └── index.css            # الأنماط العامة
│
├── .env.example             # مثال متغيرات البيئة
├── .gitignore               # ملفات متجاهلة
├── .eslintrc.cjs            # إعدادات ESLint
├── index.html               # HTML الرئيسي
├── package.json             # المكتبات
├── postcss.config.js        # إعدادات PostCSS
├── tailwind.config.js       # إعدادات Tailwind
├── vite.config.js           # إعدادات Vite
├── README.md                # توثيق المشروع
└── STRUCTURE.md             # هذا الملف
```

---

## 📝 شرح البنية

### 🎯 Features (الوحدات)

كل وحدة (Feature) مستقلة تحتوي على:

| المجلد | الوظيفة |
|----------|----------|
| `pages/` | صفحات الوحدة (مربوطة بالمسارات) |
| `components/` | مكونات UI الخاصة بالوحدة |
| `services/` | API calls للوحدة |
| `store/` | Redux slice للوحدة |
| `hooks/` | Custom hooks للوحدة |
| `utils/` | دوال مساعدة خاصة بالوحدة |

### 🧱 Components (مكونات مشتركة)

- **common/**: مكونات UI مشتركة (Buttons, Cards, Modals...)
- **layout/**: مكونات الإطار (Sidebar, Header...)
- **charts/**: مكونات الرسوم البيانية

### 🔄 Services (الخدمات)

- **api.js**: Axios instance مع إعدادات عامة
- **interceptors.js**: Request/Response interceptors
- **errorHandler.js**: معالجة مركزية للأخطاء

### 📊 Store (Redux)

- **store.js**: تكوين Redux store الرئيسي
- **rootReducer.js**: دمج جميع slices

كل feature لها `slice` خاص داخل `features/[name]/store/`

### 🛣️ Routes (التوجيه)

- **AppRoutes.jsx**: تعريف جميع المسارات
- **ProtectedRoute.jsx**: حماية المسارات بالمصادقة
- **PublicRoute.jsx**: مسارات عامة (Login...)

### 🔧 Utils (أدوات مساعدة)

- **helpers.js**: دوال عامة
- **formatters.js**: تنسيق التواريخ، الأرقام...
- **validators.js**: تحقق من المدخلات
- **parseCSV.js**: معالجة ملفات CSV

### 🎲 Hooks (خطافات مخصصة)

- **useDebounce**: تأخير التنفيذ
- **useLocalStorage**: تخزين محلي
- **usePagination**: إدارة الصفحات
- **useClickOutside**: كشف النقر خارج العنصر

### 📚 Constants (ثوابت)

- **index.js**: ثوابت عامة
- **roles.js**: أدوار المستخدمين
- **statuses.js**: حالات النظام
- **messages.js**: رسائل النظام (عربي/إنجليزي)

---

## 📦 ملفات الإعداد

| الملف | الوظيفة |
|--------|----------|
| `package.json` | قائمة المكتبات والأوامر |
| `vite.config.js` | إعدادات Vite |
| `tailwind.config.js` | إعدادات Tailwind CSS |
| `postcss.config.js` | إعدادات PostCSS |
| `.eslintrc.cjs` | قواعد ESLint |
| `.gitignore` | ملفات مستبعدة من Git |
| `.env.example` | مثال متغيرات البيئة |

---

## ⚙️ التثبيت والتشغيل

```bash
# 1. استنساخ المستودع
git clone https://github.com/Osama-Al-Baadani/drm-admin-panel.git
cd drm-admin-panel

# 2. تثبيت المكتبات
npm install

# 3. نسخ ملف البيئة
cp .env.example .env

# 4. تشغيل السيرفر
npm run dev
```

---

## 📖 ملاحظات هامة

### 🎯 Feature-Based Architecture

المشروع يتبع **البنية المبنية على الوحدات** بدلاً من:
- ✅ **سهل التطوير**: كل وحدة مستقلة
- ✅ **سهل الصيانة**: إيجاد الكود بسرعة
- ✅ **قابل للتوسع**: إضافة وحدات جديدة بسهولة
- ✅ **اختبار معزول**: اختبار وحدة معينة بشكل مستقل

### 📦 المكونات المشتركة

- توضع في `components/common/`
- تُستخدم عبر جميع الوحدات
- تتبع design system موحد

### 🔒 الأمان

- جميع المسارات محمية بـ `ProtectedRoute`
- تخزين آمن للـ tokens (سيتم التطبيق)
- Axios interceptors للمصادقة التلقائية

---

## 🛠️ الخطوة التالية

الآن بعد إنشاء الهيكلة:

1. ✅ **الهيكلة جاهزة**
2. ⏳ **بناء المكونات** (سيتم إضافتها لاحقاً)
3. ⏳ **ربط API**
4. ⏳ **الاختبار والنشر**

---

للرجوع إلى README الرئيسي: [README.md](./README.md)
