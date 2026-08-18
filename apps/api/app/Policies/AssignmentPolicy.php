<?php

namespace App\Policies;

use App\Models\User;

class AssignmentPolicy
{
    public function createKoordinatorAssignment(User $user): bool
    {
        return $user->role === 'SUPER_ADMIN';
    }

    public function deleteKoordinatorAssignment(User $user): bool
    {
        return $user->role === 'SUPER_ADMIN';
    }

    public function createPenugasanVerifikator(User $user): bool
    {
        return $user->role === 'SUPER_ADMIN';
    }

    public function deletePenugasanVerifikator(User $user): bool
    {
        return $user->role === 'SUPER_ADMIN';
    }
}
