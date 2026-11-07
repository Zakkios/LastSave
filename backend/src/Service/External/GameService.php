<?php

namespace App\Service\External;

use App\Service\Http\ApiClient;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;

class GameService
{
    private const BASE_URL = 'https://api.igdb.com/v4';

    public function __construct(
        private readonly ApiClient $apiClient,
        private readonly IgdbAuthService $igdbAuthService,
        private readonly string $igdbClientId,
    ) {}

    public function getRandomGame(): array
    {
        $randomOffset = random_int(0, 5000);

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

        $response = $this->requestIgdb('/games', $query);

        return $response[0] ?? [];
    }

    /**
     * Sends an Apicalypse query to IGDB. If Twitch revoked the cached token
     * before its expiry, IGDB answers 401: get a fresh token and retry once.
     */
    private function requestIgdb(string $endpoint, string $query): array
    {
        try {
            return $this->postToIgdb($endpoint, $query, $this->igdbAuthService->getAccessToken());
        } catch (ClientExceptionInterface $e) {
            if ($e->getResponse()->getStatusCode() !== 401) {
                throw $e;
            }

            $this->igdbAuthService->invalidateAccessToken();

            return $this->postToIgdb($endpoint, $query, $this->igdbAuthService->getAccessToken());
        }
    }

    private function postToIgdb(string $endpoint, string $query, string $accessToken): array
    {
        return $this->apiClient->post(
            self::BASE_URL,
            $endpoint,
            [
                'headers' => [
                    'Client-ID' => $this->igdbClientId,
                    'Authorization' => 'Bearer ' . $accessToken,
                    'Accept' => 'application/json',
                ],
                'body' => $query,
            ]
        );
    }
}
