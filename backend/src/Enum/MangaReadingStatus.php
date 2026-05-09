<?php

namespace App\Enum;

enum MangaReadingStatus: string
{
    case to_read = 'to_read';
    case reading = 'reading';
    case completed = 'completed';
    case dropped = 'dropped';

    public function label(): string
    {
        return match ($this) {
            self::to_read => 'A lire',
            self::reading => 'En cours',
            self::completed => 'Terminé',
            self::dropped => 'Abandonné',
        };
    }
}
