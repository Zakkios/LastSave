<?php

namespace App\Service\Library;

use App\DTO\GameCompleteDTO;
use App\DTO\GameShortDTO;
use App\Entity\User;
use App\Enum\GameStatus;
use App\Service\External\GameService;

/**
 * Combines IGDB data with the user's entries (is the game in their library, with which status).
 */
class GameLibraryQueryService
{
    public function __construct(
        private readonly GameService $gameService,
        private readonly GameEntryService $gameEntryService,
    ) {}

    public function getGameByIdForUser(int $gameId, User $user): ?GameCompleteDTO
    {
        $game = $this->gameService->getGameById($gameId);

        if (!$game) {
            return null;
        }

        $this->gameEntryService->enrichGameWithUserEntry(
            $game,
            $this->gameEntryService->findUserEntryForGame($user, $gameId)
        );

        return $game;
    }

    /**
     * @return GameShortDTO[]
     */
    public function getGameSearchForUser(string $query, int $page, User $user): array
    {
        return $this->enrichGameCollectionForUser(
            $this->gameService->searchGames($query, $page),
            $user
        );
    }

    /**
     * @return GameShortDTO[] most recently added first
     */
    public function getGameLibraryForUser(User $user, int $page, ?GameStatus $status = null): array
    {
        $providerIds = array_map(
            fn ($entry) => $entry->getProviderId(),
            $this->gameEntryService->findUserGameEntries($user, $page, $status)
        );

        return $this->enrichGameCollectionForUser(
            $this->gameService->getGamesByIds($providerIds),
            $user
        );
    }

    /**
     * @return GameShortDTO[] games of the user's library that are not released yet, soonest first
     */
    public function getUpcomingGamesForUser(User $user): array
    {
        return $this->enrichGameCollectionForUser(
            $this->gameService->getUpcomingGames($this->gameEntryService->findUserGameIds($user)),
            $user
        );
    }

    /**
     * @param GameShortDTO[] $games
     *
     * @return GameShortDTO[]
     */
    private function enrichGameCollectionForUser(array $games, User $user): array
    {
        $entriesByProviderId = $this->gameEntryService->findUserEntriesIndexedByProviderId(
            $user,
            array_map(fn (GameShortDTO $game) => $game->id, $games)
        );

        foreach ($games as $game) {
            $this->gameEntryService->enrichGameWithUserEntry(
                $game,
                $entriesByProviderId[$game->id] ?? null
            );
        }

        return $games;
    }
}
