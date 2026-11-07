# Feuille de route

Reprise du projet le 2026-11-07, après environ 6 mois de pause (dernier commit le 2026-05-23).
État : partie manga terminée (recherche, fiche, bibliothèque paginée, ajout/modification de statut). Partie jeux à peine commencée. Pas encore de tests.

> ⚠️ Failles PHP « PHP2Shell » (CVE-2026-109618 et CVE-2026-109619, exécution de code à distance, publiées le 2026-10-21) : toutes les versions de PHP 5.4 à 8.5.11 sont touchées, corrigées dans 8.5.12 / 8.4.27. La prod et le PHP local sont en 8.5.12 : plus exposés.

## Étape 0 — Contexte Claude ✅

- [x] Dossier `.claude/` : contexte, conventions, feuille de route

## Étape 1 — Remise en route locale

- [x] Dépendances installées, base MariaDB démarrée, migrations appliquées, schéma synchronisé
- [x] `docker/.env.docker` et `backend/.env.local` créés (secrets de dev aléatoires), clés JWT générées
- [x] Parcours API vérifié en local : inscription, connexion, `/me`, recherche MangaDex, refresh, déconnexion
- [x] `IGDB_CLIENT_ID` / `IGDB_CLIENT_SECRET` renseignés et vérifiés (jeton Twitch + requête IGDB via `/game/random`)
- [x] PHP local en 8.5.12, désormais installé avec Scoop (`scoop update php` pour les mises à jour) ; configuration reprise de l'ancien `php.ini` (mêmes 39 extensions) dans `~/scoop/persist/php/cli/php.ini`. PATH Windows nettoyé (entrées `C:\Program Files (x86)\PHP` et `C:\php` retirées)
- [ ] Zakkios : supprimer les anciens dossiers `C:\php` et `C:\php-8.5.5-sauvegarde` quand il le souhaite
- [x] Parcours manga testé par Zakkios dans le navigateur (en prod)
- [x] Nettoyages : ligne parasite de `backend/.gitignore`, `DATABASE_URL` par défaut en MariaDB, route morte `/token/logout` + règle `/token/invalidate`, README Vite remplacé par un README racine
- [x] Sécurité : cookies d'auth en `SameSite=Lax` (paramètre `auth.cookie.samesite`)

## Étape 2 — CI (GitHub Actions)

- [x] `.github/workflows/ci.yml` : front (lint, build, audit des dépendances livrées), back (validate, audit, lint, migrations sur MariaDB, validation du schéma). À chaque push sur `main`, sur les PR et chaque lundi
- [x] Premier run sur GitHub : vert (front et back)
- [ ] Optionnel : PHPStan, premiers tests (PHPUnit côté back, Vitest côté front)

## Étape 3 — Dépendances ✅

- [x] Back : Symfony 7.4.8 → 7.4.23, Doctrine à jour, `composer audit` propre
- [x] Passage à PHP 8.5 : `php >= 8.5`, `config.platform.php = 8.5.0`, polyfills PHP 8.3 à 8.5 remplacés, CI en 8.5. Toutes les routes testées sous PHP 8.5 sans aucune dépréciation
- [x] Front : mises à jour mineures (react 19.3, vite 8.3, axios 1.21…). Les 3 erreurs de la nouvelle règle `react-hooks/set-state-in-effect` sont corrigées
- [x] `package.json` racine : `npm run dev` (base + API + front), `npm run setup`
- [ ] 7 avis « moderate » restants sur `minimatch` via `typescript-eslint` (outil de lint, pas livré au navigateur) : attendre une version de `typescript-eslint` qui accepte `minimatch` 11
- [ ] Plus tard, une par une : react-router 8, TypeScript 7, ESLint 10
- [ ] Garder `@types/node` aligné sur la version de Node utilisée (24), pas sur la dernière

## Étape 4 — Un seul domaine sur O2Switch + déploiement ✅

Objectif : tout sur O2Switch sous `lastsave.zakkios.fr` — plus de sous-domaine `api-lastsave`, plus de Cloudflare — avec le même modèle que `dev-irremplacable` : le front compilé dans `public/` de Symfony, `/api` pour l'API, des versions installées côte à côte et un lien `courante`.

Serveur (vérifié le 2026-11-07) : `souris.o2switch.net`, utilisateur `laza6411`, alias SSH `o2switch-lastsave` (clé `~/.ssh/o2switch_lastsave`). PHP 8.5.12 (web et CLI), MariaDB 11.4.13, Composer 2.10, Git 2.56. L'API actuelle est un envoi FTP de `backend/` dans `~/api-lastsave.zakkios.fr/` (racine web : `public/`), en Symfony 7.4.8 ; son `.env.local` contient toutes les variables attendues (`APP_SECRET` compris) et les clés JWT sont présentes. `dev-irremplacable` : racine web `~/dev-irremplacable/courante/public`, versions dans `versions/`, `.env.local` partagé dans `partage/`.
Déploiement lancé depuis le PC de Zakkios en SSH (son IP est autorisée chez O2Switch). GitHub Actions écarté pour le déploiement : les IP des runners changent à chaque exécution et la liste blanche SSH d'O2Switch est limitée. La CI GitHub reste pour les vérifications.

