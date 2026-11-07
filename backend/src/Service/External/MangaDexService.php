<?php

namespace App\Service\External;

use App\DTO\MangaCompleteDTO;
use App\Mapper\MangaCompleteMapper;
use App\Mapper\MangaMapper;
use App\Service\Http\ApiClient;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\HttpClient\Exception\ExceptionInterface as HttpExceptionInterface;

class MangaDexService
{
    private const BASE_URL = 'https://api.mangadex.org';
    private const AUTOCOMPLETE_LIMIT = 8;
    private const PAGE_LIMIT = 20;
    // Most ids MangaDex accepts in a single /manga request.
    private const IDS_LIMIT = 100;

    // Latest French chapter: kept 6 hours, enough for "new chapters" without hitting MangaDex on every page.
    private const LATEST_CHAPTER_CACHE_TTL = 6 * 3600;
    // Pause before each uncached request of a batch: MangaDex allows about 5 requests per second.
    private const RATE_LIMIT_PAUSE_MICROSECONDS = 200_000;

    public function __construct(
        private ApiClient $apiClient,
        private MangaMapper $mangaMapper,
        private MangaCompleteMapper $mangaCompleteMapper,
        private UrlGeneratorInterface $urlGenerator,
        private CacheInterface $cache,
    ) {}

    /**
     * Highest chapter number published in French on MangaDex, null when there is none
     * (or when MangaDex cannot be reached: "new chapters" are a bonus, never an error).
     */
    public function getLatestFrenchChapter(string $mangaId): ?float
    {
        try {
            return $this->cache->get(
                'mangadex.latest_french_chapter.' . $mangaId,
                function (ItemInterface $item) use ($mangaId): ?float {
                    $item->expiresAfter(self::LATEST_CHAPTER_CACHE_TTL);
                    usleep(self::RATE_LIMIT_PAUSE_MICROSECONDS);

                    $aggregate = $this->apiClient->get(self::BASE_URL, "/manga/{$mangaId}/aggregate", [
                        'query' => ['translatedLanguage' => ['fr']],
                    ]);

                    $latest = null;

                    foreach ($aggregate['volumes'] ?? [] as $volume) {
                        foreach ($volume['chapters'] ?? [] as $chapter) {
                            $number = $chapter['chapter'] ?? null;

                            if (is_numeric($number) && ($latest === null || (float) $number > $latest)) {
                                $latest = (float) $number;
                            }
                        }
                    }

                    return $latest;
                }
            );
        } catch (HttpExceptionInterface) {
            return null;
        }
    }

    public function getMangaForAutocomplete(string $query, string $page): array
    {
        $offset = $page * self::AUTOCOMPLETE_LIMIT;

        $params = [
            'query' => [
                'title' => $query,
                'limit' => self::AUTOCOMPLETE_LIMIT,
                'offset' => $offset,
                'includes' => ['cover_art', 'author'],
                'order[relevance]' => 'desc',
            ],
        ];
        $mangaData = $this->apiClient->get(self::BASE_URL, '/manga', $params);

        $authors = [];
        $coverUrls = [];

        foreach ($mangaData['data'] ?? [] as $manga) {
            $authors[] = $this->getAuthorNameFromRelationship($manga);
            $coverUrls[] = $this->getCoverUrlFromRelationship($manga);
        }

        return $this->mangaMapper->fromCollection($mangaData, $authors, $coverUrls);
    }

    public function getMangaById(string $id): MangaCompleteDTO
    {
        $mangaData = $this->apiClient->get(self::BASE_URL, "/manga/{$id}", [
            'query' => [
                'includes' => ['cover_art', 'author'],
            ],
        ]);

        $manga = $mangaData['data'] ?? [];

        $coverUrl = $this->getCoverUrlFromRelationship($manga);
        $author = $this->getAuthorNameFromRelationship($manga);

        return $this->mangaCompleteMapper->fromEntity($mangaData, $author, $coverUrl);
    }

    /**
     * @param string[] $ids
     *
     * @return MangaCompleteDTO[] in the same order as $ids (unknown ids are skipped)
     */
    public function getMangasByIds(array $ids): array
    {
        $ids = array_values(array_unique($ids));

        if ($ids === []) {
            return [];
        }

        // Without an explicit limit, MangaDex returns only 10 mangas (maximum: 100).
        $mangaData = $this->apiClient->get(self::BASE_URL, '/manga', [
            'query' => [
                'ids' => $ids,
                'limit' => min(count($ids), self::IDS_LIMIT),
                'includes' => ['cover_art', 'author'],
            ],
        ]);

        $mangasById = array_column($mangaData['data'] ?? [], null, 'id');

        // MangaDex uses its own order: put the mangas back in the requested order.
        $mangaDTOs = [];

        foreach ($ids as $id) {
            if (!isset($mangasById[$id])) {
                continue;
            }

            $manga = $mangasById[$id];

            $mangaDTOs[] = $this->mangaCompleteMapper->fromEntity(
                ['data' => $manga],
                $this->getAuthorNameFromRelationship($manga),
                $this->getCoverUrlFromRelationship($manga)
            );
        }

        return $mangaDTOs;
    }

    public function getMangaByPage(int $page): array
    {
        $offset = $page * self::PAGE_LIMIT;

        $mangaData = $this->apiClient->get(self::BASE_URL, '/manga', [
            'query' => [
                'offset' => $offset,
                'limit' => self::PAGE_LIMIT,
                'order[followedCount]' => 'desc',
                'includes' => ['cover_art', 'author'],
            ],
        ]);

        $authors = [];
        $coverUrls = [];

        foreach ($mangaData['data'] ?? [] as $manga) {
            $authors[] = $this->getAuthorNameFromRelationship($manga);
            $coverUrls[] = $this->getCoverUrlFromRelationship($manga);
        }

        return $this->mangaMapper->fromCollection($mangaData, $authors, $coverUrls);
    }

    private function getRelationshipByType(array $relationships, string $type): ?array
    {
        foreach ($relationships as $relationship) {
            if (($relationship['type'] ?? '') === $type) {
                return $relationship;
            }
        }
        return null;
    }

    private function getCoverUrlFromRelationship(array $manga): string
    {
        $mangaId = $manga['id'] ?? '';
        $relationships = $manga['relationships'] ?? [];
        $coverRelation = $this->getRelationshipByType($relationships, 'cover_art');
        $fileName = $coverRelation['attributes']['fileName'] ?? null;

        if (!$fileName || !$mangaId) {
            return '';
        }

        return $this->urlGenerator->generate(
            'app_manga_cover_proxy',
            [
                'mangaId'  => $mangaId,
                'fileName' => $fileName . '.256.jpg',
            ],
            UrlGeneratorInterface::ABSOLUTE_PATH
        );
    }

    private function getAuthorNameFromRelationship(array $manga): string
    {
        $relationships = $manga['relationships'] ?? [];
        $authorRelation = $this->getRelationshipByType($relationships, 'author');
        return $authorRelation['attributes']['name'] ?? 'Auteur inconnu';
    }
}
