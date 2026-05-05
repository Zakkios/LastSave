<?php

namespace App\Service\External;

use App\DTO\MangaCompleteDTO;
use App\Mapper\MangaCompleteMapper;
use App\Mapper\MangaMapper;
use App\Service\Http\ApiClient;

class MangaDexService
{
    private const BASE_URL = 'https://api.mangadex.org';
    private const COVER_BASE_URL = 'https://uploads.mangadex.org/covers';

    public function __construct(
        private ApiClient $apiClient,
        private MangaMapper $mangaMapper,
        private MangaCompleteMapper $mangaCompleteMapper
    ) {}

    public function getMangaForAutocomplete(string $query): array
    {
        $params = [
            'query' => [
                'title' => $query,
                'limit' => 5,
                'order[relevance]' => 'desc',
            ],
        ];
        $mangaData = $this->apiClient->get(self::BASE_URL, '/manga', $params);

        foreach ($mangaData['data'] ?? [] as $manga) {
            $authors[] = $this->getAuthorNameFromRelationship($manga);
            $coverUrls[] = $this->getCoverUrlFromRelationship($manga);
        }

        return $this->mangaMapper->fromCollection($mangaData);
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

    public function getMangaByPage(int $page): array
    {
        $limit = 20;
        $offset = $page * $limit;

        $mangaData = $this->apiClient->get(self::BASE_URL, '/manga', [
            'query' => [
                'offset' => $offset,
                'limit' => $limit,
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

        return $fileName ? self::COVER_BASE_URL . '/' . $mangaId . '/' . $fileName . '.256.jpg' : '';
    }

    private function getAuthorNameFromRelationship(array $manga): string
    {
        $relationships = $manga['relationships'] ?? [];
        $authorRelation = $this->getRelationshipByType($relationships, 'author');
        return $authorRelation['attributes']['name'] ?? 'Auteur inconnu';
    }
}
