# التوثيق الشامل للباك إند (قسم المنشورات)

بناءً على طلبك، هذا توثيق دقيق لكل سطر كود تمت إضافته في الباك إند (Laravel) لكي يعود قسم المنشورات للحياة، مع توضيح مسار الملفات.

---

## 1️⃣ ملف المسارات (Routes)
**📂 مسار الملف:** `Modules/Library/routes/api.php`

لقد تم إضافة 5 مسارات جديدة (Endpoints) تعمل تحت الوسيط `auth:sanctum`، وهي المخصصة للتحكم بالتفاصيل والمستندات والعملاء المربوطين بالمنشور:

```php
// مسار جلب تفاصيل منشور فردي (لاستخدامه في صفحة التعديل)
Route::get('publications/{id}', [PublicationController::class, 'show']);

// مسارات المستندات التابعة للمنشور (Tab 2)
Route::get('publications/{id}/documents', [PublicationController::class, 'getDocuments']);
Route::post('publications/{id}/documents/attach', [PublicationController::class, 'attachDocuments']);
Route::delete('publications/{id}/documents/{document_id}', [PublicationController::class, 'detachDocument']);

// مسارات العملاء التابعين للمنشور (Tab 3)
Route::get('publications/{id}/subscribers', [PublicationController::class, 'getSubscribers']);
Route::post('publications/{id}/subscribers/revoke', [PublicationController::class, 'revokeSubscriberAccess']);
```

---

## 2️⃣ الكنترولر (Controller)
**📂 مسار الملف:** `Modules/Library/app/Http/Controllers/PublicationController.php`

لقد قمنا بكتابة الدوال الخمسة الأهم داخل هذا الكنترولر، وهي كالتالي:

### الدالة الأولى: `show` (جلب تفاصيل المنشور)
```php
/**
 * عرض تفاصيل منشور واحد
 */
public function show($id)
{
    try {
        $publication = Publication::withCount(['documents as docsCount', 'customerlicense as customersCount'])->find($id);

        if (!$publication) {
            return $this->sendResponse(false, 1004, null, 404, 'المنشور غير موجود');
        }

        return $this->sendResponse(true, 1001, $publication, 200, 'تم جلب المنشور بنجاح');
    } catch (\Exception $e) {
        return $this->sendResponse(false, 1005, null, 500, 'حدث خطأ أثناء جلب المنشور: ' . $e->getMessage());
    }
}
```

### الدالة الثانية: `getSubscribers` (جلب العملاء المصرح لهم)
تعمل هذه الدالة على جلب جميع العملاء الذين يمتلكون رخصة (License) في هذا المنشور من جدول `customer_licenses`.
```php
/**
 * جلب الرخص والعملاء المتعلقين بهذا المنشور (Tab Customers)
 */
public function getSubscribers($id)
{
    try {
        $publication = Publication::find($id);

        if (!$publication) {
            return $this->sendResponse(false, 1004, null, 404, 'المنشور غير موجود');
        }

        // جلب العملاء عبر علاقة customerlicense (محاكاة لاستخراج بيانات العميل للفرنت اند)
        $licenses = $publication->customerlicense()->with('customer')->get();
        
        // إعادة التشكيل لتناسب جدول العرض في الفرنت إند
        $customers = $licenses->map(function($license) {
            return [
                'id' => $license->customer_id,
                'name' => $license->customer->first_name . ' ' . $license->customer->last_name,
                'company' => $license->customer->company ?? '',
                'email' => $license->customer->email,
                'status' => $license->status === 1 ? 'registered' : 'suspended',
                'registered' => $license->created_at ? $license->created_at->format('Y-m-d') : null,
                'expires' => $license->end_date ?? null,
            ];
        });

        return $this->sendResponse(true, 1001, $customers, 200, 'تم جلب العملاء المشتركين');
    } catch (\Exception $e) {
        return $this->sendResponse(false, 1005, null, 500, 'حدث خطأ: ' . $e->getMessage());
    }
}
```

