<?php

namespace App\Service\External;

use App\Service\Http\ApiClient;

class GameService
{
    private const BASE_URL = 'https://api.igdb.com/v4';

    public function __construct(
        private ApiClient $apiClient,
        private IgdbAuthService $igdbAuthService,
        private string $igdbClientId,
    ) {}

    public function getRandomGame(): array
    {
        $randomOffset = random_int(0, 5000);
        $accessToken = $this->igdbAuthService->getAccessToken();

        $query = "
            fields name, summary, cover.image_id, platforms, rating;
            where platforms = 6 
            & cover != null 
            & rating != null
            & version_parent = null;
            sort rating desc;
            limit 1;
            offset {$randomOffset};
        ";

        $response = $this->apiClient->post(
            self::BASE_URL,
            '/games',
            [
                'headers' => [
                    'Client-ID' => $this->igdbClientId,
                    'Authorization' => 'Bearer ' . $accessToken,
                    'Accept' => 'application/json',
                ],
                'body' => $query,
            ]
        );

        return $response[0] ?? [];
    }
}