- [x] Accès SSH par clé dédiée, empreinte du serveur vérifiée
- [x] Migrations en base de prod vérifiées (table `doctrine_migration_versions`) : uniquement `Version20260522084558`, identique au dépôt
- [x] Code « un seul domaine » : routes sous `/api`, `.htaccess` d'aiguillage, URLs de couvertures relatives, relais `/api` dans Vite, `SameSite=Lax` partout, bundle CORS retiré, `VITE_API_URL` et `wrangler.jsonc` supprimés. Testé en local à travers Vite
- [x] Script de déploiement calqué sur `dev-irremplacable` (`deploiement/`, `npm run deploy`) : commit poussé + CI verte exigés, paquet back + front compilé (sans secret), envoi, `composer install` sur le serveur, migrations, bascule du lien `courante`, 3 versions gardées, `npm run deploy:retour`. Paquet testé en local
- [x] Mise en place unique sur le serveur : `~/lastsave/{versions,partage}`, `partage/.env.local` et `partage/jwt/` copiés depuis `~/api-lastsave.zakkios.fr/` (sans `CORS_ALLOW_ORIGIN`), contrôle `preparer` OK
- DNS de `zakkios.fr` géré chez **Cloudflare** (NS `kai` / `sloan.ns.cloudflare.com`) ; `lastsave.zakkios.fr` y pointe aujourd'hui sur le Worker
- [x] cPanel : `lastsave.zakkios.fr` ajouté, racine web `~/lastsave/courante/public`
- [x] Premier déploiement (2026-11-07, version `20261107-105852-9487ae6`) : front, routes React, assets, `/api` (401 sans connexion, login refusé proprement), couvertures, `.env` inaccessible (403)
- [x] DNS : `lastsave.zakkios.fr` pointe vers O2Switch (109.234.165.143, sans proxy Cloudflare) ; certificat Let's Encrypt émis par cPanel (renouvelé automatiquement)
- [x] Appli en ligne testée par Zakkios dans le navigateur
- [x] Ménage serveur : domaine `api-lastsave` retiré de cPanel, ancien dossier `~/api-lastsave.zakkios.fr/` et dossier `~/lastsave/courante-creee-par-cpanel-*` supprimés
- [x] Ménage Cloudflare : enregistrement DNS `api-lastsave` et Worker de l'ancien front supprimés
- [ ] Si l'IP de la box change : la remettre dans l'autorisation SSH de cPanel

## Étape 5 — Partie jeux vidéo (IGDB)

Prérequis — incohérences repérées dans le code existant :
- [x] `GameEntry.providerId` : UUID → entier IGDB (`INT UNSIGNED`), migration `Version20261107114907` qui refuse de tourner si `game_entry` contient déjà des lignes (conversion impossible sans perte)
- [x] Statuts alignés sur le back, parallèles aux mangas : `to_play / playing / completed / dropped`, libellés « À jouer / En cours / Terminé / Abandonné » (`GameStatus::label()` et `frontend/src/features/game/gameStatus.ts`). Champs du futur DTO : `isInLibrary`, `playStatus`, `playStatusLabel` (comme `readingStatus` côté manga). Au passage : libellé manga « A lire » → « À lire »
- [ ] `IgdbAuthService` redemande un jeton Twitch à chaque appel → le mettre en cache (Symfony Cache) selon `expires_in` (~60 jours)

Backend (calqué sur la partie manga) :
- [ ] `GameShortDTO`, `GameCompleteDTO`, `GameMapper`
- [ ] `GameEntryService` + `GameLibraryQueryService`
- [ ] `GET /api/game/autocomplete?query=&page=`
- [ ] `GET /api/game/{id}`
- [ ] `GET /api/game/library/page/{page}`
- [ ] `POST` / `PATCH /api/game_entries`
- [ ] Décider du sort de `GET /api/game/random` (aucun écran ne l'utilise)

Frontend :
- [ ] Onglet « Jeux » de `SearchPage`
- [ ] `GamesPage` : bibliothèque avec scroll infini
- [ ] `GameDetailPage`
- [ ] Modale d'ajout / modification (sur le modèle de `MangaEntryModal`)
- [ ] Couvertures : URLs publiques `images.igdb.com`, pas besoin de proxy

## Plus tard (idées repérées dans le code)

- Dashboard : vraies statistiques, fil d'activité (`GET /api/activities`), dates de sortie — placeholders dans `DashboardPage`
- Page profil
