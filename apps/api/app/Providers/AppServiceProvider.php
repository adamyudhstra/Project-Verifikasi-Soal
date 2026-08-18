<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

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
        Gate::define('createKoordinatorAssignment', [\App\Policies\AssignmentPolicy::class, 'createKoordinatorAssignment']);
        Gate::define('deleteKoordinatorAssignment', [\App\Policies\AssignmentPolicy::class, 'deleteKoordinatorAssignment']);
        Gate::define('createPenugasanVerifikator', [\App\Policies\AssignmentPolicy::class, 'createPenugasanVerifikator']);
        Gate::define('deletePenugasanVerifikator', [\App\Policies\AssignmentPolicy::class, 'deletePenugasanVerifikator']);
    }
}
