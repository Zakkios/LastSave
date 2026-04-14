<?php

namespace App\DTO;

class MangaDTO
{
    public function __construct(
        public string $id,
        public string $title,
        public string $author,
        public string $coverUrl,
    ) {}
}
