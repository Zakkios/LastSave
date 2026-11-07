<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261107114907 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'game_entry.provider_id: UUID (BINARY(16)) -> IGDB integer id';
    }

    public function preUp(Schema $schema): void
    {
        $this->abortIfGameEntriesExist();
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE game_entry CHANGE provider_id provider_id INT UNSIGNED NOT NULL');
    }

    public function preDown(Schema $schema): void
    {
        $this->abortIfGameEntriesExist();
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE game_entry CHANGE provider_id provider_id BINARY(16) NOT NULL');
    }

    // Converting between a binary UUID and an integer would corrupt existing ids.
    // No route could create game entries before this change, so the table should be empty.
    private function abortIfGameEntriesExist(): void
    {
        $count = (int) $this->connection->fetchOne('SELECT COUNT(*) FROM game_entry');

        $this->abortIf(
            $count > 0,
            sprintf('game_entry has %d row(s): their provider_id cannot be converted automatically.', $count)
        );
    }
}
