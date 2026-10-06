#!/usr/bin/env bash
# Regenera las capas de densidad {año}_v2.geojson desde los GeoJSON originales de QGIS.
# Uso: tools/build-capas.sh carpeta_con_originales   (archivos {año}_Ligth.geojson)
# Requiere: npx mapshaper (npm i -g mapshaper)
#  - normaliza la propiedad a dens_cat con las clases de la leyenda (Muy Baja … Muy Alta)
#  - simplifica solo vértices colineales (Douglas-Peucker, tolerancia 2 m): conserva la grilla de 100 m
#  - escribe coordenadas con 5 decimales (~1 m)
set -euo pipefail
SRC="${1:?carpeta con los {año}_Ligth.geojson originales}"
DIR="$(cd "$(dirname "$0")" && pwd)"
for Y in 1980 1990 2000 2010 2020; do
  npx --yes mapshaper -i "$SRC/${Y}_Ligth.geojson" \
    -each "$(cat "$DIR/norm-dens-cat.js")" \
    -simplify dp interval=2 keep-shapes \
    -o "$DIR/../${Y}_v2.geojson" precision=0.00001
done
