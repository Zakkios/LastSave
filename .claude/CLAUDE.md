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
| `backend/` | API JSON Symfony 7.4 (LTS), PHP ≥ 8.2, Doctrine ORM 3 + migrations, MariaDB 11.4 |
| `frontend/` | SPA React 19 + TypeScript, Vite 8, Tailwind CSS 4, react-router 7, axios, lucide-react |
| `docker/` | MariaDB pour le dev local uniquement (`compose.yml`) |
| `package.json` (racine) | Scripts raccourcis uniquement, aucune dépendance |

APIs externes :
- **MangaDex** (mangas) — API publique sans clé. Les couvertures passent par un proxy backend (`/manga/cover/...`, route publique).
- **IGDB** (jeux, propriété de Twitch) — jeton OAuth « client credentials » via `POST https://id.twitch.tv/oauth2/token`, puis `POST https://api.igdb.com/v4/<endpoint>` avec une requête Apicalypse en texte brut et les en-têtes `Client-ID` + `Authorization: Bearer`. Limite : 4 requêtes/s.

## Authentification

- `POST /login` (json_login) → LexikJWT : jeton de 15 min dans le cookie httpOnly `BEARER`.
- Refresh token Gesdinet (30 jours, usage unique) dans un cookie httpOnly, renouvelé par `POST /token/refresh`.
- Cookies actuellement en `SameSite=None; Secure`. Front et API sont tous deux sous `zakkios.fr` (même site), donc `Lax` suffit en prod — voir roadmap, étape 1.
- Front : `src/services/http.ts` envoie les cookies (`withCredentials`) et rejoue une requête après refresh quand l'API répond 401.
- Toutes les routes exigent d'être connecté, sauf celles listées dans `access_control` (`backend/config/packages/security.yaml`).

## Modèle de données

`User` 1—n `MangaEntry` / `GameEntry` : `owner`, `providerId`, `status`, `createdAt`, `updatedAt`, unicité (`owner`, `providerId`).
On ne stocke **que l'identifiant chez le fournisseur et le statut**. Titres, couvertures, etc. sont relus depuis l'API externe à chaque affichage, puis « enrichis » avec l'entrée de l'utilisateur (`isInLibrary`, statut, libellé).

## Commandes

Depuis la racine :
- `npm run db:up` / `db:down` / `db:restart` / `db:logs` / `db:shell` — `db:reset` **efface les données**
- `npm run back` — `symfony server:start` dans `backend/`
- `npm run front` — Vite dans `frontend/`

Frontend (`frontend/`) : `npm run dev`, `npm run lint`, `npm run build` (inclut `tsc -b`).

Backend (`backend/`) : sous Windows, `php` n'est pas dans le PATH du shell → passer par la CLI Symfony (PHP 8.5 en local) :
- `symfony composer install`
- `symfony console doctrine:migrations:diff` puis `symfony console doctrine:migrations:migrate`
- `symfony console debug:router`
- `symfony console lexik:jwt:generate-keypair`

Il n'existe encore **aucun test ni CI**.

## Configuration locale (non versionnée — ne jamais commiter)

- `backend/.env.local` : `APP_SECRET`, `DATABASE_URL` (`mysql://…?serverVersion=11.4.11-MariaDB&charset=utf8mb4`), `JWT_PASSPHRASE`, `IGDB_CLIENT_ID`, `IGDB_CLIENT_SECRET` (console https://dev.twitch.tv/console), `CORS_ALLOW_ORIGIN` si besoin
- `backend/config/jwt/*.pem` : clés JWT
- `frontend/.env.local` (dev) et `frontend/.env.production` (build prod) : `VITE_API_URL`
- `docker/.env.docker` : variables `MARIADB_*` (modèle : `docker/.env.docker.exemple`)

## Hébergement actuel

- **Frontend** : https://lastsave.zakkios.fr/ sur Cloudflare Workers (assets statiques, repli SPA), config `frontend/wrangler.jsonc`.
- **Backend** : https://api-lastsave.zakkios.fr/ sur O2Switch (hébergement mutualisé, Apache → `symfony/apache-pack`). Premier déploiement fait à la main en FTP.
- Cible : tout regrouper sur O2Switch, avec un déploiement automatique depuis GitHub Actions (roadmap, étape 5).

@roadmap.md
