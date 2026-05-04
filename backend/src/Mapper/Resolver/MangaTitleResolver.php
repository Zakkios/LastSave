<?php

namespace App\Mapper\Resolver;

class MangaTitleResolver
{
    public function resolveTitle(array $attributes): string
    {
        $mainTitle = $attributes['title'] ?? [];
        $altTitles = $attributes['altTitles'] ?? [];

        $frenchTitle = $this->findAltTitleByLanguage($altTitles, 'fr');
        $englishTitle = $mainTitle['en'] ?? null;
        $englishAltTitle = $this->findAltTitleByLanguage($altTitles, 'en');

        $title = $frenchTitle
            ?? $englishTitle
            ?? $englishAltTitle
            ?? reset($mainTitle)
            ?: 'Titre introuvable';

        return $title;
    }

    private function findAltTitleByLanguage(array $altTitles, string $language): ?string
    {
        foreach ($altTitles as $title) {
            if (isset($title[$language]) && is_string($title[$language])) {
                return $title[$language];
            }
        }

        return null;
    }
}
