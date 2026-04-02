<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PublicationTestDataSeeder extends Seeder
{
    public function run()
    {
        // 1. استخدام الناشر الموجود بالفعل في النظام (ID = 1) بناءً على طلبك
        $publisherId = 1;

        // جلب اسم الناشر لعرضه في لوحة التحكم أثناء الزرع (كما طلبت "اكتشف اسمه")
        $publisher = DB::table('publishers')->where('id', $publisherId)->first();
        if (!$publisher) {
            $this->command->error("لم يتم العثور على الناشر يحمل المعرف 1 (golden_TlPz@test.com). تأكد من وجوده.");
            return;
        }
        $this->command->info("تم العثور على الناشر: " . $publisher->name . " وسيتم ربط المنشورات به.");

        // 2. توليد 5 منشورات وهمية
        $publicationIds = [];
        for ($i = 1; $i <= 5; $i++) {
            $publicationIds[] = DB::table('publications')->insertGetId([
                'name' => "منشور تجريبي رقم $i",
                'description' => "هذا وصف مخصص للمنشور رقم $i لاختبار عمل واجهة المنشورات بعد تحديثها بـ React Query.",
                'obey' => (bool) rand(0, 1),
                'status' => 'active',
                'publisher_id' => $publisherId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 3. توليد 20 مستند وربط بعضها بالمنشور الأول مباشرة
        $documentIds = [];
        for ($i = 1; $i <= 20; $i++) {
            // ضمان أن أول 5 مستندات مملوكة للمنشور رقم 1 لكي نجد بيانات عند الدخول له
            $pubId = $i <= 5 ? $publicationIds[0] : (rand(0, 1) ? $publicationIds[array_rand($publicationIds)] : null);

            $documentIds[] = DB::table('documents')->insertGetId([
                'document_uuid' => Str::uuid(),
                'title' => "كتاب رقم $i (pdf)",
                'type' => 'pdf', // يجب أن تكون بحروف صغيرة حسب قاعدة البيانات
                'description' => "محتوى الكتاب التجريبي رقم $i",
                'size' => rand(15000, 500000), // حجم عشوائي
                'file_hash' => Str::random(40),
                'original_filename' => "document_$i.pdf",
                'status' => 'valid',
                'access_scope' => 'publication', // الكلمة الصحيحة بحسب الداتابيز
                'publisher_id' => $publisherId,
                'publication_id' => $pubId,
                'created_at' => now()->subDays(rand(1, 10)),
                'updated_at' => now(),
            ]);
        }

        // 4. توليد 15 رخصة لعملاء وهميين
        $licenseIds = [];
        $statuses = ['active', 'active', 'active', 'suspend']; // احتمالية أكبر أن يكونوا نشطين
        for ($i = 1; $i <= 15; $i++) {
            $licenseIds[] = DB::table('customer_licenses')->insertGetId([
                'email' => "user$i@testing.com",
                'name' => "متدرب $i",
                'company' => "شركة $i للتدريب",
                'publisher_id' => $publisherId,
                'type' => 'individual',
                'valid_from' => now()->subDays(rand(10, 30)),
                'valid_until' => now()->addMonths(rand(1, 12)),
                'never_expires' => false,
                'status' => $statuses[array_rand($statuses)],
                'send_via_email' => 0,
                'created_at' => now()->subMonths(rand(1, 3)),
                'updated_at' => now(),
            ]);
        }

        // 5. إجبار ربط التبويبات (إضافة العملاء لدخول المنشور الأول)
        // لكي نختبر دالة getSubscribers و زر الإزالة بنجاح
        foreach ($licenseIds as $licenseId) {
            DB::table('license_publications')->insert([
                'customer_license_id' => $licenseId,
                'publication_id' => $publicationIds[0],
                'access_mode' => 'unlimited',
                'valid_from' => now(),
                'valid_until' => now()->addYear(),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info("✅ تم زرع: 5 منشورات، 20 مستند، و 15 رخصة عميل (وتم ربطهم بالمنشور الأول جاهزين للاختبار)!");
    }
}
