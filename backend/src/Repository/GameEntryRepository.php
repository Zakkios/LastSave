<?php

namespace App\Repository;

use App\Entity\GameEntry;
use App\Entity\User;
use App\Enum\GameStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\ArrayParameterType;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<GameEntry>
 */
class GameEntryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, GameEntry::class);
    }

    public function findOneByOwnerAndProviderId(User $user, int $providerId): ?GameEntry
    {
        return $this->findOneBy([
            'owner' => $user,
            'providerId' => $providerId,
        ]);
    }

    /**
     * @param int[] $providerIds
     *
     * @return GameEntry[]
     */
    public function findByOwnerAndProviderIds(User $user, array $providerIds): array
    {
        if ($providerIds === []) {
            return [];
        }

        return $this->createQueryBuilder('g')
            ->andWhere('g.owner = :owner')
            ->andWhere('g.providerId IN (:providerIds)')
            ->setParameter('owner', $user)
            ->setParameter('providerIds', $providerIds, ArrayParameterType::INTEGER)
            ->getQuery()
            ->getResult();
    }

    /**
     * @return GameEntry[] most recently added first, optionally limited to one status
     */
    public function findByOwnerPaginated(
        User $user,
        int $page = 0,
        ?GameStatus $status = null,
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
        $rows = $this->createQueryBuilder('g')
            ->select('g.status AS status, COUNT(g.id) AS total')
            ->andWhere('g.owner = :owner')
            ->setParameter('owner', $user)
            ->groupBy('g.status')
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
     * @return GameEntry[] most recently added or modified first
     */
    public function findRecentlyUpdatedByOwner(User $user, int $limit): array
    {
        return $this->findBy(['owner' => $user], ['updatedAt' => 'DESC', 'id' => 'DESC'], max(1, $limit));
    }

    /**
     * @return int[] IGDB ids of every game in the user's library
     */
    public function findProviderIdsByOwner(User $user): array
    {
        return array_map('intval', $this->createQueryBuilder('g')
            ->select('g.providerId')
            ->andWhere('g.owner = :owner')
            ->setParameter('owner', $user)
            ->getQuery()
            ->getSingleColumnResult());
    }
}
