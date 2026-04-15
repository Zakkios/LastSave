<?php

namespace App\Service\External;

use App\Service\Http\ApiClient;

class IgdbAuthService
{
    private const TWITCH_AUTH_URL = 'https://id.twitch.tv';

    public function __construct(
        private ApiClient $apiClient,
        private string $igdbClientId,
        private string $igdbClientSecret,
    ) {}

    public function getAccessToken(): string
    {
        $response = $this->apiClient->post(self::TWITCH_AUTH_URL, '/oauth2/token', [
            'headers' => [
                'Content-Type' => 'application/x-www-form-urlencoded',
            ],
            'query' => [
                'client_id' => $this->igdbClientId,
                'client_secret' => $this->igdbClientSecret,
                'grant_type' => 'client_credentials',
            ],
        ]);

        return $response['access_token'];
    }
}
