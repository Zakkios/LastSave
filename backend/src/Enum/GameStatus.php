<?php

namespace App\Enum;

enum GameStatus: string
{
    case to_play = 'to_play';
    case playing = 'playing';
    case completed = 'completed';
    case dropped = 'dropped';
}
