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
- [x] Jeton Twitch gardé dans `cache.app` jusqu'à une heure avant son expiration (`expires_in`, ~65 jours) au lieu d'être redemandé à chaque requête ; si IGDB répond 401 (jeton révoqué), `GameService::requestIgdb()` oublie le jeton, en redemande un et réessaie une fois. À réutiliser pour les futurs appels IGDB. Note : un mauvais Client ID donne aussi un 401 (un essai de plus, puis l'erreur remonte)

Backend (calqué sur la partie manga) :
- [x] `GameShortDTO`, `GameCompleteDTO` (interface `UserGameEntryAwareDTO`), `GameMapper` : champs absents à `null`, note IGDB arrondie (0-100), couverture `images.igdb.com/…/t_cover_big`, plateformes en abréviations, développeur = 1re société marquée `developer`
- [x] `GameEntryService` + `GameLibraryQueryService` ; `updatedAt` mis à jour à chaque modification (aligné côté manga à l'étape 6)
- [x] `GET /api/game/autocomplete?query=&page=` : 8 résultats par page ; seuls les jeux principaux, extensions, extensions autonomes, remakes, remasters et éditions enrichies (`game_type` 0, 2, 4, 8, 9, 10) ; guillemets et caractères de contrôle retirés du terme (IGDB ne sait pas les échapper), 100 caractères max
- [x] `GET /api/game/{id}` : 404 `Game not found` si IGDB ne connaît pas l'id
- [x] `GET /api/game/library/page/{page}` : 20 par page, plus récent en premier (IGDB renvoie trié par id : remis dans l'ordre)
- [x] `POST` / `PATCH /api/game_entries` : `providerId` entier positif obligatoire
- [x] `GET /api/game/random` supprimé (et `useGame` côté front) : on ne garde que les appels IGDB réellement utilisés
- Testé de bout en bout sur la base de dev avec le vrai IGDB (recherche, pagination, guillemets, fiche, 404, ajout, doublon 409, statut/id invalides 400, modification, bibliothèque ordonnée, marquage « dans ma bibliothèque », 401 sans connexion)

Frontend (calqué sur la partie manga) :
- [x] Hooks `useGameSearch` (délai de 300 ms, IGDB limitant à 4 requêtes/s), `useGameDetail` (id de l'URL vérifié, message dédié si IGDB répond 404), `useGameLibrary` (garde-fou contre deux chargements simultanés, erreur affichée au lieu d'un chargeur sans fin)
- [x] Onglet « Jeux » de `SearchPage` : une seule saisie partagée par les deux onglets, seul l'onglet affiché interroge son API. `useMangaSearch` reçoit donc la saisie en paramètre. Dans les deux onglets, le délai de saisie compte comme « recherche en cours » (plus de « Aucun résultat » affiché un instant)
- [x] `GamesPage` : bibliothèque en scroll infini, filtre par titre et par statut
- [x] `GameDetailPage` + `GameCard` (fiche : couverture, statut, sortie, note, résumé, genres, thèmes, plateformes)
- [x] `GameEntryModal` (ajout / modification, sur le modèle de `MangaEntryModal`) et `GameStatusBadge` (mêmes couleurs que les statuts manga)
- [x] Ancienne `GameCard` (carte courte) renommée `GamePreviewCard`, comme `MangaPreviewCard` ; une note de 0 n'affiche plus « 0 » seul ; plateformes affichées (4 max, puis « +N »)
- [x] Couvertures : URLs publiques `images.igdb.com`, pas besoin de proxy
- [x] Testé par Zakkios dans le navigateur (en local)
- [ ] Petits ajustements UI / UX à voir avec Zakkios avant la mise en ligne :
  - [x] Listes déroulantes (filtres, modales) aux couleurs du menu latéral, dans `index.css` : style complet sous Chrome, Edge et Safari 27+ (`appearance: base-select`) ; sous Firefox, liste native en sombre (survol géré par le navigateur)
  - [x] Onglet de la recherche dans l'adresse (`/search?tab=games`) : « Ajouter un jeu », « Rechercher des jeux » et « Retour à la recherche » d'une fiche jeu ouvrent l'onglet Jeux (idem côté manga)
- [ ] Mise en ligne (`npm run deploy`) : la migration des ID tournera en prod
- Limites connues : résumés, genres et thèmes en anglais (IGDB n'a pas de traduction) ; plateformes en abréviations IGDB, parfois peu parlantes (« fds », « famicom »)

## Étape 6 — Page d'accueil repensée

Critique de l'ancien dashboard (2026-11-07) : statistiques calculées sur les 20 derniers mangas seulement, jeux absents (« Bientôt disponible »), rien de cliquable, près de la moitié de la page en emplacements vides, titre en double (barre du haut + en-tête), trop long sur mobile, serré entre 1024 et 1280 px. Choix de Zakkios : pas de prénom ni d'avatar (pas de pseudo, pas de photo de profil).

Backend :
- [x] **Bug corrigé** : sans `limit`, MangaDex ne renvoie que 10 mangas par identifiants → une page de bibliothèque de 20 n'en affichait que 10 et le scroll infini s'arrêtait. `getMangasByIds` passe `limit` (100 max) et remet les mangas dans l'ordre demandé
- [x] Filtre `?status=` sur `GET /api/manga/library/page/{page}` et `GET /api/game/library/page/{page}` (400 `Invalid status` sinon)
- [x] `GET /api/library/stats` : nombre d'entrées par statut, mangas et jeux, compté en base (aucun appel externe) — `LibraryController` + `LibraryOverviewService`
- [x] `GET /api/library/recent` : 6 derniers ajouts ou changements de statut (tri sur `updatedAt`), mangas et jeux mélangés, `action` = `added` / `updated` (`RecentEntryDTO`)
- [x] `GET /api/game/upcoming` : jeux de la bibliothèque dont la première sortie (IGDB `first_release_date`) est à venir, 5 max, le plus proche d'abord. Les jeux sans date annoncée n'y figurent pas
- [x] `releaseDate` (AAAA-MM-JJ) ajouté aux DTO jeux
- [x] `updateMangaEntry` met à jour `updatedAt` (les mangas modifiés avant ce correctif apparaissent comme « ajoutés »)
- Testé de bout en bout sur la base de dev (12 mangas : la page en renvoie bien 12 dans l'ordre ; filtres ; statut invalide 400 ; GTA VI dans les jeux à venir ; dernières modifications mélangées et datées ; chiffres justes ; 401 sans connexion)

Frontend :
- [x] Accueil dans l'ordre d'utilité : « En cours » (mangas et jeux, couvertures cliquables, défilement horizontal sur mobile, « Tout voir » vers la bibliothèque filtrée), boutons « Ajouter un manga / un jeu », « Ma collection » (total + barre de répartition par statut, chaque statut mène à la bibliothèque filtrée), « Dernières modifications », « Jeux à venir »
- [x] Retirés : cartes de chiffres faussées, « Activité récente » et « Prochaines sorties » vides, astuce, cloche sans effet
- [x] Bibliothèques : statut filtré par le back et gardé dans l'adresse (`/mangas?status=reading`) ; « Aucun manga avec ce statut » au lieu de « bibliothèque vide »
- [x] Hooks génériques `usePaginatedList` (bibliothèques : garde-fou contre deux chargements, chargeur arrêté en cas d'erreur, repart de zéro quand le filtre change) et `useAsyncData` (données chargées une fois) ; `shared/utils/formatDate.ts` (« il y a 2 jours », « 19 nov. 2026 »)
- [x] Mise en page : barre du haut seulement sur mobile (logo), titre de page en `h1`, « Dashboard » renommé « Accueil » ; menu latéral sans rond ni adresse mail ; profil sans avatar
- [ ] Testé par Zakkios dans le navigateur
- Limite : le filtre par titre des bibliothèques ne porte que sur les entrées déjà chargées
- [x] `StatCard` et `ProgressBar`, devenus inutiles, supprimés

## Étape 7 — Cohérence visuelle et retrait d'une œuvre

Choix de Zakkios : boutons en indigo, retrait proposé dans la modale de statut, réglage de thème retiré du profil.

- [x] **Direction artistique** : une seule couleur d'accent, l'indigo. Vert réservé au statut « Terminé » et aux messages de réussite, rose aux suppressions. Boutons (`button.styles.ts`) : `primary` (indigo plein, une action principale par écran), `secondary` (bordure grise), `ghost` (discret), `danger` (confirmer une suppression), `danger-ghost` (proposer une suppression). Couleur du contour clavier portée par chaque variante
- [x] `ButtonLink` remplace `<Link><Button /></Link>` (bouton dans un lien : HTML invalide)
- [x] Vert → indigo : connexion, inscription, écran de session, chargement plein écran, étiquettes des fiches ; liste déroulante des modales alignée sur les filtres (plus de bordure claire ni de contour bleu) ; étoile de note en ambre
- [x] **Retrait d'une œuvre** : `DELETE /api/manga_entries/{providerId}` et `DELETE /api/game_entries/{providerId}` (204 ; 404 si absente de la liste ; 400 si UUID invalide). Dans la modale « Modifier ma liste », lien rose « Retirer de ma liste », puis confirmation. « Abandonné » reste un avis sur l'œuvre, pas une suppression. Testé de bout en bout (retrait, double retrait 404, ré-ajout possible, 401 sans connexion)
- [x] Profil : il ne reste que « Compte » (adresse e-mail, « Se déconnecter » en bouton secondaire, seul moyen de se déconnecter sur mobile) et « Sécurité » (« Modifier le mot de passe », désactivé, gardé pour plus tard). Retirés : thème, notifications, langue, encart « Pourquoi pas d'édition ? »
- [x] Boutons d'en-tête de page (« Ajouter un manga / un jeu » sur l'accueil, Mes mangas, Mes jeux) : même taille, même icône +, même couleur partout, en « indigo léger » (variante `tonal`), choisi par Zakkios parmi trois maquettes (indigo plein, indigo léger, gris). L'indigo plein reste pour l'action principale d'une fiche ou d'une fenêtre
- [x] Fiches manga et jeu : tailles de texte alignées sur le reste du site (titre 30 puis 36 px au lieu de 36 puis 48, auteur 18 px au lieu de 20, résumé 16 px au lieu de 18 et limité à ~65 caractères par ligne, retours à la ligne des résumés respectés)
- [x] Déconnexion (menu latéral et profil) : neutre au repos, rose au survol (variante `secondary-danger` dans le profil). Se déconnecter ne supprime rien : pas de rouge permanent
- [ ] Testé par Zakkios dans le navigateur
- À trancher : l'interface mélange « vous » (pages) et « tu » (modales, messages d'erreur)

## Étape 8 — Suivi de lecture des mangas

Maquette interactive validée par étapes avec Zakkios : https://claude.ai/artifact/8N23mVTE8zJxyYzHEj5tpz (privée). Ajustement demandé à la validation : « Annuler » centré sous la carte.

Fait (2026-11-07) :
- [x] Back : `MangaEntry.progressUnit` (enum `ProgressUnit`, défaut `chapter`), `lastReadChapter` (décimal), `lastReadVolume` ; migration `Version20261107150257` (les entrées existantes passent en chapitres, sans numéro). Progression facultative dans `POST` / `PATCH /api/manga_entries` (valeurs invalides : 400), `POST /api/manga_entries/{providerId}/advance` (+1, « À lire » → « En cours »)
- [x] Back : progression et fin de série (`isSeriesCompleted`, `finalChapter`, `finalVolume`, depuis `lastChapter` / `lastVolume` de MangaDex) dans les DTO ; dernier chapitre en français (`/manga/{id}/aggregate`, cache 6 h, 200 ms entre deux requêtes non cachées, `null` si MangaDex ne répond pas) sur la fiche, `GET /api/manga/latest-chapters?ids=` (12 max, badges) et `GET /api/manga/resumable` (« Terminé » dont la série continue, 10 candidats max)
- [x] Front : fenêtre « Gérer ma lecture » (format, saisie directe, − / +, aides), encart « Ma lecture » de la fiche, rangée « En cours » de l'accueil (progression, +1, « Annuler » centré 5 s, badges, note de transparence, bandeaux), progression sur « Mes mangas » et dans la recherche ; « Gérer ce jeu » côté jeux ; « Statut modifié » → « Mis à jour » dans les dernières modifications
- Testé de bout en bout côté back avec le vrai MangaDex (One Piece : 1197 en français ; Chainsaw Man : fin au chap. 232 ; Solo Leveling en tomes) ; lint et build du front OK
- [ ] Testé par Zakkios dans le navigateur
- Limites : les chiffres de « Ma collection » ne suivent pas les changements faits sur l'accueil avant rechargement ; après un changement de format dans la fenêtre, le dernier chapitre en français n'apparaît qu'au rechargement de la fiche

Vérifié sur MangaDex (2026-11-07) : chapitres très incomplets pour les séries licenciées (One Piece : 12 chapitres en français, dernier connu 1197 ; Solo Leveling : aucun en français ; Chainsaw Man : 9 en français, 100 en anglais). `lastChapter` n'est renseigné que pour les séries terminées. Le suivi de lecture (saisi par l'utilisateur) est fiable ; les nouveautés sont un bonus.

Décisions :
- Chaque manga se suit en **chapitres ou en tomes**, au choix, par manga (sélecteur dans la fenêtre) ; défaut : chapitres. Les deux numéros (dernier chapitre lu, dernier tome lu) sont gardés ; le +1 avance celui qui est choisi. Chapitres décimaux acceptés (1094.5 ; un +1 mène à 1095)
- Le numéro se **saisit directement**, dès l'ajout (« Ajouter à ma liste ») et ensuite ; le +1 sert à avancer d'un
- **+1** sur les cartes « En cours » de l'accueil et sur la fiche, seulement pour « À lire » et « En cours ». Un +1 sur « À lire » passe le manga en « En cours » (+1 rapide seulement ; dans la fenêtre, le statut ne change jamais tout seul). « Annuler » pendant 5 s après un +1
- **Nouveautés** : badge « N nouveaux » d'après les chapitres parus **en français** sur MangaDex, pour les mangas suivis en chapitres seulement (MangaDex suit la numérotation japonaise des tomes, pas les sorties françaises). Annotation de transparence sous la rangée. Série en cours rattrapée : « À jour »
- Dernier chapitre (ou tome) d'une série terminée atteint : l'appli **propose** « Terminé »
- Manga « Terminé » qui reçoit un nouveau chapitre (série encore en cours sur MangaDex) : bandeau sur l'accueil et proposition sur la fiche pour le **remettre en cours**, jamais automatique
- Bouton de la fiche renommé : « Gérer ma lecture » (manga), « Gérer ce jeu » (jeu) ; titre de la fenêtre assorti, bouton de validation « Enregistrer »
- Progression affichée sur « Mes mangas », sans +1

Découpage prévu : 1) back : champs de progression + migration, saisie à l'ajout et à la modification, route « +1 » (avec passage « À lire » → « En cours ») ; 2) front : fenêtre, cartes, fiche, bibliothèque, annulation ; 3) nouveautés : derniers chapitres en français et fins de série depuis MangaDex (cache de quelques heures), badges et propositions de statut.

## À factoriser un jour

- `useMangaSearch` et `useGameSearch` sont quasi identiques (gestion des requêtes concurrentes comprise) : un hook générique dans `shared/hooks` pourrait servir aux deux
- `StatusBadge` (manga) et `GameStatusBadge` : mêmes couleurs, un seul composant partagé possible
- `MangaEntryModal` et `GameEntryModal` : même structure (statut, ajout, modification, retrait)

## Plus tard (idées repérées dans le code)

- Vrai historique (« terminé le… », bilan de l'année) : table d'activité
- Jeux attendus sans date annoncée (TBA) dans « Jeux à venir »
- Filtre par titre des bibliothèques côté serveur (MangaDex et IGDB savent chercher parmi des identifiants)
- Modification du mot de passe (bouton déjà présent, désactivé, dans le profil)
