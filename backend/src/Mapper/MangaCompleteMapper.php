<?php

namespace App\Mapper;

use App\DTO\MangaCompleteDTO;
use App\Enum\MangaPublicationStatus;
use App\Mapper\Resolver\MangaTitleResolver;

class MangaCompleteMapper
{
    public function __construct(private MangaTitleResolver $mangaTitleResolver) {}

    public function fromEntity(array $mangaData, ?string $author = null, ?string $coverUrl = null): MangaCompleteDTO
    {
        $mangaAttributes = $mangaData['data']['attributes'];

        $genres = $this->resolveTagsByGroup($mangaAttributes['tags'] ?? [], 'genre');
        $themes = $this->resolveTagsByGroup($mangaAttributes['tags'] ?? [], 'theme');

        return new MangaCompleteDTO(
            id: $mangaData['data']['id'],
            title: $this->mangaTitleResolver->resolveTitle($mangaAttributes),
            description: $mangaAttributes['description']['fr'] ?? $mangaAttributes['description']['en'] ?? reset($mangaAttributes['description']) ?: '',
            author: $author ?? '',
            coverUrl: $coverUrl ?? '',
            genres: $genres,
            themes: $themes,
            numberOfVolumes: $mangaAttributes['lastVolume'],
            numberOfChapters: $mangaAttributes['lastChapter'],
            publicationStatus: MangaPublicationStatus::tryFrom($mangaAttributes['status'] ?? ''),
            publicationYear: $mangaAttributes['year'],
        );
    }

    private function resolveTagsByGroup(array $tags, string $group): array
    {
        $resolvedTags = [];

        foreach ($tags as $tag) {
            $tagGroup = $tag['attributes']['group'] ?? null;

            if ($tagGroup !== $group) {
                continue;
            }

            $name = $tag['attributes']['name']['en'] ?? null;

            if (is_string($name)) {
                $resolvedTags[] = $name;
            }
        }

        return $resolvedTags;
    }
}
