<?php

namespace App\Enums;

enum VerifikasiAction: string
{
    case APPROVED = 'APPROVED';
    case REVISION = 'REVISION';
    case REJECTED = 'REJECTED';
}
