<?php

namespace App\Service\Library;

use App\DTO\MangaCompleteDTO;
use App\Entity\User;
use App\Enum\MangaReadingStatus;
use App\Enum\ProgressUnit;
use App\Service\External\MangaDexService;
use Symfony\Component\Uid\Uuid;

class MangaLibraryQueryService
{
    public function __construct(
        private readonly MangaDexService $mangaDexService,
        private readonly MangaEntryService $mangaEntryService,
    ) {}

    // At most this many mangas per request for French chapters (one MangaDex request each when not cached).
    private const LATEST_CHAPTERS_MAX_IDS = 12;
    // Finished mangas checked for a new chapter, most recently changed first.
    private const RESUMABLE_CANDIDATES = 10;

    public function getMangaByIdForUser(Uuid $mangaId, User $user): MangaCompleteDTO
    {
        $manga = $this->mangaDexService->getMangaById($mangaId->toRfc4122());

        $mangaEntry = $this->mangaEntryService->findUserEntryForManga(
            $user,
            $mangaId
        );

        $this->mangaEntryService->enrichMangaWithUserEntry($manga, $mangaEntry);

        // New chapters are only followed for mangas read by chapter.
        if ($mangaEntry?->getProgressUnit() === ProgressUnit::chapter) {
            $manga->latestFrenchChapter = $this->mangaDexService->getLatestFrenchChapter($manga->id);
        }

        return $manga;
    }

    /**
     * Latest French chapter of each requested manga of the user's library followed by chapter
     * (other ids are ignored), for the "N new" badges.
     *
     * @param Uuid[] $mangaIds
     *
     * @return array<string, float|null> indexed by MangaDex id
     */
    public function getLatestFrenchChaptersForUser(User $user, array $mangaIds): array
    {
        $entries = $this->mangaEntryService->findUserEntriesIndexedByProviderId(
            $user,
            array_slice($mangaIds, 0, self::LATEST_CHAPTERS_MAX_IDS)
        );

        $latestChapters = [];

        foreach ($entries as $providerId => $entry) {
            if ($entry->getProgressUnit() === ProgressUnit::chapter) {
                $latestChapters[$providerId] = $this->mangaDexService->getLatestFrenchChapter($providerId);
            }
        }

        return $latestChapters;
    }

    /**
     * Mangas the user marked "completed" while the series still goes on, with a French chapter
     * published after their last chapter read: the home page offers to put them back "reading".
     *
     * @return MangaCompleteDTO[]
     */
    public function getResumableMangasForUser(User $user): array
    {
        $entriesById = [];

        foreach ($this->mangaEntryService->findUserFinishedMangasFollowedByChapter($user, self::RESUMABLE_CANDIDATES) as $entry) {
            $entriesById[$entry->getProviderId()->toRfc4122()] = $entry;
        }

        if ($entriesById === []) {
            return [];
        }

        $resumable = [];

        foreach ($this->mangaDexService->getMangasByIds(array_keys($entriesById)) as $manga) {
            // A series that is over will not get new chapters: no request needed.
            if ($manga->isSeriesCompleted) {
                continue;
            }

            $entry = $entriesById[$manga->id];
            $latest = $this->mangaDexService->getLatestFrenchChapter($manga->id);

            if ($latest !== null && $latest > ($entry->getLastReadChapter() ?? 0)) {
                $this->mangaEntryService->enrichMangaWithUserEntry($manga, $entry);
                $manga->latestFrenchChapter = $latest;
                $resumable[] = $manga;
            }
        }

        return $resumable;
    }

    public function getMangaPageForUser(int $page, User $user): array
    {
        $mangas = $this->mangaDexService->getMangaByPage($page);

        return $this->enrichMangaCollectionForUser($mangas, $user);
    }

    public function getMangaAutocompleteForUser(
        string $query,
        int $page,
        User $user
    ): array {
        $mangas = $this->mangaDexService->getMangaForAutocomplete($query, (string) $page);

        return $this->enrichMangaCollectionForUser($mangas, $user);
    }

    /**
     * @return MangaCompleteDTO[] most recently added first
     */
    public function getMangaLibraryForUser(User $user, int $page, ?MangaReadingStatus $status = null): array
    {
        $mangaEntries = $this->mangaEntryService->findUserMangaEntries($user, $page, $status);

        $providerIds = [];

        foreach ($mangaEntries as $mangaEntry) {
            $providerIds[] = $mangaEntry->getProviderId()->toRfc4122();
        }

        if ($providerIds === []) {
            return [];
        }

        $mangas = $this->mangaDexService->getMangasByIds($providerIds);

        return $this->enrichMangaCollectionForUser($mangas, $user);
    }

    private function enrichMangaCollectionForUser(array $mangas, User $user): array
    {
        $providerIds = $this->extractValidProviderIds($mangas);

        $mangaEntriesByProviderId = $this->mangaEntryService
            ->findUserEntriesIndexedByProviderId($user, $providerIds);

        foreach ($mangas as $manga) {
            $mangaEntry = $mangaEntriesByProviderId[$manga->id] ?? null;

            $this->mangaEntryService->enrichMangaWithUserEntry(
                $manga,
                $mangaEntry
            );
        }

        return $mangas;
    }

    private function extractValidProviderIds(array $mangas): array
    {
        $providerIds = [];

        foreach ($mangas as $manga) {
            try {
                $providerIds[] = Uuid::fromString($manga->id);
            } catch (\InvalidArgumentException) {
                continue;
            }
        }

        return $providerIds;
    }
}
