---
paths:
  - "frontend/**"
---

# Conventions frontend (React)

## Organisation

- `src/features/<domaine>/` (auth, manga, game) : `api.ts` (appels HTTP), `types.ts`, `hooks/`, `components/`, `constants.ts`.
- `src/pages/` : une page par route. Le routing est dans `src/App.tsx` : `ProtectedRoute` + `AppShell` pour l'application, `GuestRoute` pour connexion et inscription.
- `src/shared/` : composants réutilisables (`Button`, `Card`, `Dropdown`, `EmptyState`, `PageHeader`…), hooks (`useDebounce`), layouts (`AppShell`).
- Un composant partagé un peu riche a son propre dossier : `Composant.tsx`, `composant.types.ts`, `composant.styles.ts`.

## Règles

- Tous les appels API passent par l'instance axios de `src/services/http.ts` (base `/api`, refresh automatique). Jamais de `fetch` ni de nouvel `axios.create`. Les chemins s'écrivent sans `/api` (ex. `http.get("/manga/autocomplete")`).
- Pas d'URL d'API en dur ni de variable d'environnement : front et API partagent le même domaine, et en dev Vite relaie `/api` vers Symfony.
- Une fonction par endpoint dans `features/<domaine>/api.ts` ; un hook par cas d'usage (`use<X>Search`, `use<X>Detail`, `use<X>Library`, `use<X>InfiniteList`).
- Les types front reprennent exactement les noms de champs des DTO renvoyés par le backend.
- Textes de l'interface en français.
- Style : classes Tailwind 4 (variables et utilitaires globaux dans `src/index.css`), thème sombre `zinc`, accent `indigo`. Icônes : `lucide-react`.
- Listes longues : scroll infini avec `react-infinite-scroll-component` (voir `MangasPage` et `SearchPage`).
- Avant de dire « terminé » : `npm run lint` et `npm run build`.
