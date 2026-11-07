<?php

namespace App\DTO;

class GameShortDTO implements UserGameEntryAwareDTO
{
    /**
     * @param string[] $platforms
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
