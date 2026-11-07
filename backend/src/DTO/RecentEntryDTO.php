<?php

namespace App\DTO;

/**
 * A manga or game of the user's library, recently added or whose status recently changed.
 */
class RecentEntryDTO
{
    public function __construct(
        // 'manga' or 'game'
        public string $type,
        // Provider id: MangaDex UUID (manga) or IGDB integer (game)
        public string|int $id,
        public string $title,
        public ?string $coverUrl,
        public string $status,
        public string $statusLabel,
        // 'added' (new entry) or 'updated' (status changed since)
        public string $action,
        // ISO 8601 date of the last change
        public string $updatedAt,
    ) {}
}
