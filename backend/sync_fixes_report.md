# تقرير إصلاح وتوحيد الحقول (Frontend & Backend Sync Report)

تم إنشاء هذا التقرير لتوثيق كافة التعديلات البرمجية التي تمت لإصلاح خطأ `Column not found` الناجم عن اختلاف تسمية حقل "الالتزام بتاريخ البدء" بين واجهة المستخدم وقاعدة البيانات، بالإضافة إلى تصحيح نموذج استرجاع العملاء.

---

## 1️⃣ تعديل الموديل (Laravel Model)
**الملف:** `Locklizar/lockLizear-project/Modules/Library/app/Models/Publication.php`
**السبب:** حقل قاعدة البيانات الفعلي اسمه `obey`، بينما الموديل كان مهيأً لقبول `obey_customer_start_date`، مما تسبب في رفض الإدخال.

**الوضع السابق:**
```php
    protected $fillable = [
        'name',
        'description',
        'obey_customer_start_date',
        'publisher_id',
    ];

    protected $casts = [
        'obey_customer_start_date' => 'boolean',
    ];
```

**الوضع الحالي:**
```php
    protected $fillable = [
        'name',
        'description',
        'obey',
        'status',
        'publisher_id',
    ];

    protected $casts = [
        'obey' => 'boolean',
    ];
```

---

## 2️⃣ تعديل موحد البيانات (API Resource)
**الملف:** `Locklizar/lockLizear-project/Modules/Library/app/Transformers/PublicationResource.php`
**السبب:** الرد القديم كان يرسل مفاتيح بأسماء لا تتوافق مع تصميم الفرنت إند بـ React (مفاتيح بنظام snake_case بدلاً من camelCase) وكان يحول الـ Boolean إلى Yes/No نصية بدلاً من قيمة منطقية.

**الوضع السابق:**
```php
    public function toArray($request)
    {
        return [
            // ...
            'obey' => $this->obey ? 'yes' : 'no',
            'customers_count' => $this->customerlicense_count ?? 0,
            'documents_count' => $this->documents_count ?? 0,
            'date_added' => Carbon::parse($this->created_at)->format('m-d-Y'),
        ];
    }
```

**الوضع الحالي:**
```php
    public function toArray($request)
    {
        return [
            // ...
            'obey' => (bool)$this->obey,
            'customersCount' => $this->customersCount ?? 0,
            'docsCount' => $this->docsCount ?? 0,
            'createdAt' => Carbon::parse($this->created_at)->format('Y-m-d'),
        ];
    }
```

---

## 3️⃣ تعديل الكنترولر (Controller)
**الملف:** `Locklizar/lockLizear-project/Modules/Library/app/Http/Controllers/PublicationController.php`
**السبب:** دالة `getSubscribers` كانت تبحث عن اسم العميل داخل جدول منفصل، لكن بيانات العميل الحقيقية موجودة مسبقاً في جدول الرخص `customer_licenses`، كما تم توحيد مخرج الدالة ليتطابق مع ما تتوقعه بطاقة React.

**الوضع السابق:**
```php
        $licenses = $publication->customerlicense()->with('customer')->get();
        // ...
        'name' => $license->customer->first_name . ' ' . $license->customer->last_name,
        'registered' => $license->created_at ? $license->created_at->format('Y-m-d') : null,
        'expires' => $license->end_date ?? null,
```

**الوضع الحالي:**
```php
        $licenses = $publication->customerlicense()->get();
        // ...
        'name' => $license->name,
        'registered' => $license->created_at ? $license->created_at->format('Y-m-d') : null,
        'expires' => $license->valid_until ? $license->valid_until->format('Y-m-d') : '—',
```

---

## 4️⃣ تعديل السِيدَر الفاحص (Test Data Seeder)
**الملف:** `Locklizar/lockLizear-project/database/seeders/PublicationTestDataSeeder.php`
**السبب:** الخطأ ظهر بسبب محاولة إدخال الناشر بدون `password` وبسبب محاولة استخدام `obey_customer_start_date`. تم تصحيح ذلك واستخدام الناشر رقم 1 بناءً على طلبك للاختبار الفعلي.

**الوضع السابق:**
```php
            $publicationIds[] = DB::table('publications')->insertGetId([
                // ...
                'obey_customer_start_date' => (bool)rand(0, 1), // كان يسبب خطأ
            ]);
```

**الوضع الحالي:**
```php
            $publicationIds[] = DB::table('publications')->insertGetId([
                // ...
                'obey' => (bool)rand(0, 1),
                'status' => 'active',
            ]);
```

---

## 5️⃣ تعديلات الفرنت إند (React Frontend Files)
تم تطبيق التعديلات الثلاثة التالية لتوحيد مسمى المتغير `obey` عبر كافة شاشات المنشورات:

### 🔹 شاشة قائمة المنشورات (`PublicationsListPage.jsx`)
تم تغيير الكود الذي يعتمد على قراءة `obey_customer_start_date` إلى `obey`:
**الوضع الحالي في البحث (Filter):**
```javascript
    if (showFilter === 'obey') {
      result = result.filter(p => p.obey)
    } else if (showFilter === 'no-obey') {
      result = result.filter(p => !p.obey)
    }
```

### 🔹 شاشة تعديل المنشور (`EditPublicationPage.jsx`)
تم تغيير قراءة وإرسال الحقل من الواجهة للباك إند:
**الوضـع الحالي وقت الحفظ:**
```javascript
    updateMutation.mutate({ 
      id: publication.id, 
      name, 
      description, 
      obey: obeyStartDate 
    })
```

### 🔹 شاشة إضافة المنشور (`CreatePublicationPage.jsx`)
كانت ترسل الحقل باسمه الطويل، وتم تغييره ليتماشى مع الباك إند:
**الوضع الحالي وقت الإنشاء:**
```javascript
    createMutation.mutate({ 
        name, 
        description, 
        obey: obeyStartDate 
      }, // ...
```

--- 

> [!TIP]
> **الخلاصة:**
> أدى توحيد الكلمة البرمجية إلى `obey` في الـ (داتابيز، والكنترولر، والموديل، وملفات الفرنت إند كلها) إلى سد أي فجوة محتملة، وأصبحت البيانات تنتقل من طرف إلى طرف بانسجام تام.
