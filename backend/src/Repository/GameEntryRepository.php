<?php

namespace App\Repository;

use App\Entity\GameEntry;
use App\Entity\User;
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
     * @return GameEntry[] most recently added first
     */
    public function findByOwnerPaginated(User $user, int $page = 0, int $limit = 20): array
    {
        $page = max(0, $page);
        $limit = max(1, $limit);

        return $this->findBy(
            ['owner' => $user],
            ['id' => 'DESC'],
            $limit,
            $page * $limit
        );
    }
}
