<?php

namespace App\DTO;

interface UserGameEntryAwareDTO
{
    public function markAsInLibrary(string $playStatus, string $playStatusLabel): void;
}
