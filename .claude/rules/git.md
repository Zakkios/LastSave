# Conventions Git

- Format Conventional Commits, en anglais : `type(scope): description`, à l'impératif, en minuscules, sans point final.
  - Types : `feat`, `fix`, `refactor`, `style`, `chore`, `build`, `docs`, `ci`.
  - Scopes habituels : `manga`, `game`, `library`, `auth`, `ui`, `frontend`, `backend`, `docker`, `db`, `deps`, `ci`.
- Un commit = un changement cohérent ; plusieurs petits commits plutôt qu'un gros.
- Ne jamais commiter `.env.local`, `.env.docker`, `.env.production` ni de clé `*.pem`.
- Ne pas commiter ni pousser sans demande explicite.
