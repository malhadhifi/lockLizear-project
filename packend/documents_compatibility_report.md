# 🔎 تقرير التوافق: هل الفرنت إند جاهز لاستقبال بيانات الباك إند؟

> [!IMPORTANT]
> هذا التقرير يقارن **حقل بحقل** و**عملية بعملية** بين ما يُرسله الباك إند (Laravel API) وما يتوقعه الفرنت إند (React) لوحدة المستندات.

---

## 1️⃣ أسماء الحقول في بطاقة المستند (القائمة)

### ما يرسله الباك إند (`DocumentResource.php`)
```json
{
  "id": 5,
  "type": "pdf",
  "title": "كتاب رقم 1",
  "note": "محتوى الكتاب التجريبي",
  "status": "valid",
  "published": "2026-03-31",
  "expired": null
}
```

### ما يتوقعه الفرنت إند (`DocumentsListPage.jsx` - Mock Data)
```json
{
  "id": 101,
  "name": "تقرير المبيعات السنوي.pdf",
  "description": "تقرير سري",
  "publishedDate": "2026-03-15",
  "status": "valid",
  "expires": "2027-03-15",
  "customersCount": 45,
  "publicationsCount": 2,
  "drm": { "printingEnabled": false, ... }
}
```

### جدول المقارنة حقل بحقل

| ما يستخدمه الفرنت إند | ما يرسله الباك إند | التطابق | التعليق |
|------------------------|-------------------|---------|---------|
| `doc.name` | `title` | ❌ **مختلف** | الفرنت يقرأ `name` لكن الباك يرسل `title` |
| `doc.id` | `id` | ✅ متطابق | — |
| `doc.publishedDate` | `published` | ❌ **مختلف** | الفرنت يقرأ `publishedDate` لكن الباك يرسل `published` |
| `doc.description` | `note` | ❌ **مختلف** | الفرنت يقرأ `description` لكن الباك يرسل `note` |
| `doc.status` | `status` | ✅ متطابق | القيم متوافقة: `valid`, `suspended` |
| `doc.expires` | `expired` | ❌ **مختلف** | الفرنت يقرأ `expires` لكن الباك يرسل `expired` (null أو تاريخ) |
| `doc.customersCount` | ❌ **غير موجود** | ❌ **ناقص** | الباك إند لا يرسل عدد العملاء في `DocumentResource` |
| `doc.publicationsCount` | ❌ **غير موجود** | ❌ **ناقص** | الباك إند لا يرسل عدد المنشورات في `DocumentResource` |
| `doc.drm` | ❌ **غير موجود** | ⚠️ **في التفاصيل فقط** | حقول DRM تأتي فقط من `DocumentDetailsResource` (صفحة التفاصيل) وليس من القائمة |
| — | `type` | ⚠️ الفرنت لا يعرضه | الباك يرسل `type` (pdf/video) لكن الفرنت لا يعرضه حالياً |

> [!CAUTION]
> **6 اختلافات في أسماء الحقول** يجب تصحيحها قبل الربط، وإلا ستظهر كل البيانات فارغة!

---

## 2️⃣ فلاتر صفحة القائمة (`DocumentsListPage.jsx`)

### ما يرسله الفرنت إند كفلاتر (حالياً يستخدمها محلياً)

| الفلتر | القيم في الفرنت | المعادل في الباك إند (`IndexDocumentRequest.php`) | التطابق |
|--------|-----------------|------------------------------------------------|---------|
| `filter` (بحث نصي) | نص حر | `search` | ⚠️ **اسم مختلف** — الفرنت يسميه `filter` والباك يتوقع `search` |
| `sortBy` → `"name"` | الاسم | `sort_by` → يقبل: `id`, `title`, `description` | ❌ **غير متوافق** — الفرنت يرسل `name` والباك لا يعرفها (يجب تحويلها لـ `title`) |
| `sortBy` → `"id"` | المعرف | `sort_by` → `id` | ✅ متطابق |
| `sortBy` → `"published"` | تاريخ النشر | `sort_by` → ❌ **غير مدعوم** | ❌ **غير متوافق** — الباك إند لا يدعم الترتيب حسب تاريخ النشر مباشرة |
| `showAtLeast` | 10, 25, 50 | `show_at_least` | ✅ متطابق (مع فرق التسمية camelCase vs snake_case يتولاه axios) |
| `showFilter` → `"all"` | الكل | `show` → `all` | ✅ متطابق |
| `showFilter` → `"valid"` | صالح | `show` → ❌ **غير موجود** | ❌ **غير متوافق** — الباك يدعم: `all`, `suspended`, `expired`, `not_yet_expired`, `expired_on` — لا يوجد `valid` |
| `showFilter` → `"suspended"` | موقوف | `show` → `suspended` | ✅ متطابق |
| `showFilter` → `"expired"` | منتهي | `show` → `expired` | ✅ متطابق |

