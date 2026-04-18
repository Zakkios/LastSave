<?php

namespace App\Enum;

enum MangaStatus: string
{
    case to_read = 'to_read';
    case reading = 'reading';
    case completed = 'completed';
    case dropped = 'dropped';
}