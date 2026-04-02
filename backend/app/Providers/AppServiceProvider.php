<?php

namespace App\Providers;

use Dedoc\Scramble\Scramble;
use Illuminate\Routing\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        Scramble::routes(function (Route $route) {
            // نحدد هنا أننا نريد فقط المسارات التي تبدأ بـ api/publications أو api/documents
            // ملاحظة: لارافل عادة يضيف البادئة 'api' تلقائياً لمسارات الـ API.
            // إذا كنت لا تستخدم بادئة 'api' في ملفات الراوت لديك، احذف كلمة 'api/' من الشرط أدناه.

            return Str::startsWith($route->uri, ['api/publications', 'api/documents']);
        });
    }
}
