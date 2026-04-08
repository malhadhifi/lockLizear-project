# تقرير فحص ومراجعة أداء الفرنت إند (Frontend Performance Audit) 🚀

بناءً على الفحص الشامل للمشروع وخاصة عمليات الاسترجاع للعملاء، المنشورات، والمستندات، تبيّن وجود أسباب جذرية تؤدي إلى بطء العمليات وعدم استجابة النوافذ (Modals) بكفاءة.

## ⚠️ الأسباب الرئيسية لبطء العمليات (لماذا النوافذ بطيئة؟)

1. **غياب React Query (التخزين المؤقت) في النوافذ الفرعية:**
   العديد من النوافذ المنبثقة (مثل نافذة عرض العملاء لمستند معين والتفاصيل الفرعية) تستخدم `useEffect` و `axios.get` مباشرة في كل مرة يتم فيها فتح النافذة. هذا يعني:
   - أن البيانات لا تُحفظ في الذاكرة المؤقتة (No Caching).
   - في كل نقرة لفتح النافذة يتم إرسال طلب جديد للسيرفر (N+1 Requests)، مما يسبب تأخير مستمر.
2. **استدعاء بيانات ضخمة دفعة واحدة (Missing Pagination in Modals):**
   في نوافذ منح الوصول مثل `SelectPublicationModal.jsx` و `SelectDocumentModal.jsx`، يتم عمل استدعاء للبيانات باستخدام `{ limit: 1000 }` لجلب **كل البيانات دفعة واحدة**. 
   - محاولة عرض ومعالجة 1000 سجل دفعة واحدة في واجهة متصفح (DOM) تسبب تجمد البطاقة (UI Block/Freeze) وبطء ملحوظ في الاستجابة.
3. **التحديث اليدوي للبيانات عوضاً عن `invalidateQueries`:**
   عند عمل تغيير (مثل منح وصول)، لا يتم تنشيط التحديث التلقائي بشكل سليم في كل الأحوال، مما يضطر النظام لإعادة تحميل الصفحة بالكامل أو استدعاء دوال ثقيلة مجدداً.

---

## 🛠 الأوامر والتطبيقات الناقصة

لتصحيح هذه المشاكل، نحتاج لتطبيق المهام التالية:

- **إزالة `useEffect` من كافة النوافذ الفرعية** واستبدالها لتقرأ من `useQuery` (React Query Hook).
- **إضافة خاصية التمرير اللانهائي (Infinite Scroll) أو البحث عبر الـ Server** بدلاً من جلب `limit: 1000` للسجلات الضخمة.
- **تطبيق تقنية النافذة الافتراضية (Virtualization)** في النوافذ المنبثقة باستخدام مكتبات مثل `@tanstack/react-virtual` إن لزم الأمر لضمان خفة عرض آلاف السطور في نفس اللحظة.
- **بناء ملفات خدمة ومحولات (Hooks) منفصلة:** لبعض النوافذ التي تفتقر للـ Hooks مثل `UserDevicesList`.

---

## 📍 أماكن التحسينات التي ستتم في الفرنت إند

### 1️⃣ داخل عمليات العملاء (Customers / Users)
- `src/features/users/components/UserDevicesList.jsx`: يحتاج لتبني React Query.
- `src/features/users/components/SelectPublicationModal.jsx`: 
   - النافذة الفرعية `ViewCustomersPopup` و `ViewDocumentsPopup` فيهما مشاكل استدعاء مباشرة بدون كاش.
   - إزالة الـ `limit: 1000` وعمل نظام جلب ذكي أو بحث في الباك إند.
- `src/features/users/components/SelectDocumentModal.jsx`: نفس المشكلة مع الـ limit العالي جداً.
- **كافة نوافذ تفاصيل الأحداث (History Logs):** (`ChangeViewsModal.jsx`, `ChangePrintsModal.jsx`, `WebViewerLoginHistoryModal.jsx`): جلب البيانات منها بدائي ويحطّم استقرار الصفحة.

### 2️⃣ داخل عمليات المنشورات (Publications)
- `src/features/publications/components/PublicationAccessList.jsx`: يحتاج إعادة هيكلة لسرعة التنزيل والتحقق.
- `src/features/publications/components/PublicationDocumentsList.jsx`: إضافة كاشينج صحيح باستخدام `queryKey`.
- `src/features/publications/pages/EditPublicationPage.jsx`: تحسين تبويبات المنشورات لمنع إعادة جلب البيانات غير الضرورية عند التنقل بين التبويبات.

### 3️⃣ داخل عمليات المستندات (Documents)
- `src/features/documents/pages/DocumentDetailPage.jsx`: سيتم فصل استدعاءات البيانات (useEffect) لتصبح مدارة بالكامل تحت أوامر `@tanstack/react-query`.

> [!IMPORTANT]
> نحتاج موافقتك يا أسامة للبدء بتنفيذ هذه الخطة. الخطة ستبدأ بتحويل كافة النوافذ الفرعية ومكونات العملاء والمنشورات لاستخدام `useQuery` و `useMutation` وإلغاء القيود الضخمة (`limit: 1000`).
>
> **هل تريد البدء بعملية التحسين فوراً؟ أم ترغب في التركيز على نوافذ العملاء أولاً؟**
