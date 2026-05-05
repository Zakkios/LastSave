<?php

namespace App\DTO;

class MangaShortDTO
{
    public function __construct(
        public string $id,
        public string $title,
        public string $author,
        public string $coverUrl,
    ) {}
}
