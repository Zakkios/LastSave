<?php

namespace App\DTO;

class GameCompleteDTO implements UserGameEntryAwareDTO
{
    /**
     * @param string[] $platforms
     * @param string[] $genres
     * @param string[] $themes
     */
    public function __construct(
        public int $id,
        public string $title,
        public ?string $developer,
        public ?string $coverUrl,
        public ?int $rating,
        public array $platforms,
        // First release date (Y-m-d, UTC), null when IGDB has none.
        public ?string $releaseDate,
        public ?string $summary,
        public ?string $releaseYear,
        public array $genres,
        public array $themes,
        public bool $isInLibrary = false,
        public ?string $playStatus = null,
        public ?string $playStatusLabel = null,
    ) {}

    public function markAsInLibrary(string $playStatus, string $playStatusLabel): void
    {
        $this->isInLibrary = true;
        $this->playStatus = $playStatus;
        $this->playStatusLabel = $playStatusLabel;
    }
}
