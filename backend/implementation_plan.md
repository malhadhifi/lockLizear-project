# خطة العمل: الخطوة الأولى (الفرنت إند والباك إند)

بناءً على طلبك، إليك تفصيل الأكواد والملفات التي سنعدلها بالترتيب في الخطوة الأولى، **بدون أن أعدل أي شيء الآن**. الخطة مقسمة إلى جزء تصحيحي للفرنت إند، وجزء تأسيسي للباك إند.

---

## 🛠️ أولاً: تعديلات الواجهات الأمامية (React Frontend)

هذا الجزء يعالج عملية "التنظيف" للكود المنسوخ بالخطأ وإزالة أدوات Web Viewer.

### 1. صفحة إضافة منشور (`src/features/publications/pages/CreatePublicationPage.jsx`)
- **ماذا سنمسح؟** 
  سنقوم بمسح حوالي 8 خانات إدخال لا تنتمي للمنشور وهي (نوع الرخصة، الشركة، البريد الإلكتروني، عدد التراخيص، تاريخ البدء، تاريخ الانتهاء، ملاحظات، وإيميل الترخيص).
- **ماذا سيبقى؟**
  سيحتوي النموذج (Form) فقط وحصرياً على:
  1. `الاسم (Name)` - نص
  2. `الوصف (Description)` - مربع نصي
  3. `الالتزام بتاريخ بدء العميل (Obey Customer Start Date)` - Checkbox
- **النتيجة:** واجهة خفيفة ومطابقة لنموذج LockLizard V5.

### 2. قائمة مستندات المنشور (`src/features/publications/components/PublicationDocumentsList.jsx`)
- **ماذا سنفعل؟**
  سنقوم بحذف عمود `Web Viewer` بالكامل من رأس الجدول `<thead>` ومن جسم الجدول `<tbody>`.

### 3. قائمة عملاء المنشور (`src/features/publications/components/PublicationAccessList.jsx`)
- **ماذا سنفعل؟**
  خيار الإجراءات المجمعة يحتوي الآن على:
  `<option value="grant_webviewer">منح Web Viewer</option>`
  `<option value="revoke_webviewer">إلغاء Web Viewer</option>`
  سيتم حذفهما نهائياً، ليتبقى فقط `إلغاء الوصول (Revoke)`.

---

## 🛠️ ثانياً: تعديلات الباك إند (Laravel API)

هنا سنقوم ببرمجة المسارات والدوال الـ 4 المنقوصة لتصبح جاهزة لاستقبال بيانات الفرنت إند لصفحة التعديل.

### 1. ملف المسارات (`Modules/Library/routes/api.php`)
سنضيف الأكواد التالية داخل `Route::prefix('publications')`:
```php
// مسار جلب تفاصيل المنشور الفردي (مهم جداً لصفحة التعديل)
Route::get('/{publication}', [PublicationController::class, 'show']);

// مسارات المستندات المتداخلة (إضافة وثيقة للمنشور أو إزالتها)
Route::post('/{publication_id}/documents/attach', [PublicationController::class, 'attachDocuments']);
Route::delete('/{publication_id}/documents/{document_id}', [PublicationController::class, 'detachDocument']);

// مسارات العملاء (المشتركين) المتداخلة (جلب مشتركين المنشور، وإنهاء صلاحيتهم)
Route::get('/{publication_id}/subscribers', [PublicationController::class, 'getSubscribers']);
Route::post('/{publication_id}/subscribers/revoke', [PublicationController::class, 'revokeSubscriberAccess']);
```

### 2. ملف التحكم (`Modules/Library/app/Http/Controllers/PublicationController.php`)
سأضيف 5 دوال جديدة (Functions) تتماشى مع الـ `ApiResponseTrait`، كالتالي (بدون المساس بالكود الحالي):

1. **دالة `show`**: ستستخدم `PublicationResource` لجلب التايتل والوصف للمنشور المختار لتعبئته للفرنت إند.
2. **دالة `attachDocuments`**: تستقبل مصفوفة `document_ids` وتربطها بالمنشور عبر جدول الـ الربط `publication_documents` (إذا كان مصمماً كذلك في قاعدة البيانات أو تعديل الـ `publication_id` في المستند).
3. **دالة `detachDocument`**: لفصل المستند المحدد.
4. **دالة `getSubscribers`**: للاستعلام عن كل رخص العملاء `CustomerLicense` الذين يمتلكون وصولاً للمنشور الممرر.
5. **دالة `revokeSubscriberAccess`**: لإزالة حق الوصول لجدول العملاء بالدفعة.

---

## User Review Required

هذه الخطة تمثل نقطة الانطلاق السليمة (التصحيح المبدئي للواجهة وتجهيز الباك إند لاستقبال البيانات الحقيقية). الدقة هنا عالية ولم نحذف شيئاً ينتمي بصلة لقسم المنشورات.

**هل توافق على هذه الخطة لأقوم بدخول الملفات وإجراء هذه التعديلات المحددة فعلياً؟**
