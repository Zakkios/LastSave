# LastSave — contexte projet

Application web pour suivre sa collection de **mangas** et de **jeux vidéo** : on cherche une œuvre, on l'ajoute à sa bibliothèque avec un statut (à lire, en cours, terminé, abandonné…).
Projet personnel, développé seul par Zakkios. Prod : https://lastsave.zakkios.fr/ — dépôt : https://github.com/Zakkios/LastSave (branche `main`).

La feuille de route (fait / reste à faire / ordre) est dans [roadmap.md](roadmap.md), importée en bas de ce fichier.

## Directives générales

- Répondre en français. Code, identifiants, messages d'erreur de l'API et messages de commit en anglais ; textes de l'interface en français.
- Partir des patterns existants — la partie manga est la référence — plutôt que d'inventer une nouvelle structure.
- Tenir `roadmap.md` à jour : cocher ce qui est terminé, y noter les problèmes découverts en route.
- Conventions détaillées dans `rules/` : `backend.md` et `frontend.md` (chargées quand on touche le dossier concerné), `git.md` (toujours).

<!-- Nouvelles directives : les ajouter ici, ou dans rules/ si elles concernent un domaine précis. -->

## Stack

| Dossier | Contenu |
|---|---|
| `backend/` | API JSON Symfony 7.4 (LTS), PHP 8.5 (minimum imposé par `composer.json`, plateforme Composer fixée à 8.5.0), Doctrine ORM 3 + migrations, MariaDB 11.4 |
| `frontend/` | SPA React 19 + TypeScript, Vite 8, Tailwind CSS 4, react-router 7, axios, lucide-react |
| `docker/` | MariaDB pour le dev local uniquement (`compose.yml`) |
| `package.json` (racine) | Scripts raccourcis, plus `concurrently` pour `npm run dev` |

APIs externes :
- **MangaDex** (mangas) — API publique sans clé. Les couvertures passent par un proxy backend (`/api/manga/cover/...`, route publique, URL relative).
- **IGDB** (jeux, propriété de Twitch) — jeton OAuth « client credentials » via `POST https://id.twitch.tv/oauth2/token`, puis `POST https://api.igdb.com/v4/<endpoint>` avec une requête Apicalypse en texte brut et les en-têtes `Client-ID` + `Authorization: Bearer`. Limite : 4 requêtes/s.

## Un seul domaine pour le front et l'API

- Toutes les routes Symfony sont sous `/api` (préfixe global dans `backend/config/routes.yaml`) ; le reste des URLs appartient à React.
- En prod, `backend/public/.htaccess` aiguille : `/api/...` → `index.php`, fichier existant → servi tel quel (le front compilé est posé dans `public/`), tout le reste → `index.html`. Même modèle que l'autre projet de Zakkios (`dev-irremplacable`).
- En dev, Vite relaie `/api` vers Symfony (`frontend/vite.config.ts`) : le navigateur ne parle qu'à http://localhost:5173. Pas de CORS nulle part.

## Authentification

- `POST /api/login` (json_login) → LexikJWT : jeton de 15 min dans le cookie httpOnly `BEARER`.
- Refresh token Gesdinet (30 jours, usage unique) dans un cookie httpOnly, renouvelé par `POST /api/token/refresh`.
- Cookies `Secure` + httpOnly + `SameSite=Lax` (paramètre `auth.cookie.samesite` dans `config/services.yaml`, aussi utilisé par `LogoutListener`). En dev, les navigateurs acceptent les cookies `Secure` sur http://localhost (Chrome, Edge, Firefox).
- Front : `src/services/http.ts` appelle `/api` et rejoue une requête après refresh quand l'API répond 401.
- Toutes les routes exigent d'être connecté, sauf celles listées dans `access_control` (`backend/config/packages/security.yaml`).

## Modèle de données

`User` 1—n `MangaEntry` / `GameEntry` : `owner`, `providerId`, `status`, `createdAt`, `updatedAt`, unicité (`owner`, `providerId`).
On ne stocke **que l'identifiant chez le fournisseur et le statut**. Titres, couvertures, etc. sont relus depuis l'API externe à chaque affichage, puis « enrichis » avec l'entrée de l'utilisateur (`isInLibrary`, statut, libellé).

## Commandes

Depuis la racine :
- `npm run setup` — installe les dépendances (racine, front, back)
- `npm run dev` — démarre la base, puis l'API (https://127.0.0.1:8000) et le front (http://localhost:5173, qui relaie `/api`) dans un seul terminal
- `npm run db:up` / `db:down` / `db:restart` / `db:logs` / `db:shell` — `db:reset` **efface les données**
- `npm run back` / `npm run front` — l'API ou le front seul
- `npm run deploy` — met en ligne le commit actuel (poussé, CI verte) ; `npm run deploy:retour` revient à la version précédente ; `npm run deploy -- --paquet` prépare seulement le paquet. Scripts dans `deploiement/`, config locale dans `deploiement/config` (ignorée par Git)

Frontend (`frontend/`) : `npm run dev`, `npm run lint`, `npm run build` (inclut `tsc -b`).

Backend (`backend/`) : sur le PC de Zakkios, PHP 8.5 est dans `C:\php`. Si `symfony server:start` affiche « no PHP binaries detected », c'est que `C:\php` manque au PATH. Le mode démon (`symfony server:start -d`) échoue sous Windows (fichier de log verrouillé) : lancer le serveur au premier plan. Passer par la CLI Symfony :
- `symfony composer install`
- `symfony console doctrine:migrations:diff` puis `symfony console doctrine:migrations:migrate`
- `symfony console debug:router`
- `symfony console lexik:jwt:generate-keypair`

CI : `.github/workflows/ci.yml` (lint, build, audits de sécurité, migrations + validation du schéma). Il n'existe encore **aucun test**.

## Configuration locale (non versionnée — ne jamais commiter)

- `backend/.env.local` : `APP_SECRET`, `DATABASE_URL` (`mysql://…?serverVersion=11.4.11-MariaDB&charset=utf8mb4`), `JWT_PASSPHRASE`, `IGDB_CLIENT_ID`, `IGDB_CLIENT_SECRET` (console https://dev.twitch.tv/console)
- `backend/config/jwt/*.pem` : clés JWT
- `docker/.env.docker` : variables `MARIADB_*` (modèle : `docker/.env.docker.exemple`)

## Hébergement actuel

- Tout est sur O2Switch, sous https://lastsave.zakkios.fr/ (front + `/api`) : serveur `souris.o2switch.net`, utilisateur `laza6411`, alias SSH `o2switch-lastsave` (clé `~/.ssh/o2switch_lastsave`, l'IP de Zakkios est autorisée dans cPanel).
- Sur le serveur : `~/lastsave/versions/<version>/`, lien `~/lastsave/courante` (racine web : `courante/public`), secrets dans `~/lastsave/partage/` (`.env.local`, `jwt/`). Mise en ligne : `npm run deploy`.
- DNS de `zakkios.fr` géré chez Cloudflare (enregistrement `lastsave` → 109.234.165.143, sans proxy). Certificat Let's Encrypt géré par cPanel.
- L'ancienne API `api-lastsave.zakkios.fr` (envoi FTP) et l'ancien front sur Cloudflare Workers ont été retirés le 2026-11-07.

@roadmap.md
