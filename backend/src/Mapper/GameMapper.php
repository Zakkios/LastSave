<?php

namespace App\Mapper;

use App\DTO\GameCompleteDTO;
use App\DTO\GameShortDTO;

/**
 * Raw IGDB game (array decoded from the API) -> DTO sent to the front.
 */
class GameMapper
{
    // Public IGDB image CDN: no proxy needed (unlike MangaDex covers).
    private const COVER_URL = 'https://images.igdb.com/igdb/image/upload/t_cover_big/%s.jpg';

    public function toShortDTO(array $game): GameShortDTO
    {
        return new GameShortDTO(
            id: (int) $game['id'],
            title: (string) ($game['name'] ?? ''),
            developer: $this->resolveDeveloper($game),
            coverUrl: $this->resolveCoverUrl($game),
            rating: $this->resolveRating($game),
            platforms: $this->resolvePlatforms($game),
        );
    }

    public function toCompleteDTO(array $game): GameCompleteDTO
    {
        return new GameCompleteDTO(
            id: (int) $game['id'],
            title: (string) ($game['name'] ?? ''),
            developer: $this->resolveDeveloper($game),
            coverUrl: $this->resolveCoverUrl($game),
            rating: $this->resolveRating($game),
            platforms: $this->resolvePlatforms($game),
            summary: isset($game['summary']) ? trim((string) $game['summary']) : null,
            releaseYear: isset($game['first_release_date'])
                ? gmdate('Y', (int) $game['first_release_date'])
                : null,
            genres: $this->resolveNames($game['genres'] ?? []),
            themes: $this->resolveNames($game['themes'] ?? []),
        );
    }

    private function resolveDeveloper(array $game): ?string
    {
        foreach ($game['involved_companies'] ?? [] as $involvedCompany) {
            if (($involvedCompany['developer'] ?? false) && isset($involvedCompany['company']['name'])) {
                return (string) $involvedCompany['company']['name'];
            }
        }

        return null;
    }

    private function resolveCoverUrl(array $game): ?string
    {
        $imageId = $game['cover']['image_id'] ?? null;

        return is_string($imageId) && $imageId !== ''
            ? sprintf(self::COVER_URL, $imageId)
            : null;
    }

    // IGDB total_rating: critics + users, from 0 to 100.
    private function resolveRating(array $game): ?int
    {
        return isset($game['total_rating']) ? (int) round((float) $game['total_rating']) : null;
    }

    /**
     * @return string[]
     */
    private function resolvePlatforms(array $game): array
    {
        $platforms = [];

        foreach ($game['platforms'] ?? [] as $platform) {
            $name = $platform['abbreviation'] ?? $platform['name'] ?? null;

            if (is_string($name) && $name !== '') {
                $platforms[] = $name;
            }
        }

        return $platforms;
    }

    /**
     * @return string[]
     */
    private function resolveNames(array $items): array
    {
        $names = [];

        foreach ($items as $item) {
            if (is_string($item['name'] ?? null)) {
                $names[] = $item['name'];
            }
        }

        return $names;
    }
}
