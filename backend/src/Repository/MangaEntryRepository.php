<?php

namespace App\Repository;

use App\Entity\MangaEntry;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
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
            ->setParameter('providerIds', $providerIds)
            ->getQuery()
            ->getResult();
    }

    public function findByOwnerPaginated(
        User $user,
        int $page = 0,
        int $limit = 20
    ): array {
        $page = max(0, $page);
        $limit = max(1, $limit);

        $offset = $page * $limit;

        return $this->findBy(
            ['owner' => $user],
            ['id' => 'DESC'],
            $limit,
            $offset
        );
    }

    //    /**
    //     * @return MangaEntry[] Returns an array of MangaEntry objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('m.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?MangaEntry
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
