<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'ability'          => \Laravel\Sanctum\Http\Middleware\CheckForAnyAbility::class,
            'writer.signature' => \Modules\PublisherWorkspace\Http\Middleware\VerifyWriterSignature::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        // ✅ كل طلب API يرجع JSON 401 بدل redirect إلى route [login]
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.',
                    'code'    => 401,
                ], 401);
            }
        });

    })->create();
