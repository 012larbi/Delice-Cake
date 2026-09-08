#!/usr/bin/env bash
# Applique la configuration CORS (cors.json) au bucket Firebase Storage.
#
# Prérequis : Google Cloud SDK installé + authentifié
#   gcloud auth login
#   gcloud config set project immobilier-b65b5
#
# Usage :  bash scripts/apply-cors.sh
set -euo pipefail

BUCKET="gs://immobilier-b65b5.firebasestorage.app"
CORS_FILE="$(dirname "$0")/../cors.json"

echo "→ Bucket : $BUCKET"
echo "→ Fichier: $CORS_FILE"

if command -v gcloud >/dev/null 2>&1; then
  gcloud storage buckets update "$BUCKET" --cors-file="$CORS_FILE"
  echo
  echo "Vérification :"
  gcloud storage buckets describe "$BUCKET" --format="yaml(cors_config)"
elif command -v gsutil >/dev/null 2>&1; then
  gsutil cors set "$CORS_FILE" "$BUCKET"
  echo
  echo "Vérification :"
  gsutil cors get "$BUCKET"
else
  echo "Erreur : ni 'gcloud' ni 'gsutil' trouvés dans le PATH." >&2
  echo "Installez le Google Cloud SDK ou utilisez Cloud Shell." >&2
  exit 1
fi

echo
echo "CORS appliqué. Videz le cache navigateur (ou attendez ~1 min) puis retestez."
