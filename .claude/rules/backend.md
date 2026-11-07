---
paths:
  - "backend/**"
---

# Conventions backend (Symfony)

## Organisation

Chaîne suivie par la partie manga, à reproduire pour les jeux :

- `Controller/` — reste fin : lit et valide la requête, récupère l'utilisateur (`$this->getUser()` + `instanceof User`), délègue au service, convertit les exceptions en codes HTTP.
- `Service/Library/` — logique métier de la bibliothèque :
  - `*EntryService` : création, modification et lecture des entrées utilisateur ; enrichissement des DTO.
  - `*LibraryQueryService` : combine l'API externe et les entrées utilisateur pour produire la réponse.
- `Service/External/` — clients des API tierces (MangaDex, IGDB/Twitch). Tout appel HTTP passe par `Service/Http/ApiClient`.
- `Mapper/` — tableau brut de l'API externe → DTO.
- `DTO/` — ce qui est renvoyé au front : `*ShortDTO` (listes) et `*CompleteDTO` (fiche détail), qui implémentent une interface avec `markAsInLibrary()`.
- `Entity/`, `Repository/`, `Enum/` — Doctrine classique. Les statuts sont des enums `string` avec une méthode `label()` qui renvoie le libellé français.

## Règles

- Erreurs renvoyées sous la forme `{"message": "..."}`, en anglais. Codes : 400 entrée invalide (`\InvalidArgumentException`), 401 non connecté, 404 introuvable, 409 doublon (`\DomainException`).
- Routes déclarées en attributs `#[Route]` sur les contrôleurs, **sans** écrire `/api` : le préfixe est ajouté globalement dans `config/routes.yaml`.
- Nouvelle route publique → l'ajouter à `access_control` dans `config/packages/security.yaml`, avec le préfixe (`^/api/...`). Par défaut, tout exige d'être connecté.
- URLs renvoyées au front (ex. couvertures) : chemins relatifs (`UrlGeneratorInterface::ABSOLUTE_PATH`), front et API partageant le même domaine.
- Injection par constructeur avec propriétés promues `private readonly`. Paramètres scalaires via `bind` dans `config/services.yaml` (ex. `$igdbClientId`).
- Nouvelle variable d'environnement → la déclarer aussi, vide, dans `backend/.env`.
- UUID en base = `BINARY(16)` sous MariaDB : pour un `IN (:ids)`, convertir avec `->toBinary()` et `ArrayParameterType::BINARY` (voir `MangaEntryRepository::findByOwnerAndProviderIds`).
- Changement de schéma : modifier l'entité, générer la migration (`symfony console doctrine:migrations:diff`), la relire. Ne jamais modifier une migration déjà appliquée en prod : en créer une nouvelle.
- Avant de dire « terminé » : `symfony console lint:container`, et `symfony console debug:router` si des routes ont changé.
