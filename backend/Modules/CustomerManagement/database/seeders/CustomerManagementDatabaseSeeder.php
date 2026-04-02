<?php

namespace Modules\CustomerManagement\Database\Seeders;

use Illuminate\Database\Seeder;

class CustomerManagementDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('ar_SA'); 
        $licenseService = app(\Modules\CustomerManagement\Services\License\LicenseService::class);
        
        // التحقق من وجود جدول المشرفين لجلب publisher_id، سنستخدم 1 كافتراضي
        $publisherId = \Illuminate\Support\Facades\DB::table('admins')->first()->id ?? 1;

        for ($i = 0; $i < 10; $i++) {
            $type = $faker->randomElement(['individual', 'group']);
            $licenseService->createLicense([
                'publisher_id' => $publisherId,
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'company' => $faker->company,
                'note' => $faker->realText(50),
                'type' => $type,
                'count_license' => $type === 'group' ? rand(2, 5) : null,
                'valid_from' => now()->subDays(rand(1, 10))->format('Y-m-d'),
                'never_expires' => true,
                'valid_until' => null,
                'send_via_email' => false,
            ]);
        }
    }
}
