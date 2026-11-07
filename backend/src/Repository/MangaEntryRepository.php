<?php

namespace App\Repository;

use App\Entity\MangaEntry;
use App\Entity\User;
use App\Enum\MangaReadingStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\ArrayParameterType;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<MangaEntry>
 */
class MangaEntryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MangaEntry::class);
    }

    public function findOneByOwnerAndProviderId(User $user, Uuid $providerId): ?MangaEntry
    {
        return $this->findOneBy([
            'owner' => $user,
            'providerId' => $providerId,
        ]);
    }

    /**
     * @param Uuid[] $providerIds
     * @return MangaEntry[]
     */
    public function findByOwnerAndProviderIds(User $user, array $providerIds): array
    {
        if ($providerIds === []) {
            return [];
        }

        return $this->createQueryBuilder('m')
            ->andWhere('m.owner = :owner')
            ->andWhere('m.providerId IN (:providerIds)')
            ->setParameter('owner', $user)
            ->setParameter('providerIds', array_map(
                static fn (Uuid $providerId): string => $providerId->toBinary(),
                $providerIds
            ), ArrayParameterType::BINARY)
            ->getQuery()
            ->getResult();
    }

    /**
     * @return MangaEntry[] most recently added first, optionally limited to one status
     */
    public function findByOwnerPaginated(
        User $user,
        int $page = 0,
        ?MangaReadingStatus $status = null,
        int $limit = 20
    ): array {
        $page = max(0, $page);
        $limit = max(1, $limit);

        $criteria = ['owner' => $user];

        if ($status) {
            $criteria['status'] = $status;
        }

        return $this->findBy($criteria, ['id' => 'DESC'], $limit, $page * $limit);
    }

    /**
     * @return array<string, int> number of entries per status value (statuses without entries are absent)
     */
    public function countByStatusForOwner(User $user): array
    {
        $rows = $this->createQueryBuilder('m')
            ->select('m.status AS status, COUNT(m.id) AS total')
            ->andWhere('m.owner = :owner')
            ->setParameter('owner', $user)
            ->groupBy('m.status')
            ->getQuery()
            ->getArrayResult();

        $counts = [];

        foreach ($rows as $row) {
            $status = $row['status'] instanceof \BackedEnum ? $row['status']->value : (string) $row['status'];
            $counts[$status] = (int) $row['total'];
        }

        return $counts;
    }

    /**
     * @return MangaEntry[] most recently added or modified first
     */
    public function findRecentlyUpdatedByOwner(User $user, int $limit): array
    {
        return $this->findBy(['owner' => $user], ['updatedAt' => 'DESC', 'id' => 'DESC'], max(1, $limit));
    }
}
