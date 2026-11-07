<?php

namespace App\Service\External;

use App\Service\Http\ApiClient;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

/**
 * App access token for IGDB, obtained from Twitch (OAuth "client credentials").
 *
 * Twitch tokens last about 60 days: the token is kept in the app cache and only
 * renewed shortly before it expires, instead of on every IGDB request.
 */
class IgdbAuthService
{
    private const TWITCH_AUTH_URL = 'https://id.twitch.tv';
    private const CACHE_KEY = 'igdb.access_token';
    // Renew the token this long before Twitch expires it.
    private const EXPIRY_MARGIN_SECONDS = 3600;

    public function __construct(
        private readonly ApiClient $apiClient,
        private readonly CacheInterface $cache,
        private readonly string $igdbClientId,
        private readonly string $igdbClientSecret,
    ) {}

    public function getAccessToken(): string
    {
        return $this->cache->get(self::CACHE_KEY, function (ItemInterface $item): string {
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

            $expiresIn = (int) ($response['expires_in'] ?? 0);
            $item->expiresAfter(max(60, $expiresIn - self::EXPIRY_MARGIN_SECONDS));

            return $response['access_token'];
        });
    }

    /**
     * Forgets the cached token, e.g. when Twitch revoked it before its expiry.
     */
    public function invalidateAccessToken(): void
    {
        $this->cache->delete(self::CACHE_KEY);
    }
}
