<?php

namespace App\Service\External;

use App\DTO\MangaDTO;
use App\Mapper\MangaMapper;
use App\Service\Http\ApiClient;

class MangaDexService
{
    private const BASE_URL = 'https://api.mangadex.org';
    private const COVER_BASE_URL = 'https://uploads.mangadex.org/covers';

    public function __construct(
        private ApiClient $apiClient,
        private MangaMapper $mangaMapper
    ) {}

    public function getRandomManga(): MangaDTO
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

        $mangaDTO = $this->mangaMapper->fromEntity($mangaData, $author, $coverUrl);

        return $mangaDTO;
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
