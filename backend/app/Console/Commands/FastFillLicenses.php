<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

// استيراد جميع الموديلات من كل الوحدات
use Modules\PublisherWorkspace\Models\Publisher;
use Modules\Library\Models\Publication;
use Modules\Library\Models\Document;
use Modules\CustomerManagement\Models\CustomerLicense;
use Modules\CustomerManagement\Models\Voucher;

class FastFillLicenses extends Command
{
    // اسم الأمر في التيرمينال (سنبقيه كما هو لكي لا تغير عاداتك)
    protected $signature = 'licenses:fill';
    protected $description = 'تعبئة النظام بالكامل (ناشر، منشور، ملف، رخص، وكروت) ببيانات مترابطة 100%';

    public function handle()
    {
        $this->info('--- 🚀 جاري بناء بيئة اختبار كاملة ومترابطة من الصفر ---');

        // ==========================================
        // 1. إنشاء الناشر (Publisher)
        // ==========================================
        // ==========================================
        // 1. إنشاء الناشر (Publisher)
        // ==========================================
        $publisher = Publisher::create([
            'name' => 'الناشر الذهبي',
            'email' => 'test@gmail.com',
            'password' => bcrypt('12345678'), // 👈 أضفنا هذا السطر لحل المشكلة
        ]);
        $this->line("✅ تم إنشاء الناشر: {$publisher->name} (ID: {$publisher->id})");
        // ==========================================
        // 2. إنشاء المنشور (Publication)
        // ==========================================
        $publication = Publication::create([
            'publisher_id' => $publisher->id,
            'name' => 'الموسوعة الشاملة 2026',
            'description' => 'موسوعة علمية متكاملة تحتوي على ملفات محمية',
            // 'status' => 'active', // أضفها إذا كانت مطلوبة في قاعدة بياناتك
        ]);
        $this->line("✅ تم إنشاء المنشور: {$publication->name} (ID: {$publication->id})");

        // ==========================================
        // 3. إنشاء الملف الأساسي (Document)
        // ==========================================
        $document = Document::create([
            'document_uuid' => (string) Str::uuid(),
            'publisher_id' => $publisher->id,
            'publication_id' => null,
            'type' => 'pdf',
            'title' => 'كتاب البرمجة المتقدمة',
            'file_hash' => hash('sha256', Str::random(10)),
            'access_scope' => 'selected_customers', // نطاق مخصص ليتم ربطه بالرخصة
            'status' => 'valid',
        ]);
        $this->line("✅ تم إنشاء الملف: {$document->title} (ID: {$document->id})");

        // (اختياري ولكن مهم) بناء إعدادات الأمان والمفتاح للملف باستخدام DB مباشرة لتجنب أخطاء الموديلات
        \Illuminate\Support\Facades\DB::table('document_keys')->insert([
            'document_id' => $document->id,
            'encrypted_key' => base64_encode(Str::random(32)),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        \Illuminate\Support\Facades\DB::table('document_security_controls')->insert([
            'document_id' => $document->id,
            'expiry_mode' => 'never',
            'max_views_allowed' => 100,
            'verify_mode' => 'never',
            'verify_frequency_days' => 0,
            'grace_period_days' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $this->line("🔒 تم توليد مفاتيح التشفير وإعدادات الأمان للملف.");
        $this->newLine();

        // ==========================================
        // 4. إنشاء رخصة فردية (Individual License)
        // ==========================================
        $this->info('--- 🎟️ جاري توليد الرخص والكروت ---');
        $individualLicense = CustomerLicense::create([
            'publisher_id' => $publisher->id,
            'name' => 'طالب تجريبي (فردي)',
            'email' => 'student@test.com',
            'note' => 'رخصة فردية للوصول المباشر',
            'type' => 'individual',
            'status' => 'active',
            'max_devices' => 2,
            'valid_from' => now(),
            'valid_until' => now()->addYear(),
            'never_expires' => false,
            'send_via_email' => true,
        ]);

        // ربط الرخصة الفردية بالمنشور والملف
        $individualLicense->publications()->attach($publication->id, [
            'access_mode' => 'unlimited',
            'status' => 'active',
            'valid_from' => now(),
            'valid_until' => now()->addYear(),
        ]);

        $individualLicense->documents()->attach($document->id, [
            'access_mode' => 'baselimited',
            'status' => 'active',
            'views_override' => 50,
            'valid_from' => now(),
            'valid_until' => now()->addYear(),
        ]);
        $this->line("✅ تم إنشاء رخصة فردية (ID: {$individualLicense->id}) وربطها بالمنشور والملف.");

        // ==========================================
        // 5. إنشاء رخصة جماعية (Group License) مع الكروت
        // ==========================================
        $groupLicense = CustomerLicense::create([
            'publisher_id' => $publisher->id,
            'name' => 'مدرسة الأمل (جماعي)',
            'email' => 'school@test.com',
            'company' => 'مدرسة الأمل الأهلية',
            'note' => 'رخصة جماعية للطلاب',
            'type' => 'group',
            'status' => 'active',
            'max_devices' => 1,
            'valid_from' => now(),
            'valid_until' => now()->addMonths(6),
            'never_expires' => false,
        ]);

        $groupLicense->publications()->attach($publication->id, [
            'access_mode' => 'limited',
            'status' => 'active',
            'valid_from' => now(),
            'valid_until' => now()->addMonths(6),
        ]);

        for ($i = 1; $i <= 5; $i++) {
            Voucher::create([
                'customer_license_id' => $groupLicense->id,
                'pin_code' => strtoupper(Str::random(4) . '-' . Str::random(4) . '-' . Str::random(4)),
                'status' => 'available',
            ]);
        }
        $this->line("✅ تم إنشاء رخصة جماعية (ID: {$groupLicense->id}) وتوليد 5 كروت تابعة لها.");

        $this->newLine();
        $this->info('🎉 تمت العملية بنجاح! البيئة التجريبية الآن مثالية وجاهزة للاختبار.');
    }
}
