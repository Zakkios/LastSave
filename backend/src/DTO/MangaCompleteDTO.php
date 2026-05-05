<?php

namespace App\DTO;

class MangaCompleteDTO
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
        public string $publicationYear
    ) {}
}
