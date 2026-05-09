<?php

namespace App\DTO;

interface UserMangaEntryAwareDTO
{
    public function markAsInLibrary(string $readingStatus, string $readingStatusLabel): void;
}