> [!WARNING]
> **3 اختلافات في الفلاتر:**
> 1. الفرنت يرسل `name` كـ sortBy والباك يتوقع `title`
> 2. الفرنت يرسل `published` كـ sortBy والباك لا يدعمه
> 3. الفرنت يعرض خيار `valid` في الفلتر والباك لا يدعمه (يمكن إضافته أو التعامل معه)

---

## 3️⃣ العمليات المجمعة (Bulk Actions)

### ما يرسله الفرنت إند (حالياً يعمل محلياً في Redux)

| العملية في الفرنت | ما يحتاجه الباك إند (`DocumentActionRequest.php`) | التطابق | التعليق |
|-------------------|--------------------------------------------------|---------|---------|
| `Suspend` | `action: "suspended"` | ❌ **مختلف** | الفرنت يسميها `Suspend` (حرف كبير) والباك يتوقع `suspended` (حرف صغير) |
| `Activate` | `action: "active"` | ❌ **مختلف** | الفرنت يسميها `Activate` والباك يتوقع `active` |
| `Delete` | `action: "deleted"` | ❌ **مختلف** | الفرنت يسميها `Delete` والباك يتوقع `deleted` |

### شكل البيانات المرسلة

| الفرنت إند (حالياً) | الباك إند يتوقع | التطابق |
|---------------------|----------------|---------|
| `{ ids: [1, 2, 3], status: 'suspended' }` | `{ document_ids: [1, 2, 3], action: 'suspended' }` | ❌ **مختلف** |

> **الباك إند يتوقع:**
> ```json
> POST /api/library/documents/action
> {
>   "document_ids": [1, 2, 3],
>   "action": "suspended"
> }
> ```
> **الفرنت إند يرسل حالياً (لـ Redux):**
> ```json
> { "ids": [1, 2, 3], "status": "suspended" }
> ```

> [!CAUTION]
> **3 اختلافات في العمليات المجمعة:**
> 1. اسم المصفوفة: `ids` ← يجب أن تصبح `document_ids`
> 2. اسم الحقل: `status` ← يجب أن يصبح `action`
> 3. قيم الإجراءات: `Suspend/Activate/Delete` ← يجب أن تصبح `suspended/active/deleted`

---

## 4️⃣ عملية الحفظ في صفحة التفاصيل (`DocumentDetailPage.jsx`)

### ما يرسله الفرنت إند عند الحفظ

```javascript
// الفرنت يرسل (حالياً لـ Redux):
{
  id: document.id,
  description: "الوصف الجديد",
  expires: "2027-06-15",
  status: "valid"  // أو "suspended"
}
```

### ما يقبله الباك إند (`UpdateDocumentRequest.php` → `PUT /api/library/documents/{id}`)

```json
{
  "note": "الوصف الجديد",
  "expiry_date": "2027-06-15"
}
```

### جدول المقارنة

| ما يرسله الفرنت | ما يتوقعه الباك | التطابق | التعليق |
|-----------------|-----------------|---------|---------|
| `description` | `note` | ❌ **اسم مختلف** | الفرنت يسميه `description` والباك يتوقع `note` |
| `expires` | `expiry_date` | ❌ **اسم مختلف** | الفرنت يسميه `expires` والباك يتوقع `expiry_date` |
| `status` | ❌ **غير مدعوم** | ❌ **غير متوافق** | الباك لا يقبل تغيير الحالة عبر `update` — يجب استخدام `executeAction` بدلاً من ذلك |

> [!WARNING]
> **الفرنت يحاول تغيير الحالة (Suspend/Active) من نفس واجهة التعديل، لكن الباك إند لا يدعم ذلك في `PUT /documents/{id}` — يجب إضافة هذه الخاصية في الباك أو فصل العملية في الفرنت.**

---

## 5️⃣ صفحة التفاصيل — عرض البيانات

### ما يرسله الباك إند (`DocumentDetailsResource.php` → `GET /api/library/documents/{id}`)
```json
{
  "id": 5,
  "title": "كتاب",
  "published": "2026-03-31",
  "expires": "never",
  "status": "valid",
  "access": "selected_customers",
  "note": "وصف الكتاب",
  "details": {
    "views": "غير محدود",
    "publisher_name": "الناشر الذهبي",
    "published_at": "2026-03-31 00:00:00",
    "validation_check": "لا يتطلب الاتصال بالإنترنت للتحقق.",
    "original_name": "document_1.pdf"
  }
}
```

