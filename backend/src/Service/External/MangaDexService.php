<?php

namespace App\Service\External;

use App\DTO\MangaCompleteDTO;
use App\Mapper\MangaCompleteMapper;
use App\Mapper\MangaMapper;
use App\Service\Http\ApiClient;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class MangaDexService
{
    private const BASE_URL = 'https://api.mangadex.org';
    private const AUTOCOMPLETE_LIMIT = 8;
    private const PAGE_LIMIT = 20;

    public function __construct(
        private ApiClient $apiClient,
        private MangaMapper $mangaMapper,
        private MangaCompleteMapper $mangaCompleteMapper,
        private UrlGeneratorInterface $urlGenerator
    ) {}

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
     * @return MangaCompleteDTO[]
     */
    public function getMangasByIds(array $ids): array
    {
        if ($ids === []) {
            return [];
        }

        $mangaData = $this->apiClient->get(self::BASE_URL, '/manga', [
            'query' => [
                'ids' => $ids,
                'includes' => ['cover_art', 'author'],
            ],
        ]);

        $mangas = $mangaData['data'] ?? [];

        $mangaDTOs = [];

        foreach ($mangas as $manga) {
            $coverUrl = $this->getCoverUrlFromRelationship($manga);
            $author = $this->getAuthorNameFromRelationship($manga);

            $mangaDTOs[] = $this->mangaCompleteMapper->fromEntity(
                ['data' => $manga],
                $author,
                $coverUrl
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
            UrlGeneratorInterface::ABSOLUTE_URL
        );
    }

    private function getAuthorNameFromRelationship(array $manga): string
    {
        $relationships = $manga['relationships'] ?? [];
        $authorRelation = $this->getRelationshipByType($relationships, 'author');
        return $authorRelation['attributes']['name'] ?? 'Auteur inconnu';
    }
}
