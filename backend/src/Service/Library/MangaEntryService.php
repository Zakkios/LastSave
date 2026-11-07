<?php

namespace App\Service\Library;

use App\DTO\UserMangaEntryAwareDTO;
use App\Entity\MangaEntry;
use App\Entity\User;
use App\Enum\MangaReadingStatus;
use App\Enum\ProgressUnit;
use App\Repository\MangaEntryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;

class MangaEntryService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly MangaEntryRepository $mangaEntryRepository
    ) {}

    // Highest accepted chapter / volume number (One Piece is past 1 100 chapters and 100 volumes).
    private const MAX_CHAPTER = 100000;
    private const MAX_VOLUME = 1000;

    /**
     * @param array<string, mixed> $progress optional progressUnit, lastReadChapter, lastReadVolume
     */
    public function createNewMangaEntry(User $user, Uuid $providerId, string $status, array $progress = []): MangaEntry
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
        $this->applyProgress($mangaEntry, $progress);

        $this->entityManager->persist($mangaEntry);
        $this->entityManager->flush();

        return $mangaEntry;
    }

    /**
     * @param array<string, mixed> $progress optional progressUnit, lastReadChapter, lastReadVolume
     */
    public function updateMangaEntry(MangaEntry $mangaEntry, string $status, array $progress = []): MangaEntry
    {
        $mangaReadingStatus = MangaReadingStatus::tryFrom($status);

        if (!$mangaReadingStatus) {
            throw new \InvalidArgumentException('Invalid manga status');
        }

        $mangaEntry->setStatus($mangaReadingStatus);
        $this->applyProgress($mangaEntry, $progress);
        $mangaEntry->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->flush();

        return $mangaEntry;
    }

    /**
     * "+1": one more chapter (from 1094.5, the next one is 1095) or one more volume,
     * in the unit the manga is followed in. A manga still "to read" becomes "reading".
     */
    public function advanceMangaEntry(MangaEntry $mangaEntry): MangaEntry
    {
        if ($mangaEntry->getProgressUnit() === ProgressUnit::volume) {
            $mangaEntry->setLastReadVolume(min(self::MAX_VOLUME, ($mangaEntry->getLastReadVolume() ?? 0) + 1));
        } else {
            $mangaEntry->setLastReadChapter(min(self::MAX_CHAPTER, floor($mangaEntry->getLastReadChapter() ?? 0) + 1));
        }

        if ($mangaEntry->getStatus() === MangaReadingStatus::to_read) {
            $mangaEntry->setStatus(MangaReadingStatus::reading);
        }

        $mangaEntry->setUpdatedAt(new \DateTimeImmutable());
        $this->entityManager->flush();

        return $mangaEntry;
    }

    /**
     * Applies the progress fields present in $progress (absent ones are left as they are).
     * Numbers: null to clear, otherwise 0 or more (chapters may have decimals, volumes may not).
     *
     * @param array<string, mixed> $progress
     */
    private function applyProgress(MangaEntry $mangaEntry, array $progress): void
    {
        if (array_key_exists('progressUnit', $progress)) {
            $unit = is_string($progress['progressUnit']) ? ProgressUnit::tryFrom($progress['progressUnit']) : null;

            if (!$unit) {
                throw new \InvalidArgumentException('Invalid progress unit');
            }

            $mangaEntry->setProgressUnit($unit);
        }

        if (array_key_exists('lastReadChapter', $progress)) {
            $chapter = $progress['lastReadChapter'];

            if ($chapter !== null && (!is_int($chapter) && !is_float($chapter) || $chapter < 0 || $chapter > self::MAX_CHAPTER)) {
                throw new \InvalidArgumentException('Invalid chapter number');
            }

            $mangaEntry->setLastReadChapter($chapter === null ? null : round((float) $chapter, 2));
        }

        if (array_key_exists('lastReadVolume', $progress)) {
            $volume = $progress['lastReadVolume'];

            if ($volume !== null && (!is_int($volume) || $volume < 0 || $volume > self::MAX_VOLUME)) {
                throw new \InvalidArgumentException('Invalid volume number');
            }

            $mangaEntry->setLastReadVolume($volume);
        }
    }

    public function removeMangaEntry(MangaEntry $mangaEntry): void
    {
        $this->entityManager->remove($mangaEntry);
        $this->entityManager->flush();
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

        $manga->setReadingProgress(
            $mangaEntry->getProgressUnit()->value,
            $mangaEntry->getLastReadChapter(),
            $mangaEntry->getLastReadVolume()
        );

        return $manga;
    }

    /**
     * Mangas the user finished while followed by chapter, most recently changed first:
     * candidates for "a new chapter came out since you finished it".
     *
     * @return MangaEntry[]
     */
    public function findUserFinishedMangasFollowedByChapter(User $user, int $limit): array
    {
        return $this->mangaEntryRepository->findBy(
            ['owner' => $user, 'status' => MangaReadingStatus::completed, 'progressUnit' => ProgressUnit::chapter],
            ['updatedAt' => 'DESC', 'id' => 'DESC'],
            $limit
        );
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

    /**
     * @return MangaEntry[] most recently added first
     */
    public function findUserMangaEntries(User $user, int $page, ?MangaReadingStatus $status = null): array
    {
        return $this->mangaEntryRepository->findByOwnerPaginated($user, $page, $status);
    }
}