### ما يتوقعه الفرنت إند (Mock Data)
```json
{
  "id": 101,
  "name": "تقرير.pdf",
  "description": "وصف",
  "publishedDate": "2026-03-15",
  "status": "valid",
  "expires": "2027-03-15",
  "customersCount": 45,
  "publicationsCount": 2,
  "drm": {
    "printingEnabled": false,
    "viewingWatermark": true,
    "printingWatermark": false,
    "lockToDevice": true,
    "trackUsage": true
  }
}
```

### جدول المقارنة

| حاجة الفرنت | ما يوفره الباك إند | التطابق | التعليق |
|-------------|-------------------|---------|---------|
| `document.name` | `title` | ❌ اسم مختلف | |
| `document.description` | `note` | ❌ اسم مختلف | |
| `document.publishedDate` | `details.published_at` | ❌ اسم ومسار مختلف | |
| `document.expires` | `expires` | ✅ **متطابق** | في التفاصيل يرسلها كنص ("never" أو تاريخ) |
| `document.status` | `status` | ✅ متطابق | |
| `document.customersCount` | ❌ غير موجود | ❌ **ناقص** | يجب إضافة `withCount('customerlicense')` |
| `document.publicationsCount` | ❌ غير موجود | ❌ **ناقص** | يجب إضافة عدد المنشورات |
| `document.drm.printingEnabled` | ❌ غير موجود | ❌ **ناقص** | **الباك لا يرسل بيانات DRM** — معلومات الحماية في `securityControls` مختلفة تماماً عن شكل الـ Mock |
| `document.drm.viewingWatermark` | ❌ غير موجود | ❌ **ناقص** | لا يوجد حقل watermark في جدول `document_security_controls` |
| `document.drm.lockToDevice` | ❌ غير موجود | ❌ **ناقص** | لا يوجد |
| `document.drm.trackUsage` | ❌ غير موجود | ❌ **ناقص** | لا يوجد |

> [!CAUTION]
> **تبويبة "قواعد الحماية DRM" في الفرنت إند تعرض حقول غير موجودة في قاعدة البيانات!**
> البيانات الوهمية تحوي: `printingEnabled`, `viewingWatermark`, `printingWatermark`, `lockToDevice`, `trackUsage`
> لكن جدول `document_security_controls` يحوي فقط: `expiry_mode`, `expiry_date`, `verify_mode`, `max_views_allowed`
> **يجب إعادة تصميم تبويبة DRM لتعرض البيانات الحقيقية المتوفرة.**

---

## 📊 ملخص التوافق الشامل

| العملية | عدد الحقول | متطابق ✅ | مختلف ❌ | نسبة التوافق |
|---------|-----------|----------|---------|-------------|
| حقول بطاقة القائمة | 10 | 2 | 8 | **20%** |
| فلاتر القائمة | 8 | 5 | 3 | **63%** |
| العمليات المجمعة | 3 | 0 | 3 | **0%** |
| عملية الحفظ | 3 | 0 | 3 | **0%** |
| حقول صفحة التفاصيل | 10 | 2 | 8 | **20%** |
| **الإجمالي** | **34** | **9** | **25** | **26%** |

> [!WARNING]
> **نسبة التوافق الإجمالية: 26% فقط!**
> يوجد **25 نقطة اختلاف** يجب معالجتها عند ربط الفرنت إند بالباك إند.
> معظم الاختلافات هي **اختلافات في أسماء الحقول** (سهلة الإصلاح)، لكن هناك **5 حقول ناقصة** من الباك إند تحتاج إضافة.

---

## ✏️ التعديلات المطلوبة قبل الربط

### في الباك إند (Laravel):
1. إضافة `customersCount` (عدد العملاء) في `DocumentResource.php` باستخدام `withCount`
2. إضافة `sort_by: title` بدل `name` أو دعم `published_at` في `DocumentService`
3. إضافة فلتر `valid` في `IndexDocumentRequest` ← `show => 'in:all,valid,suspended,...'`
4. دعم تغيير `status` في `UpdateDocumentRequest` (أو فصل العملية)

### في الفرنت إند (React):
1. تغيير `doc.name` → `doc.title`
2. تغيير `doc.publishedDate` → `doc.published`
3. تغيير `doc.description` → `doc.note`
4. تغيير `doc.expires` → `doc.expired`
5. تغيير `doc.customersCount` → `doc.customersCount` (بعد إضافته للباك)
6. تغيير أسماء الـ Bulk Actions: `Suspend→suspended`, `Activate→active`, `Delete→deleted`
7. تغيير شكل بيانات Bulk: `ids→document_ids`
8. إعادة تصميم تبويبة DRM لتعرض: `expiry_mode`, `verify_mode`, `max_views_allowed` بدل الحقول الوهمية
