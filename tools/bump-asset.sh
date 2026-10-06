#!/usr/bin/env bash
# Sube la versión de un archivo con caché immutable y actualiza sus referencias en index.html.
# Uso: tools/bump-asset.sh assets/app.v1.js      → assets/app.v2.js
#      tools/bump-asset.sh 2020_v2.geojson       → 2020_v3.geojson (actualizar también densLayerUrl en app)
# Regla: todo archivo en assets/ o {año}_vN.geojson se sirve con max-age de 1 año;
# si cambia su contenido, TIENE que cambiar su nombre.
set -euo pipefail
cd "$(dirname "$0")/.."
F="$1"
[[ -f "$F" ]] || { echo "No existe $F"; exit 1; }
if [[ "$F" =~ ^(.*[._]v)([0-9]+)(\.[a-z0-9]+)$ ]]; then
  NEW="${BASH_REMATCH[1]}$((BASH_REMATCH[2]+1))${BASH_REMATCH[3]}"
else
  echo "El nombre no tiene versión (.vN o _vN): $F"; exit 1
fi
git mv "$F" "$NEW"
OLD_BASE="${F#./}"; NEW_BASE="${NEW#./}"
grep -rl --include=index.html --include='*.js' -F "$OLD_BASE" . 2>/dev/null | grep -v node_modules | while read -r f; do
  sed -i "s#${OLD_BASE//./\\.}#${NEW_BASE}#g" "$f"; echo "actualizado: $f"
done
echo "$F → $NEW"
