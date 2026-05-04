<?php

namespace App\Enum;

enum MangaPublicationStatus: string
{
    case ongoing = 'ongoing';
    case completed = 'completed';
    case hiatus = 'hiatus';
    case cancelled = 'cancelled';
}