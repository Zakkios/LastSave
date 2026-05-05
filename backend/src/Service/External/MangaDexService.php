<?php

namespace App\Service\External;

use App\DTO\MangaCompleteDTO;
use App\DTO\MangaShortDTO;
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
        $mangaDTOs = [];
        $params = [
            'query' => [
                'title' => $query,
                'limit' => 5,
                'order[relevance]' => 'desc',
                'includes[]' => 'cover_art',
            ],
        ];
        $mangaData = $this->apiClient->get(self::BASE_URL, '/manga', $params);

        $mangaDTOs = $this->mangaMapper->fromCollection($mangaData);

        return $mangaDTOs;
    }

    public function getRandomManga(): MangaShortDTO
    {
        $mangaData = $this->apiClient->get(self::BASE_URL, '/manga/random');
        $mangaRelationships = $mangaData['data']['relationships'];

        $mangaId = $mangaData['data']['id'] ?? null;
        $coverId = array_values(array_filter(
            $mangaRelationships,
            fn($relation) => $relation['type'] === 'cover_art'
        ))[0]['id'] ?? null;
        $coverUrl = $this->getCoverUrl($coverId, $mangaId);

        $authorId = array_values(array_filter(
            $mangaRelationships,
            fn($relation) => $relation['type'] === 'author'
        ))[0]['id'] ?? null;
        $author = $this->getAuthorName($authorId);

        $mangaShortDTO = $this->mangaMapper->fromEntity($mangaData, $author, $coverUrl);

        return $mangaShortDTO;
    }

    public function getMangaById(string $id): MangaCompleteDTO
    {
        $mangaData = $this->apiClient->get(self::BASE_URL, "/manga/{$id}");
        $mangaRelationships = $mangaData['data']['relationships'];

        $mangaId = $mangaData['data']['id'] ?? null;
        $coverId = array_values(array_filter(
            $mangaRelationships,
            fn($relation) => $relation['type'] === 'cover_art'
        ))[0]['id'] ?? null;
        $coverUrl = $this->getCoverUrl($coverId, $mangaId);

        $authorId = array_values(array_filter(
            $mangaRelationships,
            fn($relation) => $relation['type'] === 'author'
        ))[0]['id'] ?? null;
        $author = $this->getAuthorName($authorId);

        $mangaCompleteDTO = $this->mangaCompleteMapper->fromEntity($mangaData, $author, $coverUrl);

        return $mangaCompleteDTO;
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
                'includes[]' => ['cover_art', 'author'],
            ],
        ]);

        $authors = [];
        $coverUrls = [];

        foreach ($mangaData['data'] as $manga) {
            $mangaId = $manga['id'] ?? null;
            $coverId = array_values(array_filter(
                $manga['relationships'],
                fn($relation) => $relation['type'] === 'cover_art'
            ))[0]['id'] ?? null;
            $coverUrl = $this->getCoverUrl($coverId, $mangaId);
            $coverUrls[] = $coverUrl;

            $authorId = array_values(array_filter(
                $manga['relationships'],
                fn($relation) => $relation['type'] === 'author'
            ))[0]['id'] ?? null;
            $author = $this->getAuthorName($authorId);
            $authors[] = $author;
        }

        $mangaDTOs = $this->mangaMapper->fromCollection($mangaData, $authors, $coverUrls);

        return $mangaDTOs;
    }

    public function getAuthorName(string $authorId): string
    {
        try {
            $authorData = $this->apiClient->get(self::BASE_URL, "/author/{$authorId}");
            $authorName = $authorData["data"]["attributes"]["name"];
        } catch (\Exception $e) {
            $authorName = '';
        }
        return $authorName ?? 'Auteur inconnu';
    }

    public function getCoverUrl(string $coverId, string $mangaId): string
    {
        try {
            $response = $this->apiClient->get(self::BASE_URL, "/cover/{$coverId}");
            $coverName = $response['data']['attributes']['fileName'];
            $coverUrl = $this::COVER_BASE_URL . '/' . $mangaId . '/' . $coverName . '.256.jpg';
        } catch (\Exception $e) {
            $coverUrl = '';
        }

        return $coverUrl;
    }
}
