#!/usr/bin/env bash
# Genera {año}_vN.geojson desde un GeoJSON con un polígono por píxel GHSL y su valor BU en DN
# (así vino la capa 1990: 93.791 píxeles en EPSG:22174, POSGAR 2007 faja 4).
# Uso: tools/build-capa-pixeles.sh entrada.geojson 1990 v3 [proj4 de origen]
#  - clasifica DN con los cortes de Metodología (tools/clasif-dn.js)
#  - une los píxeles por clase, reproyecta a WGS84, saca vértices colineales (2 m) y escribe 5 decimales
# Después: tippecanoe para el PMTiles (ver tools/build-pmtiles.sh) y actualizar DENS_*_VER en assets/app.vN.js.
set -euo pipefail
IN="${1:?entrada.geojson}"; Y="${2:?año}"; V="${3:?versión, p. ej. v3}"
SRC="${4:-+proj=tmerc +lat_0=-90 +lon_0=-63 +k=1 +x_0=4500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs}"
DIR="$(cd "$(dirname "$0")" && pwd)"
npx --yes mapshaper -i "$IN" -proj init="$SRC" -each "$(cat "$DIR/clasif-dn.js")" \
  -dissolve2 dens_cat -proj wgs84 -simplify dp interval=2 keep-shapes \
  -o "$DIR/../${Y}_${V}.geojson" precision=0.00001
