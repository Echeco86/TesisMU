#!/usr/bin/env bash
# Genera capas/{año}_vN.pmtiles desde {año}_v2.geojson (una capa "densidad" por archivo).
# Requiere tippecanoe ≥ 2.17 (escribe .pmtiles directo). Si cambia el contenido, subir la versión
# del nombre (tools/bump-asset.sh) y actualizar densTilesUrl() en assets/app.vN.js.
set -euo pipefail
cd "$(dirname "$0")/.."
V="${1:-v1}"
mkdir -p capas
for Y in 1980 1990 2000 2010 2020; do
  tippecanoe -q -o "capas/${Y}_${V}.pmtiles" -l densidad -Z5 -z12 \
    --simplification=2 --detect-shared-borders \
    --coalesce-densest-as-needed --extend-zooms-if-still-dropping \
    --force "${Y}_v2.geojson"
done
ls -l capas/
