<?php

namespace App\Enum;

enum GameStatus: string
{
    case to_play = 'to_play';
    case playing = 'playing';
    case completed = 'completed';
    case dropped = 'dropped';

    public function label(): string
    {
        return match ($this) {
            self::to_play => 'À jouer',
            self::playing => 'En cours',
            self::completed => 'Terminé',
            self::dropped => 'Abandonné',
        };
    }
}