### الدالة الثالثة: `revokeSubscriberAccess` (إلغاء الوصول للعملاء)
تقوم هذه الدالة بفصل صلاحية العملاء الجماعية عبر سحب المنشور من رخصهم.
```php
/**
 * إلغاء حق وصول مجموعة عملاء من هذا المنشور (Bulk Revoke)
 */
public function revokeSubscriberAccess(Request $request, $id)
{
    $validator = Validator::make($request->all(), [
        'customer_ids' => 'required|array',
        'customer_ids.*' => 'integer|exists:customers,id',
    ]);

    if ($validator->fails()) {
        return $this->sendResponse(false, 1002, $validator->errors(), 422, 'بيانات العملاء غير صحيحة');
    }

    try {
        $publication = Publication::find($id);

        if (!$publication) {
            return $this->sendResponse(false, 1004, null, 404, 'المنشور غير موجود');
        }

        // إزالة الرخص المتعلقة بهؤلاء العملاء على هذا المنشور
        $publication->customerlicense()->whereIn('customer_id', $request->customer_ids)->delete();

        return $this->sendResponse(true, 1003, null, 200, 'تم إلغاء صلاحية الوصول بنجاح للعملاء المحددين');
    } catch (\Exception $e) {
        return $this->sendResponse(false, 1005, null, 500, 'حدث خطأ: ' . $e->getMessage());
    }
}
```

### الدالة الرابعة: `attachDocuments` (ربط مستندات بالمنشور)
```php
/**
 * إضافة مستندات (ربطها) بهذا المنشور
 */
public function attachDocuments(Request $request, $id)
{
    $validator = Validator::make($request->all(), [
        'document_ids' => 'required|array',
        'document_ids.*' => 'integer|exists:documents,id',
    ]);

    if ($validator->fails()) {
        return $this->sendResponse(false, 1002, $validator->errors(), 422, 'البيانات المرسلة غير صحيحة');
    }

    try {
        $publication = Publication::find($id);

        if (!$publication) {
            return $this->sendResponse(false, 1004, null, 404, 'المنشور غير موجود');
        }

        // تحديث publication_id داخل جدول documents للمستندات المحددة
        \Modules\Library\app\Models\Document::whereIn('id', $request->document_ids)
            ->update(['publication_id' => $publication->id]);

        return $this->sendResponse(true, 1003, null, 200, 'تم إضافة المستندات بنجاح للمنشور');
    } catch (\Exception $e) {
        return $this->sendResponse(false, 1005, null, 500, 'حدث خطأ: ' . $e->getMessage());
    }
}
```

### الدالة الخامسة: `detachDocument` (فك ارتباط مستند)
تقوم هذه الدالة بفصل المستند عن المنشور بحيث يظل المستند موجوداً في النظام وبدون الانتماء لأي منشور آخر (عبر جعل الـ `publication_id` يساوي Null).
```php
/**
 * إزالة مستند من المنشور (إلغاء الربط)
 */
public function detachDocument($id, $document_id)
{
    try {
        $document = \Modules\Library\app\Models\Document::where('id', $document_id)
            ->where('publication_id', $id)
            ->first();

        if (!$document) {
            return $this->sendResponse(false, 1004, null, 404, 'المستند غير موجود أو غير مرتبط بهذا المنشور');
        }

        // إلغاء الربط فقط وليس حذفه من النظام نهائياً
        $document->update(['publication_id' => null]);

        return $this->sendResponse(true, 1003, null, 200, 'تم إزالة ارتباط المستند بهذا المنشور بنجاح');
    } catch (\Exception $e) {
        return $this->sendResponse(false, 1005, null, 500, 'حدث خطأ: ' . $e->getMessage());
    }
}
```

---

> [!NOTE]
> هذه هي "البنية المدمجة" التي تم كتابتها باحترافية وتوافقية تامة مع معايير لارافيل لديك (استخدام `Validator` للتحقق، و `sendResponse` للرد الموحد، و `try/catch` لاصطياد الأخطاء، وحفظ التناسق الدقيق للقواعد القديمة). يمكنك الاحتفاظ بهذا التقرير في مراجعاتك.
