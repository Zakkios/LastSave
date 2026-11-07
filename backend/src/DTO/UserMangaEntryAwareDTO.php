<?php

namespace App\DTO;

interface UserMangaEntryAwareDTO
{
    public function markAsInLibrary(string $readingStatus, string $readingStatusLabel): void;

    // Where the user is: unit ('chapter' or 'volume') and the last chapter / volume read.
    public function setReadingProgress(string $progressUnit, ?float $lastReadChapter, ?int $lastReadVolume): void;
}
