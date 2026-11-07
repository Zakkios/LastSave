<?php

namespace App\Service\Library;

use App\DTO\UserGameEntryAwareDTO;
use App\Entity\GameEntry;
use App\Entity\User;
use App\Enum\GameStatus;
use App\Repository\GameEntryRepository;
use Doctrine\ORM\EntityManagerInterface;

class GameEntryService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly GameEntryRepository $gameEntryRepository,
    ) {}

    public function createNewGameEntry(User $user, int $providerId, string $status): GameEntry
    {
        if ($this->findUserEntryForGame($user, $providerId)) {
            throw new \DomainException('Game entry already exists');
        }

        $gameEntry = new GameEntry();
        $gameEntry->setProviderId($providerId);
        $gameEntry->setStatus($this->resolveStatus($status));
        $gameEntry->setOwner($user);

        $this->entityManager->persist($gameEntry);
        $this->entityManager->flush();

        return $gameEntry;
    }

    public function updateGameEntry(GameEntry $gameEntry, string $status): GameEntry
    {
        $gameEntry->setStatus($this->resolveStatus($status));
        $gameEntry->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->flush();

        return $gameEntry;
    }

    public function enrichGameWithUserEntry(
        UserGameEntryAwareDTO $game,
        ?GameEntry $gameEntry
    ): UserGameEntryAwareDTO {
        $status = $gameEntry?->getStatus();

        if ($status) {
            $game->markAsInLibrary($status->value, $status->label());
        }

        return $game;
    }

    /**
     * @param int[] $providerIds
     *
     * @return array<int, GameEntry> indexed by IGDB id
     */
    public function findUserEntriesIndexedByProviderId(User $user, array $providerIds): array
    {
        $indexedEntries = [];

        foreach ($this->gameEntryRepository->findByOwnerAndProviderIds($user, $providerIds) as $entry) {
            $indexedEntries[$entry->getProviderId()] = $entry;
        }

        return $indexedEntries;
    }

    public function findUserEntryForGame(User $user, int $providerId): ?GameEntry
    {
        return $this->gameEntryRepository->findOneByOwnerAndProviderId($user, $providerId);
    }

    /**
     * @return GameEntry[]
     */
    public function findUserGameEntries(User $user, int $page, ?GameStatus $status = null): array
    {
        return $this->gameEntryRepository->findByOwnerPaginated($user, $page, $status);
    }

    /**
     * @return int[] IGDB ids of every game in the user's library
     */
    public function findUserGameIds(User $user): array
    {
        return $this->gameEntryRepository->findProviderIdsByOwner($user);
    }

    private function resolveStatus(string $status): GameStatus
    {
        return GameStatus::tryFrom($status)
            ?? throw new \InvalidArgumentException('Invalid game status');
    }
}
