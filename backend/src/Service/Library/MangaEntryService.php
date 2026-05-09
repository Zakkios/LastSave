<?php

namespace App\Service\Library;

use App\DTO\UserMangaEntryAwareDTO;
use App\Entity\MangaEntry;
use App\Entity\User;
use App\Enum\MangaReadingStatus;
use App\Repository\MangaEntryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;

class MangaEntryService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly MangaEntryRepository $mangaEntryRepository
    ) {}

    public function createNewMangaEntry(User $user, Uuid $providerId, string $status): MangaEntry
    {
        $existingEntry = $this->findUserEntryForManga($user, $providerId);

        if ($existingEntry) {
            throw new \DomainException('Manga entry already exists');
        }

        $mangaReadingStatus = MangaReadingStatus::tryFrom($status);

        if (!$mangaReadingStatus) {
            throw new \InvalidArgumentException('Invalid manga status');
        }

        $mangaEntry = new MangaEntry();
        $mangaEntry->setProviderId($providerId);
        $mangaEntry->setStatus($mangaReadingStatus);
        $mangaEntry->setOwner($user);

        $this->entityManager->persist($mangaEntry);
        $this->entityManager->flush();

        return $mangaEntry;
    }

    public function updateMangaEntry(MangaEntry $mangaEntry, string $status): MangaEntry
    {
        $mangaReadingStatus = MangaReadingStatus::tryFrom($status);

        if (!$mangaReadingStatus) {
            throw new \InvalidArgumentException('Invalid manga status');
        }

        $mangaEntry->setStatus($mangaReadingStatus);

        $this->entityManager->flush();

        return $mangaEntry;
    }

    public function enrichMangaWithUserEntry(
        UserMangaEntryAwareDTO $manga,
        ?MangaEntry $mangaEntry
    ): UserMangaEntryAwareDTO {
        if (!$mangaEntry) {
            return $manga;
        }

        $readingStatus = $mangaEntry->getStatus();

        if (!$readingStatus) {
            return $manga;
        }

        $manga->markAsInLibrary(
            $readingStatus->value,
            $readingStatus->label()
        );

        return $manga;
    }

    /**
     * @param Uuid[] $providerIds
     * @return array<string, MangaEntry>
     */
    public function findUserEntriesIndexedByProviderId(User $user, array $providerIds): array
    {
        $entries = $this->mangaEntryRepository->findByOwnerAndProviderIds(
            $user,
            $providerIds
        );

        $indexedEntries = [];

        foreach ($entries as $entry) {
            $providerId = $entry->getProviderId();

            if (!$providerId) {
                continue;
            }

            $indexedEntries[$providerId->toRfc4122()] = $entry;
        }

        return $indexedEntries;
    }

    public function findUserEntryForManga(User $user, Uuid $providerId): ?MangaEntry
    {
        return $this->mangaEntryRepository->findOneByOwnerAndProviderId(
            $user,
            $providerId
        );
    }
}
