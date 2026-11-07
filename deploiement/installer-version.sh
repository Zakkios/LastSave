#!/usr/bin/env bash
# Exécuté sur le serveur par deployer.sh, via SSH : bash -s -- <dossier du site> <action> [version]
#   preparer            contrôles avant l'envoi (PHP, secrets)
#   installer <version> installe la version envoyée, puis bascule le site dessus
#   retour              rebascule le site sur la version précédente
#
# Organisation du dossier du site sur le serveur (même modèle que dev-irremplacable) :
#   partage/.env.local  secrets de production (jamais lus ni affichés ici)
#   partage/jwt/        clés JWT de production (private.pem, public.pem)
#   versions/<version>/ une version complète par déploiement ; les 3 dernières sont gardées
#   courante            lien vers la version en ligne ; la racine web est courante/public
set -euo pipefail

DOSSIER="$1"
ACTION="$2"
VERSION="${3:-}"
GARDER=3
PHP_MINIMUM=80512 # PHP 8.5.12 : correctifs PHP2Shell (CVE-2026-109618, CVE-2026-109619)

cd "$DOSSIER" 2> /dev/null || { echo "Dossier $DOSSIER introuvable sur le serveur."; exit 1; }

basculer_sur() {
  ln -sfn "versions/$1" courante.nouvelle
  mv -Tf courante.nouvelle courante
}

case "$ACTION" in
  preparer)
    echo "PHP en ligne de commande sur le serveur : $(php -r 'echo PHP_VERSION;')"
    php -r "exit(PHP_VERSION_ID >= $PHP_MINIMUM ? 0 : 1);" \
      || { echo "PHP trop ancien sur le serveur : 8.5.12 minimum (failles PHP2Shell)."; exit 1; }
    mkdir -p versions partage
    [ -f partage/.env.local ] \
      || { echo "Il manque $DOSSIER/partage/.env.local : les secrets de production (voir deploiement/env.local.serveur.exemple)."; exit 1; }
    # Contrôle par grep -q : rien du fichier n'est affiché.
    grep -q '^APP_ENV=prod' partage/.env.local \
      || { echo "partage/.env.local doit contenir la ligne APP_ENV=prod."; exit 1; }
    [ -f partage/jwt/private.pem ] && [ -f partage/jwt/public.pem ] \
      || { echo "Il manque les clés JWT de production dans $DOSSIER/partage/jwt/."; exit 1; }
    echo "Contrôles OK."
    ;;

  installer)
    [ -n "$VERSION" ] && [ -f "versions/$VERSION.tar.gz" ] || { echo "Paquet versions/$VERSION.tar.gz introuvable."; exit 1; }
    mkdir "versions/$VERSION"
    # En cas d'échec avant la bascule, la version incomplète est retirée : le site reste sur l'ancienne.
    trap 'echo "Échec : le site reste sur la version précédente."; rm -rf "versions/$VERSION"' ERR
    # --no-same-owner : les fichiers appartiennent à qui extrait, comme le lien « courante ».
    # Sinon, Apache (SymLinksIfOwnerMatch chez cPanel) refuse de suivre le lien vers la version.
    tar -xzf "versions/$VERSION.tar.gz" --no-same-owner -C "versions/$VERSION"
    rm "versions/$VERSION.tar.gz"
    ln -s ../../partage/.env.local "versions/$VERSION/.env.local"
    ln -s ../../../partage/jwt "versions/$VERSION/config/jwt"
    (
      cd "versions/$VERSION"
      # Dépendances installées ici, avec le PHP du serveur : exactement celui de la prod.
      composer install --no-dev --no-scripts --optimize-autoloader --classmap-authoritative \
        --no-interaction --no-progress --quiet
      php bin/console cache:clear --no-interaction
      php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration --all-or-nothing
    )
    # À la création du domaine, cPanel crée « courante/public » comme un vrai dossier : on le met de côté.
    if [ -e courante ] && [ ! -L courante ]; then
      mv courante "courante-creee-par-cpanel-$VERSION"
      echo "Le dossier courante créé par cPanel est mis de côté : courante-creee-par-cpanel-$VERSION"
    fi
    basculer_sur "$VERSION"
    trap - ERR
    echo "En ligne : version $VERSION"
    ls -1d versions/*/ | sort | head -n -"$GARDER" | while read -r ancienne; do
      rm -rf "$ancienne"
      echo "Ancienne version supprimée : $ancienne"
    done
    ;;

  retour)
    [ -L courante ] || { echo "Aucune version en ligne."; exit 1; }
    actuelle="$(basename "$(readlink courante)")"
    precedente="$(ls -1d versions/*/ | sed 's#^versions/##; s#/$##' | sort | grep -B1 -x "$actuelle" | head -n 1)"
    [ -n "$precedente" ] && [ "$precedente" != "$actuelle" ] || { echo "Pas de version plus ancienne que $actuelle."; exit 1; }
    basculer_sur "$precedente"
    echo "Retour à la version $precedente (au lieu de $actuelle). La base de données n'est pas ramenée en arrière."
    ;;

  *)
    echo "Action inconnue : $ACTION"
    exit 1
    ;;
esac
