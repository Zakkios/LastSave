<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260509063414 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE game_entry ALTER provider_id TYPE UUID USING provider_id::uuid');
        $this->addSql('ALTER TABLE manga_entry ALTER provider_id TYPE UUID USING provider_id::uuid');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE game_entry ALTER provider_id TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE manga_entry ALTER provider_id TYPE VARCHAR(255)');
    }
}
