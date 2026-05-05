<?php

namespace App\Enum;

enum MangaPublicationStatus: string
{
    case ongoing = 'ongoing';
    case completed = 'completed';
    case hiatus = 'hiatus';
    case cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::ongoing => 'En cours',
            self::completed => 'Terminé',
            self::hiatus => 'En pause',
            self::cancelled => 'Annulé',
        };
    }
}
