<?php

namespace App\Entity;

use App\Enum\MangaReadingStatus;
use App\Enum\ProgressUnit;
use App\Repository\MangaEntryRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: MangaEntryRepository::class)]
#[ORM\UniqueConstraint(name: 'uniq_owner_provider_manga', columns: ['owner_id', 'provider_id'])]
class MangaEntry
{
    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: 'uuid', nullable: false)]
    private ?Uuid $providerId = null;

    #[ORM\Column(enumType: MangaReadingStatus::class)]
    private ?MangaReadingStatus $status = null;

    #[ORM\ManyToOne(inversedBy: 'mangaEntries')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    // Reading progress. Both numbers are kept, so switching unit loses nothing;
    // the unit says which one is shown and moved forward by "+1".
    #[ORM\Column(enumType: ProgressUnit::class, options: ['default' => 'chapter'])]
    private ProgressUnit $progressUnit = ProgressUnit::chapter;

    // Decimals allowed: 1094.5 for a special chapter.
    #[ORM\Column(nullable: true)]
    private ?float $lastReadChapter = null;

    #[ORM\Column(type: 'smallint', nullable: true, options: ['unsigned' => true])]
    private ?int $lastReadVolume = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updatedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProviderId(): ?Uuid
    {
        return $this->providerId;
    }

    public function setProviderId(Uuid $providerId): static
    {
        $this->providerId = $providerId;

        return $this;
    }

    public function getStatus(): ?MangaReadingStatus
    {
        return $this->status;
    }

    public function setStatus(MangaReadingStatus $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    public function getProgressUnit(): ProgressUnit
    {
        return $this->progressUnit;
    }

    public function setProgressUnit(ProgressUnit $progressUnit): static
    {
        $this->progressUnit = $progressUnit;

        return $this;
    }

    public function getLastReadChapter(): ?float
    {
        return $this->lastReadChapter;
    }

    public function setLastReadChapter(?float $lastReadChapter): static
    {
        $this->lastReadChapter = $lastReadChapter;

        return $this;
    }

    public function getLastReadVolume(): ?int
    {
        return $this->lastReadVolume;
    }

    public function setLastReadVolume(?int $lastReadVolume): static
    {
        $this->lastReadVolume = $lastReadVolume;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
