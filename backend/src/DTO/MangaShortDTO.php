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
        public ?string $readingStatusLabel = null
    ) {}

    public function markAsInLibrary(string $readingStatus, string $readingStatusLabel): void
    {
        $this->isInLibrary = true;
        $this->readingStatus = $readingStatus;
        $this->readingStatusLabel = $readingStatusLabel;
    }
}
