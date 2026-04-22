# Migración de Leaflet → MapLibre GL JS con Vector Tiles

Este documento explica cómo generar los vector tiles y desplegar el proyecto
después de la migración del mapa de Leaflet a MapLibre GL JS.

---

## Arquitectura del mapa

| Componente | Antes | Después |
|---|---|---|
| Motor de mapa | Leaflet 1.9 | **MapLibre GL JS 4.7** |
| Datos de huella urbana | GeoJSON descargado por fetch | **Vector tiles locales** (`tiles/`) |
| Límites municipales | Leaflet GeoJSON layer | GeoJSON source inline de MapLibre |
| Token requerido | No | **No** (MapLibre es open-source) |

### Source-layers en los tiles

| Layer | Año | Propiedad clave |
|---|---|---|
| `year_1980` | 1980 | `dens_cat` |
| `year_1990` | 1990 | `dens_cat` |
| `year_2000` | 2000 | `dens_cat` |
| `year_2010` | 2010 | `dens_cat` |
| `year_2020` | 2020 | `dens_cat` |

Valores posibles de `dens_cat`: `Muy Baja / Baja / Media / Alta / Muy Alta`
(el script normaliza los nombres de campo originales inconsistentes).

---

## Parte 1 — Instalar dependencias

### tippecanoe

tippecanoe convierte GeoJSON en MBTiles y directorios de tiles estáticos.

```bash
# macOS
brew install tippecanoe

# Ubuntu / Debian
sudo apt-get install -y tippecanoe

# Compilar desde fuente (cualquier SO)
git clone https://github.com/felt/tippecanoe.git
cd tippecanoe && make -j && sudo make install
```

### jq (opcional, pero recomendado)

Normaliza los nombres de campo de densidad entre años.

```bash
brew install jq          # macOS
sudo apt-get install jq  # Ubuntu
```

---

## Parte 2 — Generar los tiles

Desde la raíz del repositorio:

```bash
chmod +x build-tiles.sh
./build-tiles.sh
```

El script:
1. Verifica que tippecanoe esté instalado
2. Normaliza el campo `dens_cat` en los 5 GeoJSONs (requiere jq)
3. Genera `cordoba_urbana.mbtiles` con 5 source-layers (`year_1980` … `year_2020`)
4. Extrae los tiles a `tiles/` como archivos `.pbf` estáticos

Salida esperada:

```
tippecanoe X.XX.X
  OK  1980_Ligth.geojson (13M)
  ...
Procesando tippecanoe...
Extrayendo a tiles/ ...

Listo.
  MBTiles:  cordoba_urbana.mbtiles
  Tiles:    tiles/  (NNN archivos .pbf, XX MB)
  Capas:    year_1980  year_1990  year_2000  year_2010  year_2020
```

> **Nota**: `tiles/` y `cordoba_urbana.mbtiles` están en `.gitignore`.
> Debés generarlos en cada entorno de despliegue (ver Parte 4).

---

## Parte 3 — Testear localmente

Los archivos `.pbf` deben servirse desde un servidor HTTP (no abre como `file://`).

```bash
# Python (sin instalación adicional)
python3 -m http.server 8000

# Node.js
npx serve .

# Visitar
open http://localhost:8000
```

El mapa cargará los tiles desde `http://localhost:8000/tiles/{z}/{x}/{y}.pbf`.

### Si los tiles no cargan

- Abrí la consola del navegador (F12) y buscá errores de red en la pestaña Network
- Verificá que el directorio `tiles/` exista y tenga archivos `.pbf`
- Verificá que estés sirviendo desde la raíz del proyecto (no desde un subdirectorio)

---

## Parte 4 — Despliegue

### Opción A: Vercel (recomendada)

Agregá un `build` command en Vercel para que los tiles se generen en cada deploy:

1. En el dashboard de Vercel → tu proyecto → Settings → Build & Development Settings
2. **Build Command**: `./build-tiles.sh`
3. **Output Directory**: `.` (raíz del proyecto)
4. Asegurate de que tippecanoe esté disponible en el entorno de build de Vercel.
   Vercel usa Ubuntu; podés instalar tippecanoe con un script de build:

```bash
# vercel-build.sh (usar como Build Command en Vercel)
#!/usr/bin/env bash
set -e
# Instalar tippecanoe si no está disponible
if ! command -v tippecanoe &>/dev/null; then
  apt-get install -y tippecanoe 2>/dev/null || \
  (git clone https://github.com/felt/tippecanoe.git /tmp/tpc && \
   cd /tmp/tpc && make -j && make install)
fi
./build-tiles.sh
```

### Opción B: GitHub Actions (CI/CD automático)

Creá `.github/workflows/tiles.yml`:

```yaml
name: Build tiles
on:
  push:
    branches: [main]
    paths:
      - '*_Ligth.geojson'
      - 'build-tiles.sh'

jobs:
  tiles:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install tippecanoe & jq
        run: sudo apt-get install -y tippecanoe jq

      - name: Generate tiles
        run: chmod +x build-tiles.sh && ./build-tiles.sh

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
          exclude_assets: '*.geojson,*.sh'
```

### Opción C: Commit manual de tiles (dataset pequeño)

Si los tiles generados son pequeños (< 100 MB total), podés commitearlos:

```bash
# Quitar tiles/ del .gitignore temporalmente
echo "" >> .gitignore  # no hacer esto — mejor:

git add tiles/ cordoba_urbana.mbtiles
git commit -m "Agregar vector tiles generados"
git push
```

Luego habilitar GitHub Pages desde Settings → Pages → Source: `main` branch.

---

## Referencia rápida de comandos

```bash
# Generar tiles desde cero
./build-tiles.sh

# Servir localmente
python3 -m http.server 8000

# Verificar estructura de tiles
find tiles/ -name "*.pbf" | head -20
ls tiles/           # zoom levels disponibles

# Inspeccionar un tile (requiere protoc o mbview)
tippecanoe-decode tiles/7/38/56.pbf 7 38 56 | head -40
```

---

## Notas sobre los datos

Los archivos `*_Ligth.geojson` contienen la **huella urbana construida** (GHSL —
Global Human Settlement Layer) de la provincia de Córdoba, clasificada en
5 categorías de densidad construida (Muy Baja → Muy Alta). Cada archivo tiene
5 geometrías MultiPolygon (una por categoría), con hasta ~730 000 vértices en
el año 2020, de ahí la necesidad de vector tiles con simplificación automática
por nivel de zoom.

Los límites de los 427 municipios y comunas (`MUNICIPIOS_GJ`) están embebidos
inline en `index.html` y se usan como capa de interacción (hover/click). Los
datos estadísticos temporales (`DATA`) también están inline.
