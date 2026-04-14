<?php

namespace App\Mapper;

use App\DTO\MangaDTO;

class MangaMapper
{
    public function fromEntity(array $mangaData, ?string $author = null, ?string $coverUrl = null): MangaDTO
    {
        $mangaDTO = new MangaDTO(
            id: $mangaData['data']['id'],
            title: $this->resolveTitle($mangaData['data']['attributes']),
            author: $author,
            coverUrl: $coverUrl ?? ''
        );
        return $mangaDTO;
    }

    public function fromCollection(array $mangaData, ?array $authors = null, ?array $coverUrls = null): array
    {
        $mangaDTOs = [];
        foreach ($mangaData['data'] as $index => $manga) {
            $mangaDTOs[] = new MangaDTO(
                id: $manga['id'],
                title: $this->resolveTitle($manga['attributes']),
                author: $authors[$index] ?? '',
                coverUrl: $coverUrls[$index] ?? ''
            );
        }
        return $mangaDTOs;
    }

    private function resolveTitle(array $attributes): string
    {
        $altTitles = $attributes['altTitles'] ?? [];

        $frenchTitle = array_values(array_filter(
            $altTitles,
            fn($title) => isset($title['fr'])
        ))[0]['fr'] ?? null;

        return $frenchTitle
            ?? $attributes['title']['en']
            ?? 'Titre introuvable';
    }
}
