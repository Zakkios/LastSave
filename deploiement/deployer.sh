#!/usr/bin/env bash
# Met LastSave en ligne sur le serveur o2switch, par SSH (même fonctionnement que dev-irremplacable).
# À lancer depuis la racine du dépôt :
#   npm run deploy                  prépare le paquet, l'envoie, l'installe et bascule dessus
#   npm run deploy:retour           revient à la version précédente (la base n'est pas ramenée en arrière)
#   npm run deploy -- --paquet      prépare seulement le paquet, sans rien envoyer (essai local)
#
# Le site en ligne correspond toujours à un commit poussé sur GitHub, avec une CI verte : le script
# refuse de partir sinon. Il ne lit ni n'affiche aucun secret : ceux de production sont sur le
# serveur, dans partage/.env.local et partage/jwt/.
set -euo pipefail

# Git Bash convertit les chemins qui ressemblent à des chemins Unix ; rien ici ne doit l'être.
export MSYS_NO_PATHCONV=1

RACINE="${RACINE:-$(cd "$(dirname "$0")/.." && pwd)}"
ICI="$RACINE/deploiement"
PAQUET="$ICI/paquet"
cd "$RACINE"

etape() { printf '\n== %s\n' "$*"; }
echec() { printf '\nÉCHEC : %s\n' "$*" >&2; exit 1; }

charger_config() {
  [ -f "$ICI/config" ] || echec "il manque deploiement/config : copie deploiement/config.exemple sous ce nom, puis remplis-le."
  # shellcheck source=/dev/null
  . "$ICI/config"
  : "${SSH_CIBLE:?SSH_CIBLE manque dans deploiement/config}"
  : "${DOSSIER_DISTANT:?DOSSIER_DISTANT manque dans deploiement/config}"
  : "${URL_SITE:?URL_SITE manque dans deploiement/config}"
}

# Lance installer-version.sh sur le serveur : $1 = action, $2 = version éventuelle.
sur_le_serveur() {
  ssh -o ConnectTimeout=20 "$SSH_CIBLE" "bash -s -- '$DOSSIER_DISTANT' $*" < "$ICI/installer-version.sh"
}

verifier_depot() {
  etape "Vérification du dépôt"
  [ -z "$(git status --porcelain)" ] || echec "des modifications ne sont pas commitées : le site en ligne doit correspondre à un commit."
}

verifier_github() {
  etape "Vérification de GitHub : commit poussé, CI verte"
  git fetch --quiet origin main
  [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] \
    || echec "ce commit n'est pas celui de origin/main : pousse (ou récupère) d'abord."
  command -v gh > /dev/null || echec "gh (GitHub CLI) est introuvable."
  ci="$(gh run list --commit "$(git rev-parse HEAD)" --workflow ci.yml --limit 1 \
    --json status,conclusion --jq '.[0] | "\(.status) \(.conclusion)"' 2> /dev/null || true)"
  case "$ci" in
    "completed success") echo "CI verte." ;;
    "") echec "aucune CI trouvée pour ce commit." ;;
    completed*) echec "la CI de ce commit n'est pas verte ($ci)." ;;
    *) echec "la CI de ce commit n'est pas terminée ($ci) : réessaie dans un instant." ;;
  esac
}

preparer_paquet() {
  commit="$(git rev-parse --short HEAD)"
  VERSION="$(date -u +%Y%m%d-%H%M%S)-$commit"
  rm -rf "$PAQUET"
  mkdir -p "$PAQUET/site"

  etape "Code du back-end, tel qu'au commit $commit"
  git archive --format=tar "HEAD:backend" | tar -x -C "$PAQUET/site"

  etape "Front compilé (Vite), posé dans public/"
  npm --prefix frontend run build > /dev/null
  cp -r frontend/dist/. "$PAQUET/site/public/"
  rm -rf frontend/dist

  etape "Nettoyage : rien de ce qui ne sert qu'au développement"
  (cd "$PAQUET/site" && rm -rf .env.dev .editorconfig)
  # Garde-fous : aucun secret dans le paquet.
  [ ! -e "$PAQUET/site/.env.local" ] || echec "le paquet contient un .env.local : rien n'est envoyé."
  if find "$PAQUET/site" -name '*.pem' | grep -q .; then
    rm -rf "$PAQUET"
    echec "le paquet contient une clé (.pem) : rien n'est envoyé."
  fi
  printf '%s\n' "$VERSION" > "$PAQUET/site/VERSION"
  # Sans le propriétaire du poste Windows : sur le serveur, les fichiers appartiennent à qui les extrait.
  tar --force-local -czf "$PAQUET/$VERSION.tar.gz" --owner=0 --group=0 --numeric-owner -C "$PAQUET/site" .
  echo "Paquet prêt : deploiement/paquet/$VERSION.tar.gz ($(du -h "$PAQUET/$VERSION.tar.gz" | cut -f1))"
}

controler_site() {
  etape "Contrôle du site en ligne"
  code_api="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$URL_SITE/api/me" || true)"
  code_front="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$URL_SITE/" || true)"
  if [ "$code_api" = "401" ]; then
    echo "OK : l'API répond ($URL_SITE/api/me refuse l'accès sans être connecté : 401)."
  else
    echo "ATTENTION : $URL_SITE/api/me répond $code_api au lieu de 401."
  fi
  if [ "$code_front" = "200" ]; then
    echo "OK : le front répond ($URL_SITE/ : 200)."
  else
    echo "ATTENTION : $URL_SITE/ répond $code_front au lieu de 200."
  fi
}

case "${1:-}" in
  --paquet)
    verifier_depot
    preparer_paquet
    ;;
  --retour)
    charger_config
    etape "Retour à la version précédente"
    sur_le_serveur retour
    controler_site
    ;;
  "")
    charger_config
    verifier_depot
    verifier_github
    etape "Contrôles sur le serveur"
    sur_le_serveur preparer
    preparer_paquet
    etape "Envoi du paquet"
    scp -o ConnectTimeout=20 -q "deploiement/paquet/$VERSION.tar.gz" "$SSH_CIBLE:$DOSSIER_DISTANT/versions/"
    etape "Installation sur le serveur"
    sur_le_serveur installer "$VERSION"
    rm -rf "$PAQUET"
    controler_site
    ;;
  *)
    echec "option inconnue : $1 (possibles : --paquet, --retour)"
    ;;
esac
