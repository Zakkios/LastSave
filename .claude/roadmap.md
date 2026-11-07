# Feuille de route

Reprise du projet le 2026-11-07, après environ 6 mois de pause (dernier commit le 2026-05-23).
État : partie manga terminée (recherche, fiche, bibliothèque paginée, ajout/modification de statut). Partie jeux à peine commencée. Ni tests, ni CI/CD.

## Étape 0 — Contexte Claude ✅

- [x] Dossier `.claude/` : contexte, conventions, feuille de route

## Étape 1 — Remise en route locale

- [ ] `npm install` dans `frontend/`, `symfony composer install` dans `backend/`
- [ ] `docker/.env.docker` depuis l'exemple, puis `npm run db:up`
- [ ] `backend/.env.local` (voir CLAUDE.md) — récupérer Client ID + Secret IGDB sur https://dev.twitch.tv/console
- [ ] Clés JWT : `symfony console lexik:jwt:generate-keypair`
- [ ] `symfony console doctrine:migrations:migrate`
- [ ] `frontend/.env.local` avec `VITE_API_URL`
- [ ] Vérifier le parcours manga de bout en bout (inscription, connexion, recherche, ajout, bibliothèque)
- [ ] Petits nettoyages repérés :
  - ligne parasite `Terminal: Select Default Profile` en tête de `backend/.gitignore`
  - `DATABASE_URL` par défaut en PostgreSQL dans `backend/.env` alors que le projet utilise MariaDB
  - `IGDB_CLIENT_SECRET` absent de `backend/.env` (à déclarer vide, comme `IGDB_CLIENT_ID`)
  - `routes.yaml` déclare `/token/logout` alors que `security.yaml` ouvre `/token/invalidate`
  - `frontend/README.md` est le README par défaut de Vite
- [ ] Sécurité — cookies d'auth en `SameSite=None` alors que front et API sont déjà sur le même site (`zakkios.fr`) : le navigateur les envoie aussi sur des requêtes venant d'autres sites (risque CSRF sur `POST`/`PATCH /manga_entries`). Les passer en `Lax` en prod : `lexik_jwt_authentication.yaml` (cookie `BEARER`), `gesdinet_jwt_refresh_token.yaml`, `LogoutListener`. Garder `None` en dev (`when@dev`) : Vite en `http://localhost` et `symfony server` en `https` comptent comme deux sites différents. Vérifier au passage que `CORS_ALLOW_ORIGIN` de prod n'autorise que `https://lastsave.zakkios.fr`.

## Étape 2 — CI (GitHub Actions)

- [ ] Front : `npm ci`, `npm run lint`, `npm run build`
- [ ] Back : `composer validate`, `composer install`, `lint:container`, `lint:yaml config`, `doctrine:schema:validate --skip-sync`
- [ ] Optionnel : PHPStan, premiers tests (PHPUnit côté back, Vitest côté front)

## Étape 3 — Dépendances

- [ ] Mises à jour mineures du front (react 19.3, vite 8.3, tailwind 4.3, axios, lucide-react…)
- [ ] `package.json` racine : `name`, `private`, script `dev` qui lance base + API + front d'un coup, script `setup`
- [ ] Composer : rester sur Symfony 7.4 (LTS), mises à jour mineures des bundles
- [ ] Plus tard, une par une : react-router 8, TypeScript 7, ESLint 10
- [ ] Garder `@types/node` aligné sur la version de Node utilisée (24), pas sur la dernière

## Étape 4 — Partie jeux vidéo (IGDB)

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

## Étape 5 — Hébergement unifié sur O2Switch + déploiement automatique

Objectif : un seul hébergeur et un seul déploiement. Le front quitte Cloudflare pour O2Switch, sur le même domaine `lastsave.zakkios.fr` ; l'API reste sur `api-lastsave.zakkios.fr`.
- [ ] Front servi par Apache sur O2Switch : contenu de `dist/` + `.htaccess` qui renvoie vers `index.html` (routing SPA)
- [ ] Repointer le DNS de `lastsave.zakkios.fr` vers O2Switch, puis supprimer le Worker Cloudflare et `frontend/wrangler.jsonc`
- [ ] Remplacer le déploiement FTP manuel par GitHub Actions : build du front et `composer install --no-dev --optimize-autoloader` dans le runner, envoi par `rsync` via SSH, puis `doctrine:migrations:migrate` et `cache:clear` sur le serveur
- [ ] À vérifier : l'accès SSH O2Switch est filtré par IP (liste blanche dans cPanel), à gérer pour les runners GitHub — sinon passer par le « Git Version Control » de cPanel
- [ ] Secrets de prod : secrets GitHub + `.env.local` sur le serveur

## Plus tard (idées repérées dans le code)

- Dashboard : vraies statistiques, fil d'activité (`GET /activities`), dates de sortie — placeholders dans `DashboardPage`
- Page profil
