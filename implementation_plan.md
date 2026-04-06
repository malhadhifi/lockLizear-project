# تقرير تحقيق شامل: المنشورات (Publications) - الفرنت إند

> **الهدف**: مقارنة كل عمليات المنشورات في الفرنت إند مع دليل LockLizard v5 والباك إند،  وتحديد كل النواقص بالتفصيل.

---

## 📊 ملخص سريع

| المنطقة | الحالة | النواقص |
|---------|--------|---------|
| صفحة القائمة (PublicationsListPage) | ✅ جيدة مع نواقص طفيفة | عمود Date Added + Sort by Date Added |
| صفحة الإنشاء (CreatePublicationPage) | ✅ مكتملة | — |
| صفحة التعديل - تبويبة التفاصيل | ✅ مكتملة | — |
| صفحة التعديل - تبويبة المستندات | ⚠️ ناقصة | تصميم الجدول مختلف عن الكتاب |
| صفحة التعديل - تبويبة العملاء | ❌ ناقصة كثير | فلاتر ناقصة + عمليات Grant Unlimited/Limited ناقصة |
| نافذة إضافة عملاء (SelectCustomerModal) | ⚠️ غير موجودة | لا توجد نافذة اختيار عملاء |
| تصدير البيانات (Export Publications) | ❌ مفقود | غير موجود نهائياً |

---

## 🔍 التفاصيل الكاملة

---

### 1. صفحة قائمة المنشورات (`PublicationsListPage.jsx`)

