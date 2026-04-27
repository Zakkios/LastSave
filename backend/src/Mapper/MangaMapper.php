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
        $mainTitle = $attributes['title'] ?? [];
        $altTitles = $attributes['altTitles'] ?? [];

        $frenchTitle = $this->findAltTitleByLanguage($altTitles, 'fr');
        $englishTitle = $mainTitle['en'] ?? null;
        $englishAltTitle = $this->findAltTitleByLanguage($altTitles, 'en');

        $title = $frenchTitle
            ?? $englishTitle
            ?? $englishAltTitle
            ?? reset($mainTitle)
            ?: 'Titre introuvable';

        return $title;
    }

    private function findAltTitleByLanguage(array $altTitles, string $language): ?string
    {
        foreach ($altTitles as $title) {
            if (isset($title[$language]) && is_string($title[$language])) {
                return $title[$language];
            }
        }

        return null;
    }
}
