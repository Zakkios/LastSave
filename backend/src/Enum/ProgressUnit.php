<?php

namespace App\Enum;

/**
 * How the user follows a manga: by chapter (digital) or by volume (paper).
 */
enum ProgressUnit: string
{
    case chapter = 'chapter';
    case volume = 'volume';

    public function label(): string
    {
        return match ($this) {
            self::chapter => 'Chapitres',
            self::volume => 'Tomes',
        };
    }
}
