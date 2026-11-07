<?php

namespace App\Service\External;

use App\DTO\GameCompleteDTO;
use App\DTO\GameShortDTO;
use App\Mapper\GameMapper;
use App\Service\Http\ApiClient;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;

/**
 * IGDB client (games database owned by Twitch).
 */
class GameService
{
    private const BASE_URL = 'https://api.igdb.com/v4';
    private const SEARCH_LIMIT = 8;
    private const SEARCH_MAX_LENGTH = 100;

    // Kept: main games (0), expansions (2), standalone expansions (4), remakes (8),
    // remasters (9), expanded games (10). Left out: DLCs, bundles, mods, episodes,
    // seasons, ports, forks, packs and updates.
    private const GAME_TYPES = '(0,2,4,8,9,10)';

    private const SHORT_FIELDS = 'name, cover.image_id, total_rating, platforms.name, '
        . 'platforms.abbreviation, involved_companies.company.name, involved_companies.developer';
    private const COMPLETE_FIELDS = self::SHORT_FIELDS . ', summary, first_release_date, genres.name, themes.name';

    public function __construct(
        private readonly ApiClient $apiClient,
        private readonly IgdbAuthService $igdbAuthService,
        private readonly GameMapper $gameMapper,
        private readonly string $igdbClientId,
    ) {}

    /**
     * @return GameShortDTO[]
     */
    public function searchGames(string $query, int $page): array
    {
        $term = $this->sanitizeSearchTerm($query);

        if ($term === '') {
            return [];
        }

        $games = $this->requestIgdb('/games', sprintf(
            'search "%s"; fields %s; where version_parent = null & game_type = %s; limit %d; offset %d;',
            $term,
            self::SHORT_FIELDS,
            self::GAME_TYPES,
            self::SEARCH_LIMIT,
            max(0, $page) * self::SEARCH_LIMIT
        ));

        return array_map(fn (array $game) => $this->gameMapper->toShortDTO($game), $games);
    }

    public function getGameById(int $id): ?GameCompleteDTO
    {
        $games = $this->requestIgdb('/games', sprintf('fields %s; where id = %d;', self::COMPLETE_FIELDS, $id));

        return isset($games[0]) ? $this->gameMapper->toCompleteDTO($games[0]) : null;
    }

    /**
     * @param int[] $ids
     *
     * @return GameShortDTO[] in the same order as $ids (unknown ids are skipped)
     */
    public function getGamesByIds(array $ids): array
    {
        $ids = array_values(array_unique(array_map('intval', $ids)));

        if ($ids === []) {
            return [];
        }

        $games = $this->requestIgdb('/games', sprintf(
            'fields %s; where id = (%s); limit %d;',
            self::SHORT_FIELDS,
            implode(',', $ids),
            count($ids)
        ));

        // IGDB returns the games sorted by id: put them back in the requested order.
        $gamesById = array_column($games, null, 'id');
        $dtos = [];

        foreach ($ids as $id) {
            if (isset($gamesById[$id])) {
                $dtos[] = $this->gameMapper->toShortDTO($gamesById[$id]);
            }
        }

        return $dtos;
    }

    /**
     * Apicalypse strings cannot escape quotes: a `"` in the term ends the search
     * string and IGDB rejects the query. Such characters are removed.
     */
    private function sanitizeSearchTerm(string $query): string
    {
        $term = preg_replace('/["\\\\\x00-\x1F\x7F]/u', ' ', $query) ?? '';

        return trim(mb_substr($term, 0, self::SEARCH_MAX_LENGTH));
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