#### ✅ ما هو موجود وشغال:
- Filter (بحث نصي) ✅
- Sort by (Name, ID) ✅
- Show at least (ترقيم الصفحات) ✅
- Show filter (Obey / Don't Obey) ✅
- Check / Uncheck / Invert ✅
- Bulk Action: Delete ✅
- بطاقات المنشورات (Card view) ✅
- أزرار: Edit / Delete / Details لكل بطاقة ✅

#### ❌ ما هو ناقص حسب الكتاب:

| # | العملية الناقصة | الوصف | موجود في الباك إند؟ |
|---|----------------|-------|---------------------|
| 1 | **عمود Date Added** | الكتاب يعرض تاريخ إضافة المنشور في كل بطاقة. الفرنت إند لا يعرضه. | ✅ نعم - `createdAt` موجود في `PublicationResource` |
| 2 | **Sort by Date Added** | الكتاب يسمح بالفرز حسب "Date Added" بالإضافة إلى Name. الفرنت إند يحتوي Name و ID فقط | ✅ `createdAt` موجود |
| 3 | **Show all** | الكتاب فيه خيار "Show all" في dropdown العرض بييظهر 10/20/50/100/all. الفرنت إند فيه 2/10/25/50 فقط | غير مطلوب باك إند |

---

### 2. صفحة إنشاء منشور (`CreatePublicationPage.jsx`)

#### ✅ مكتملة 100%:
- Name (حتى 64 حرفاً) ✅
- Description ✅
- Obey customer start date ✅
- زر Save + Cancel ✅
- مربوط بـ `POST /library/publications` ✅

---

### 3. صفحة تعديل المنشور - تبويبة التفاصيل (`EditPublicationPage.jsx`)

#### ✅ مكتملة تقريباً:
- تعديل Name ✅
- تعديل Description ✅ 
- تعديل Obey customer start date ✅
- عرض معلومات النظام (ID, Customers Count, Docs Count, Created At) ✅
- زر Save + Cancel ✅
- مربوط بـ `PUT /library/publications/{id}` ✅

> [!NOTE]
> الكتاب لا يتبح تعديل Name، فقط Description و Obey. لكن هذا مقبول كتحسين.

---

### 4. صفحة تعديل المنشور - تبويبة المستندات (`PublicationDocumentsList.jsx`)

#### ✅ ما هو موجود:
- جدول يعرض المستندات ✅
- إزالة مستند (detach) ✅
- إضافة مستندات (DocumentSelector modal) ✅
- Bulk Action: إزالة ✅

#### ❌ ما هو ناقص حسب الكتاب:

| # | العملية الناقصة | الوصف |
|---|----------------|-------|
| 1 | **الكتاب يقول: لا يمكن حذف مستندات من المنشور عبر واجهة الويب** | حالياً الفرنت إند يسمح بإزالة المستندات! يجب تعطيل زر الإزالة أو إبقاؤه حسب ما تم تنفيذه في الباك إند (detachDocument موجود) |
| 2 | **تصميم الجدول مختلف** | الكتاب يعرض: ID, Title, Date Published, Expiry Date. الفرنت إند يعرض: ID, Name, Status, Date, Web Viewer. يجب توحيد الأعمدة |
| 3 | **لون الشريط العلوي أزرق (#0078d4)** | يجب أن يكون TEAL (#009cad) لمطابقة التصميم الموحد |

> [!IMPORTANT]
> الباك إند يدعم `attachDocuments` و `detachDocument` فعلياً. بالرغم من أن الكتاب يقول لا يمكن حذف، إلا أن الباك إند يدعمها. **اتركها كما هي لأن الباك إند يدعمها**.

---

### 5. صفحة تعديل المنشور - تبويبة العملاء (`PublicationAccessList.jsx`) ⚠️ **الأكثر نقصاً**

#### ✅ ما هو موجود:
- جدول يعرض العملاء المشتركين ✅
- فلتر بحث نصي ✅
- فلتر حسب الحالة (All/Registered/Suspended/Expired/Not Registered) ✅
- ترتيب (Name/Company/Email) ✅
- Bulk Action: Revoke Access ✅
- زر "إضافة عملاء" يفتح SelectCustomerModal ✅
- نافذة تأكيد ConfirmAccessModal ✅

#### ❌ ما هو ناقص حسب الكتاب (الأهم):

| # | العملية الناقصة | الوصف | موجود في الباك إند؟ |
|---|----------------|-------|---------------------|
| 1 | **فلتر Show: "With Access / Without Access / With Unlimited / With Limited"** | الكتاب يسمح بعرض العملاء حسب نوع الوصول: All / With Access / Without Access / With Unlimited Access / With Limited Access. الفرنت إند يفلتر حسب الحالة (registered/suspended) وهذا خاطئ! | ⚠️ الباك إند يرجع فقط العملاء الذين لديهم وصول. لا يرجع "Without Access" |
| 2 | **Bulk Action: Grant Unlimited Access** | الكتاب يتيح منح وصول دائم بدون حدود. الفرنت إند لا يحتوي هذا الخيار في dropdown العمليات. | ⚠️ لا يوجد endpoint مخصص. حالياً يستخدم `bulkAction` من CustomerManagement |
| 3 | **Bulk Action: Grant Limited Access + حقول From/Until** | الكتاب يتيح منح وصول محدود بتاريخ بدء وانتهاء. عند اختيار هذا تظهر حقول تاريخ (From/Until). هذا غير موجود نهائياً. | ⚠️ `updatePublicationAccess` في CustomerManagement يدعم `limited` مع `valid_from/valid_until` |
| 4 | **عمود Valid From / Valid Until** | الكتاب يعرض أعمدة تاريخ البدء والانتهاء لكل عميل. الفرنت إند يعرض "تاريخ التسجيل" و "تاريخ الانتهاء" لكنها مبنية على بيانات مختلفة | الباك إند يرجع `registered` و `expires` |
| 5 | **Check / Uncheck / Invert links** | الكتاب يحتوي روابط سريعة (All | Check | Uncheck | Invert) كما في نوافذ العملاء. الفرنت إند يحتوي فقط checkbox في header الجدول | غير مطلوب باك إند |
| 6 | **لون الشريط العلوي أزرق (#0078d4)** | يجب أن يكون TEAL (#009cad) | — |
| 7 | **API المستخدم خاطئ** | `confirmGrantAccess` يستخدم `bulkMutation` من `/customer-licenses/bulk-action` بينما يجب أن يستخدم `/customer-licenses/{id}/publications/bulk-access` | ✅ endpoint صحيح موجود |

---

### 6. نافذة إضافة عملاء (`SelectCustomerModal`)

#### الحالة: ⚠️

| # | الملاحظة |
|---|----------|
| 1 | يجب التأكد من أن هذا المكون موجود ويعمل (مستورد من `users/components/SelectCustomerModal`) |
| 2 | يجب أن يحتوي فلاتر وعمليات Check/Uncheck/Invert كما في نوافذ العملاء الأخرى |

---

### 7. تصدير المنشورات (Export Publications)

#### الحالة: ❌ مفقود تماماً

| # | العملية الناقصة | الوصف |
|---|----------------|-------|
| 1 | **صفحة/نافذة Export** | الكتاب يتيح تصدير بيانات المنشورات بصيغ CSV أو XML. لا يوجد أي واجهة لهذا في الفرنت إند |
| 2 | **زر Export في القائمة الجانبية** | الكتاب يحتوي 3 أزرار: Add / Manage / Export. الفرنت إند يحتوي فقط Add / Manage |

> [!NOTE]
> الباك إند **لا يحتوي** endpoint للتصدير حالياً. هذه ميزة تحتاج تطوير باك إند أيضاً. **نتجاوزها حالياً**.

---

## 🎯 خطة التنفيذ المقترحة (فرنت إند فقط)

### أولوية عالية (يجب تنفيذها):

1. **تبويبة العملاء (`PublicationAccessList.jsx`)**: 
   - إضافة فلتر Show: All / With Access / Without Access / Unlimited / Limited
   - إضافة Bulk Actions: Grant Unlimited Access + Grant Limited Access (مع حقول From/Until)
   - إضافة روابط Check / Uncheck / Invert
   - تغيير اللون من أزرق إلى TEAL
   - إصلاح الربط مع API الصحيح

2. **تبويبة المستندات (`PublicationDocumentsList.jsx`)**:
   - توحيد الأعمدة مع الكتاب (ID, Title, Date Published, Expiry Date)
   - تغيير اللون من أزرق إلى TEAL

3. **صفحة القائمة (`PublicationsListPage.jsx`)**:
   - إضافة عمود "تاريخ الإضافة" (Date Added) في كل بطاقة
   - إضافة خيار Sort by "Date Added"

### أولوية منخفضة (يمكن تأجيلها):
4. إضافة زر Export في القائمة الجانبية (يحتاج تطوير باك إند)
5. إضافة خيار "Show all" في dropdown العرض

---

## 📋 ملاحظة عن الباك إند

> [!WARNING]
> **لا يوجد endpoint لمنح وصول عميل لمنشور من جهة المنشورات!**
> 
> - `POST /publications/{id}/subscribers/revoke` → ✅ موجود (سحب الوصول)
> - `POST /publications/{id}/subscribers/grant` → ❌ **غير موجود!**
> 
> لكن يمكن استخدام endpoint **من جهة العملاء**:
> - `POST /customer-licenses/{customer_id}/publications/bulk-access` → ✅ موجود
> - يقبل: `{ action: 'unlimited'|'limited'|'revoke', publication_ids: [...], valid_from, valid_until }`
> 
> **يعني**: لمنح وصول لعملاء، نستخدم endpoint العملاء وليس المنشورات.

---

> **هل توافق على البدء بالتنفيذ؟ أم يوجد تعديلات على الخطة؟**
