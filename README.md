# LastSave

Suivi de collection de mangas et de jeux vidéo : on cherche une œuvre, on l'ajoute à sa bibliothèque avec un statut (à lire, en cours, terminé, abandonné).

https://lastsave.zakkios.fr/

## Stack

- `backend/` : API JSON Symfony 7.4, Doctrine, MariaDB, authentification JWT en cookies httpOnly
- `frontend/` : React 19, TypeScript, Vite, Tailwind CSS
- `docker/` : MariaDB pour le développement local
- Données : [MangaDex](https://api.mangadex.org/docs/) pour les mangas, [IGDB](https://api-docs.igdb.com/) pour les jeux

## Développement local

Prérequis : Node 24, PHP 8.5 (8.5.12 ou plus, qui corrige les failles « PHP2Shell ») dans le `PATH`, [Symfony CLI](https://symfony.com/download), Docker.

1. Installer les dépendances : `npm run setup`
2. Créer les fichiers d'environnement (non versionnés) :
   - `docker/.env.docker` à partir de `docker/.env.docker.exemple`
   - `backend/.env.local` : `DATABASE_URL` (MariaDB), `JWT_PASSPHRASE`, `IGDB_CLIENT_ID`, `IGDB_CLIENT_SECRET` ([console Twitch](https://dev.twitch.tv/console))
3. Démarrer la base : `npm run db:up`
4. Dans `backend/` : `symfony console lexik:jwt:generate-keypair` puis `symfony console doctrine:migrations:migrate`
5. Lancer base + API + front : `npm run dev`, puis ouvrir http://localhost:5173

Le front et l'API partagent un seul domaine : l'API répond sous `/api`. En dev, Vite relaie `/api` vers Symfony (https://127.0.0.1:8000) ; en prod, `backend/public/.htaccess` aiguille entre l'API et le front compilé.
