<?php

namespace App\Mapper;

use App\DTO\MangaShortDTO;
use App\Mapper\Resolver\MangaTitleResolver;

class MangaMapper
{
    function __construct(private MangaTitleResolver $mangaTitleResolver) {}

    public function fromEntity(array $mangaData, ?string $author = null, ?string $coverUrl = null): MangaShortDTO
    {
        $mangaShortDTO = new MangaShortDTO(
            id: $mangaData['data']['id'],
            title: $this->mangaTitleResolver->resolveTitle($mangaData['data']['attributes']),
            author: $author ?? '',
            coverUrl: $coverUrl ?? ''
        );
        return $mangaShortDTO;
    }

    public function fromCollection(array $mangaData, ?array $authors = null, ?array $coverUrls = null): array
    {
        $mangaDTOs = [];
        foreach ($mangaData['data'] as $index => $manga) {
            $mangaDTOs[] = new MangaShortDTO(
                id: $manga['id'],
                title: $this->mangaTitleResolver->resolveTitle($manga['attributes']),
                author: $authors[$index] ?? '',
                coverUrl: $coverUrls[$index] ?? ''
            );
        }
        return $mangaDTOs;
    }
}
