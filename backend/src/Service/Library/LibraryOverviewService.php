<?php

namespace App\Service\Library;

use App\DTO\RecentEntryDTO;
use App\Entity\GameEntry;
use App\Entity\MangaEntry;
use App\Entity\User;
use App\Enum\GameStatus;
use App\Enum\MangaReadingStatus;
use App\Repository\GameEntryRepository;
use App\Repository\MangaEntryRepository;
use App\Service\External\GameService;
use App\Service\External\MangaDexService;

/**
 * Whole-library views for the home page: numbers per status, latest changes (mangas and games mixed).
 */
class LibraryOverviewService
{
    private const RECENT_LIMIT = 6;

    public function __construct(
        private readonly MangaEntryRepository $mangaEntryRepository,
        private readonly GameEntryRepository $gameEntryRepository,
        private readonly MangaDexService $mangaDexService,
        private readonly GameService $gameService,
    ) {}

    /**
     * Counted in the database only: no call to MangaDex or IGDB.
     *
     * @return array{
     *     mangas: array{total: int, byStatus: array<string, int>},
     *     games: array{total: int, byStatus: array<string, int>}
     * }
     */
    public function getStatsForUser(User $user): array
    {
        return [
            'mangas' => $this->summarize(
                MangaReadingStatus::cases(),
                $this->mangaEntryRepository->countByStatusForOwner($user)
            ),
            'games' => $this->summarize(
                GameStatus::cases(),
                $this->gameEntryRepository->countByStatusForOwner($user)
            ),
        ];
    }

    /**
     * @return RecentEntryDTO[] most recent change first
     */
    public function getRecentEntriesForUser(User $user): array
    {
        /** @var list<MangaEntry|GameEntry> $entries */
        $entries = [
            ...$this->mangaEntryRepository->findRecentlyUpdatedByOwner($user, self::RECENT_LIMIT),
            ...$this->gameEntryRepository->findRecentlyUpdatedByOwner($user, self::RECENT_LIMIT),
        ];

        usort($entries, fn (MangaEntry|GameEntry $a, MangaEntry|GameEntry $b) => $b->getUpdatedAt() <=> $a->getUpdatedAt());
        $entries = array_slice($entries, 0, self::RECENT_LIMIT);

        // Titles and covers come from the providers: one request each, for the kept entries only.
        $mangaIds = [];
        $gameIds = [];

        foreach ($entries as $entry) {
            if ($entry instanceof MangaEntry) {
                $mangaIds[] = $entry->getProviderId()->toRfc4122();
            } else {
                $gameIds[] = $entry->getProviderId();
            }
        }

        $mangasById = array_column($this->mangaDexService->getMangasByIds($mangaIds), null, 'id');
        $gamesById = array_column($this->gameService->getGamesByIds($gameIds), null, 'id');

        $recentEntries = [];

        foreach ($entries as $entry) {
            $isManga = $entry instanceof MangaEntry;
            $work = $isManga
                ? ($mangasById[$entry->getProviderId()->toRfc4122()] ?? null)
                : ($gamesById[$entry->getProviderId()] ?? null);
            $status = $entry->getStatus();

            // Work no longer known by its provider: nothing to display.
            if (!$work || !$status) {
                continue;
            }

            $recentEntries[] = new RecentEntryDTO(
                type: $isManga ? 'manga' : 'game',
                id: $work->id,
                title: $work->title,
                coverUrl: $work->coverUrl ?: null,
                status: $status->value,
                statusLabel: $status->label(),
                action: $this->wasUpdatedAfterCreation($entry) ? 'updated' : 'added',
                updatedAt: $entry->getUpdatedAt()->format(\DATE_ATOM),
            );
        }

        return $recentEntries;
    }

    /**
     * @param list<MangaReadingStatus>|list<GameStatus> $statuses
     * @param array<string, int> $counts
     *
     * @return array{total: int, byStatus: array<string, int>} every status listed, 0 when unused
     */
    private function summarize(array $statuses, array $counts): array
    {
        $byStatus = [];

        foreach ($statuses as $status) {
            $byStatus[$status->value] = $counts[$status->value] ?? 0;
        }

        return ['total' => array_sum($byStatus), 'byStatus' => $byStatus];
    }

    // createdAt and updatedAt are both set when the entry is created, a few microseconds apart.
    private function wasUpdatedAfterCreation(MangaEntry|GameEntry $entry): bool
    {
        return $entry->getUpdatedAt()->getTimestamp() - $entry->getCreatedAt()->getTimestamp() > 1;
    }
}
