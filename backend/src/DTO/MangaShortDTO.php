<?php

namespace App\DTO;

class MangaShortDTO implements UserMangaEntryAwareDTO
{
    public function __construct(
        public string $id,
        public string $title,
        public string $author,
        public string $coverUrl,
        public bool $isInLibrary = false,
        public ?string $readingStatus = null,
        public ?string $readingStatusLabel = null,
        // Reading progress, null when the manga is not in the user's library.
        public ?string $progressUnit = null,
        public ?float $lastReadChapter = null,
        public ?int $lastReadVolume = null,
    ) {}

    public function markAsInLibrary(string $readingStatus, string $readingStatusLabel): void
    {
        $this->isInLibrary = true;
        $this->readingStatus = $readingStatus;
        $this->readingStatusLabel = $readingStatusLabel;
    }

    public function setReadingProgress(string $progressUnit, ?float $lastReadChapter, ?int $lastReadVolume): void
    {
        $this->progressUnit = $progressUnit;
        $this->lastReadChapter = $lastReadChapter;
        $this->lastReadVolume = $lastReadVolume;
    }
}
