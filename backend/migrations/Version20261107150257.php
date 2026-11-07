<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261107150257 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Reading progress on manga entries: unit (chapter or volume), last chapter read, last volume read';
    }

    public function up(Schema $schema): void
    {
        // Existing entries are followed by chapter, with no number yet.
        $this->addSql('ALTER TABLE manga_entry ADD progress_unit VARCHAR(255) DEFAULT \'chapter\' NOT NULL, ADD last_read_chapter DOUBLE PRECISION DEFAULT NULL, ADD last_read_volume SMALLINT UNSIGNED DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE manga_entry DROP progress_unit, DROP last_read_chapter, DROP last_read_volume');
    }
}
