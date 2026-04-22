#!/usr/bin/env bash
# build-tiles.sh
# Genera vector tiles (MBTiles + directorio .pbf) desde los GeoJSONs del proyecto.
#
# Requisitos: tippecanoe, tile-join (incluido con tippecanoe), jq (opcional)
# Instalación rápida:
#   macOS:  brew install tippecanoe jq
#   Ubuntu: sudo apt-get install -y tippecanoe jq
#   Manual: https://github.com/felt/tippecanoe#installation

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ── dependencias ────────────────────────────────────────────────────────────
if ! command -v tippecanoe &>/dev/null; then
  echo "ERROR: tippecanoe no está instalado."
  echo ""
  echo "  macOS:   brew install tippecanoe"
  echo "  Ubuntu:  sudo apt-get install -y tippecanoe"
  echo "  Manual:  https://github.com/felt/tippecanoe#installation"
  exit 1
fi

USE_JQ=0
if command -v jq &>/dev/null; then
  USE_JQ=1
else
  echo "AVISO: jq no encontrado — los nombres de campos no se normalizarán."
  echo "  macOS:  brew install jq"
  echo "  Ubuntu: sudo apt-get install -y jq"
fi

echo "tippecanoe $(tippecanoe --version 2>&1 | head -1)"
echo ""

# ── verificar archivos fuente ────────────────────────────────────────────────
YEARS=(1980 1990 2000 2010 2020)
for YR in "${YEARS[@]}"; do
  FILE="${YR}_Ligth.geojson"
  if [[ ! -f "$FILE" ]]; then
    echo "ERROR: Falta el archivo $FILE"
    exit 1
  fi
  echo "  OK  $FILE ($(du -sh "$FILE" | cut -f1))"
done
echo ""

# ── preparar archivos normalizados ──────────────────────────────────────────
# Normaliza el campo de categoría de densidad a 'dens_cat' en todos los años.
# Los archivos originales usan nombres distintos: Dens_Cat / Densi_Cat / Dens_cat / dens_cat
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

for YR in "${YEARS[@]}"; do
  SRC="${YR}_Ligth.geojson"
  DST="$TMP/year_${YR}.geojson"

  if [[ $USE_JQ -eq 1 ]]; then
    jq '
      .features |= map(
        .properties.dens_cat = (
          .properties.dens_cat //
          .properties.Dens_cat //
          .properties.Dens_Cat //
          .properties.Densi_Cat //
          ""
        ) |
        .properties = { dens_cat: .properties.dens_cat }
      )
    ' "$SRC" > "$DST"
  else
    cp "$SRC" "$DST"
  fi
done

echo "Procesando tippecanoe..."

# ── generar MBTiles ──────────────────────────────────────────────────────────
# Parámetros óptimos para polígonos de huella urbana (GHSL) a escala provincial:
#   -Z5  -z14  → rango de zoom útil: vista de provincia (5) hasta detalle local (14)
#   --no-feature-limit        → solo 5 features por source-layer, no limitar
#   --no-tile-size-limit      → tiles pueden ser grandes en zoom alto
#   --simplification=8        → simplificar geometría (default 1); 8 es agresivo pero
#                               estos son polígonos de píxeles raster, no límites precisos
#   --coalesce-densest-as-needed → fusiona features adyacentes si el tile se satura
#   Los source-layers toman el nombre del archivo sin extensión: year_1980 … year_2020
tippecanoe \
  -o cordoba_urbana.mbtiles \
  --minimum-zoom=5 \
  --maximum-zoom=14 \
  --no-feature-limit \
  --no-tile-size-limit \
  --simplification=8 \
  --coalesce-densest-as-needed \
  --force \
  "$TMP/year_1980.geojson" \
  "$TMP/year_1990.geojson" \
  "$TMP/year_2000.geojson" \
  "$TMP/year_2010.geojson" \
  "$TMP/year_2020.geojson"

echo "  → cordoba_urbana.mbtiles generado"
echo ""

# ── extraer a directorio de tiles estáticos ─────────────────────────────────
rm -rf tiles/
echo "Extrayendo a tiles/ ..."
tile-join \
  --no-tile-size-limit \
  --force \
  -e tiles/ \
  cordoba_urbana.mbtiles

TILE_COUNT=$(find tiles/ -name "*.pbf" | wc -l | tr -d ' ')
TILES_SIZE=$(du -sh tiles/ | cut -f1)

echo ""
echo "Listo."
echo "  MBTiles:  cordoba_urbana.mbtiles"
echo "  Tiles:    tiles/  ($TILE_COUNT archivos .pbf, $TILES_SIZE)"
echo "  Capas:    year_1980  year_1990  year_2000  year_2010  year_2020"
echo ""
echo "Para testear localmente:"
echo "  python3 -m http.server 8000"
echo "  Abrir: http://localhost:8000"
