<?php

namespace App\Service\Library;

use App\DTO\MangaCompleteDTO;
use App\Entity\User;
use App\Service\External\MangaDexService;
use Symfony\Component\Uid\Uuid;

class MangaLibraryQueryService
{
    public function __construct(
        private readonly MangaDexService $mangaDexService,
        private readonly MangaEntryService $mangaEntryService,
    ) {}

    public function getMangaByIdForUser(Uuid $mangaId, User $user): MangaCompleteDTO
    {
        $manga = $this->mangaDexService->getMangaById($mangaId->toRfc4122());

        $mangaEntry = $this->mangaEntryService->findUserEntryForManga(
            $user,
            $mangaId
        );

        return $this->mangaEntryService->enrichMangaWithUserEntry(
            $manga,
            $mangaEntry
        );
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

    public function getMangaLibraryForUser(User $user, int $page): array
    {
        $mangaEntries = $this->mangaEntryService->findUserMangaEntries($user, $page);

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
