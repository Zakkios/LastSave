# Feuille de route

Reprise du projet le 2026-11-07, après environ 6 mois de pause (dernier commit le 2026-05-23).
État : partie manga terminée (recherche, fiche, bibliothèque paginée, ajout/modification de statut). Partie jeux à peine commencée. Pas encore de tests.

> ⚠️ La prod tourne encore avec Symfony 7.4.8 (une trentaine d'avis de sécurité, dont plusieurs « high ») et des cookies en `SameSite=None`. C'est corrigé dans le code mais pas déployé : le déploiement (étape 4) passe avant la partie jeux.
>
> ⚠️ Failles PHP « PHP2Shell » (CVE-2026-109618 et CVE-2026-109619, exécution de code à distance, publiées le 2026-10-21) : toutes les versions de PHP 5.4 à 8.5.11 sont touchées, corrigées dans 8.5.12 / 8.4.27. Le PHP local (8.5.5) est vulnérable ; la version exacte de la prod reste à vérifier.

## Étape 0 — Contexte Claude ✅

- [x] Dossier `.claude/` : contexte, conventions, feuille de route

## Étape 1 — Remise en route locale

- [x] Dépendances installées, base MariaDB démarrée, migrations appliquées, schéma synchronisé
- [x] `docker/.env.docker`, `backend/.env.local`, `frontend/.env.local` créés (secrets de dev aléatoires), clés JWT générées
- [x] Parcours API vérifié en local : inscription, connexion, `/me`, recherche MangaDex, refresh, déconnexion
- [x] `IGDB_CLIENT_ID` / `IGDB_CLIENT_SECRET` renseignés et vérifiés (jeton Twitch + requête IGDB via `/game/random`)
- [ ] Zakkios : mettre à jour le PHP local (`C:\php`, 8.5.5) en 8.5.12 ou plus (failles PHP2Shell)
- [ ] Zakkios : tester le parcours manga dans le navigateur
- [x] Nettoyages : ligne parasite de `backend/.gitignore`, `DATABASE_URL` par défaut en MariaDB, route morte `/token/logout` + règle `/token/invalidate`, README Vite remplacé par un README racine
- [x] Sécurité : cookies d'auth en `SameSite=Lax` en prod (paramètre `auth.cookie.samesite`, `none` en dev). CORS de prod vérifiée : seule `https://lastsave.zakkios.fr` est autorisée

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

## Étape 4 — Déploiement sur O2Switch (prioritaire)

Objectif : un seul hébergeur et une seule commande de déploiement. Le front quitte Cloudflare pour O2Switch sur le même domaine `lastsave.zakkios.fr` ; l'API reste sur `api-lastsave.zakkios.fr`.

Méthode proposée (à valider) : déploiement lancé depuis le PC de Zakkios, en SSH — son IP perso est déjà autorisée chez O2Switch. GitHub Actions écarté pour le déploiement : les IP des runners changent à chaque exécution et la liste blanche SSH d'O2Switch est limitée. La CI GitHub reste pour les vérifications.
- [ ] Infos à récupérer : hôte + utilisateur SSH, version exacte de PHP (web et CLI) et de MariaDB sur le serveur, dossier actuel de l'API et racine web de `api-lastsave.zakkios.fr`
- [ ] **Avant le premier déploiement** : passer `api-lastsave.zakkios.fr` en PHP 8.5 dans cPanel (sinon `platform_check.php` de Composer renvoie une erreur 500), en version 8.5.12 ou plus
- [ ] `.env.local` de prod : les valeurs actuelles restent bonnes (`APP_ENV`, `DATABASE_URL`, `JWT_PASSPHRASE`, `IGDB_*`, `CORS_ALLOW_ORIGIN`) ; ajouter `APP_SECRET` (absent)
- [ ] Mise en place unique sur le serveur : clone du dépôt, racine web de l'API → `backend/public`, copie du `backend/.env.local` et des clés JWT (`config/jwt/*.pem`) de prod
- [ ] Script `npm run deploy` : refuse de partir si le dépôt local n'est pas propre et à jour avec `origin/main`, ou si le PHP du serveur est en dessous de 8.5.12 ; puis sur le serveur `git pull`, `composer install --no-dev --optimize-autoloader`, `doctrine:migrations:migrate`, `cache:clear`
- [ ] Front : build local avec `VITE_API_URL=https://api-lastsave.zakkios.fr`, envoi de `dist/` en SSH, `.htaccess` qui renvoie vers `index.html` (routing SPA)
- [ ] Repointer le DNS de `lastsave.zakkios.fr` vers O2Switch, puis supprimer le Worker Cloudflare et `frontend/wrangler.jsonc`
- [ ] Si l'IP de la box change : la remettre dans l'autorisation SSH de cPanel

## Étape 5 — Partie jeux vidéo (IGDB)

Prérequis — incohérences repérées dans le code existant :
- [ ] `GameEntry.providerId` est un UUID (copié de `MangaEntry`) alors que les IDs IGDB sont des entiers → passer en `int` + migration
- [ ] Statuts désalignés : back `to_play / playing / completed / dropped`, front `backlog / playing / completed / retired / abandoned` → choisir une liste unique et ajouter `label()` à `GameStatus` comme `MangaReadingStatus`
- [ ] `IgdbAuthService` redemande un jeton Twitch à chaque appel → le mettre en cache (Symfony Cache) selon `expires_in` (~60 jours)

Backend (calqué sur la partie manga) :
- [ ] `GameShortDTO`, `GameCompleteDTO`, `GameMapper`
- [ ] `GameEntryService` + `GameLibraryQueryService`
- [ ] `GET /game/autocomplete?query=&page=`
- [ ] `GET /game/{id}`
- [ ] `GET /game/library/page/{page}`
- [ ] `POST` / `PATCH /game_entries`
- [ ] Décider du sort de `GET /game/random` (aucun écran ne l'utilise)

Frontend :
- [ ] Onglet « Jeux » de `SearchPage`
- [ ] `GamesPage` : bibliothèque avec scroll infini
- [ ] `GameDetailPage`
- [ ] Modale d'ajout / modification (sur le modèle de `MangaEntryModal`)
- [ ] Couvertures : URLs publiques `images.igdb.com`, pas besoin de proxy

## Plus tard (idées repérées dans le code)

- Dashboard : vraies statistiques, fil d'activité (`GET /activities`), dates de sortie — placeholders dans `DashboardPage`
- Page profil
