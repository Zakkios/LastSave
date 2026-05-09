<?php

namespace App\DTO;

class MangaCompleteDTO implements UserMangaEntryAwareDTO
{
    public function __construct(
        public string $id,
        public string $title,
        public string $description,
        public string $author,
        public string $coverUrl,
        public array $genres,
        public array $themes,
        public string $numberOfVolumes,
        public string $numberOfChapters,
        public string $publicationStatus,
        public string $publicationYear,
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
