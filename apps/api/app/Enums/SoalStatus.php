<?php

namespace App\Enums;

enum SoalStatus: string
{
    case SUBMITTED = 'SUBMITTED';
    case REVISION = 'REVISION';
    case APPROVED = 'APPROVED';
    case REJECTED = 'REJECTED';
}
