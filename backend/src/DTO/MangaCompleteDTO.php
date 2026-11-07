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
        public ?string $readingStatusLabel = null,
        // The series is over on MangaDex; its final chapter / volume when MangaDex knows it.
        public bool $isSeriesCompleted = false,
        public ?float $finalChapter = null,
        public ?int $finalVolume = null,
        // Reading progress, null when the manga is not in the user's library.
        public ?string $progressUnit = null,
        public ?float $lastReadChapter = null,
        public ?int $lastReadVolume = null,
        // Latest chapter published in French on MangaDex; only filled where it is shown
        // (detail page, mangas to resume), as it costs one more request.
        public ?float $latestFrenchChapter = null,
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
