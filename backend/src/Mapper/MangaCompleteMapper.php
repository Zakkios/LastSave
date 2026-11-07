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
        // MangaDex fills lastChapter / lastVolume with the series' end once it is over.
        $isSeriesCompleted = ($mangaAttributes['status'] ?? null) === MangaPublicationStatus::completed->value;
        $finalVolume = $this->toNumber($mangaAttributes['lastVolume'] ?? null);

        return new MangaCompleteDTO(
            id: $mangaData['data']['id'],
            title: $this->mangaTitleResolver->resolveTitle($mangaAttributes),
            description: $this->cleanDescription(
                $mangaAttributes['description']['fr']
                    ?? $mangaAttributes['description']['en']
                    ?? null
            ),
            author: $author ?? '',
            coverUrl: $coverUrl ?? '',
            genres: $genres,
            themes: $themes,
            numberOfVolumes: $this->resolveMangaCount($mangaAttributes['lastVolume'] ?? null),
            numberOfChapters: $this->resolveMangaCount($mangaAttributes['lastChapter'] ?? null),
            publicationStatus: $this->resolvePublicationStatus($mangaAttributes['status'] ?? null),
            publicationYear: isset($mangaAttributes['year'])
                ? (string) $mangaAttributes['year']
                : 'Inconnu',
            isSeriesCompleted: $isSeriesCompleted,
            finalChapter: $isSeriesCompleted ? $this->toNumber($mangaAttributes['lastChapter'] ?? null) : null,
            finalVolume: $isSeriesCompleted && $finalVolume !== null ? (int) $finalVolume : null,
        );
    }

    // "232" or "12.5" -> number; empty or not a number -> null.
    private function toNumber(?string $value): ?float
    {
        $value = trim((string) $value);

        return is_numeric($value) ? (float) $value : null;
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

    private function cleanDescription(?string $description): string
    {
        if (!$description) {
            return 'Aucune description disponible.';
        }

        $parts = explode('---', $description);

        return trim($parts[0]);
    }

    private function resolvePublicationStatus(?string $status): string
    {
        return $status
            ? MangaPublicationStatus::tryFrom($status)?->label() ?? 'Inconnu'
            : 'Inconnu';
    }

    private function resolveMangaCount(?string $value): string
    {
        return trim((string) $value) !== ''
            ? $value
            : 'Inconnu';
    }
}
