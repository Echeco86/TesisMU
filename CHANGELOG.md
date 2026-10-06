# Changelog

Cambios del sitio *Transformaciones Territoriales* (https://expansionurbana.vercel.app/).
Ningún cambio modifica valores analíticos: `DATA` y `MUNICIPIOS_GJ` se verifican idénticos a `main` antes de cada commit.

## Tanda 1 · Lo que se veía roto (rama `fix/tanda-1`)

### Mapa
- **Mapa base**: las teselas de Carto (marca de agua "API KEY REQUIRED") se reemplazan por el estilo vectorial libre OpenFreeMap *positron*, sin rótulos y con fondo crema. Atribución: OpenFreeMap · OpenMapTiles · colaboradores de OpenStreetMap. Si el estilo no responde en 5 s, el mapa arranca sobre un fondo liso crema y sigue andando.
- Las capas propias (municipios, densidad, hover, selección) siguen arriba del mapa base. Un solo control de atribución.
- **Vista 3D**: sin teselas raster externas; la base son los ejidos municipales en crema. La selección y el año siguen sincronizados.
- Guarda contra cargas duplicadas de una capa de año; los años activados antes de que termine de cargar el mapa se respetan.
- **Móvil (< 768 px)**: los cuatro gráficos por localidad aparecen debajo del mapa y la ficha va primero en la hoja inferior. "Ver análisis →" hace scroll hasta los gráficos (en escritorio vuelve al primero y marca la columna). Gestos cooperativos: un dedo scrollea la página y dos mueven el mapa.
- Ticks del eje X en los cinco cortes; población rotulada con el año de censo.

### Textos, unidades y formato
- **Densidad**: "hab/km²" (7 apariciones) pasa a "Densidad construida (m² BU/píxel)".
- **Cortes**: población = censos 1980 · 1991 · 2001 · 2010 · 2022; superficie = GHSL 1980–2020. Se unificaron cabecera, pie, ficha (antes decía "Pob. 2020" con dato del censo 2022), tabla, comparador y regional. Hay una nota visible sobre el desfase en la intro, en Metodología y en la ficha.
- "2002–2010" pasa a "Década 2000–2010" (los datos no tienen corte en 2002).
- Valles Turísticos: el +388 % es crecimiento total de la mancha urbana, no per cápita (intro y conclusión 3).
- Patrones: nota al pie con la cantidad de localidades sin clasificar y el motivo.
- Scatter "Crecimiento poblacional vs. Expansión superficial": el eje X arranca en −100 %.
- **Formato es-AR** con `Intl.NumberFormat('es-AR')` en porcentajes, tasas, ejes y textos ("2,1 M → 3,7 M", "806 → 1.566", "Ciudades +50.000").
- **Nombres**: localidades y departamentos con grafía oficial para mostrar (`NOMBRE_VIS`, `DEPTO_VIS`); la clave original queda intacta para los joins. Las búsquedas no distinguen tildes. Tabla de revisión: `docs/equivalencias-nombres.csv`.
- **Superficie en hectáreas** (1 píxel GHSL = 1 ha) en ficha, tabla, comparador, ejes y CSV; "píxel" queda en Metodología y en la unidad de densidad.

### Portada y estructura
- Título de portada con `clamp()` y `overflow-wrap`: ya no se sale a 375 px.
- Se elimina el script `/cdn-cgi/.../email-decode.min.js` (404 en cada carga); los `mailto` son enlaces planos y siguen funcionando.
- Se restaura el selector `.sp-foot`, que estaba borrado.
- Grillas de gráficos con `min-width:0`: en móvil las tarjetas ya no quedan recortadas. La tabla de Metodología ajusta el texto en tablet.

### Metadatos
- `og:url`, `<link rel="canonical">` y la `url` del JSON-LD apuntan a https://expansionurbana.vercel.app/.
- Nuevos: `favicon.svg`, `robots.txt`, `sitemap.xml` y `theme-color`.

## Tanda 2 · Rendimiento, móvil y accesibilidad (rama `perf/tanda-2`)

### Capas y caché
- **Capas de densidad v2** (`{año}_v2.geojson`), regeneradas con mapshaper:
  - Coordenadas con 5 decimales y Douglas-Peucker con tolerancia de 2 m: solo saca vértices colineales, la grilla de 100 m se conserva y el área por clase cambia ≤ 0,01 %.
  - Propiedad única `dens_cat` con las clases de la leyenda (Muy Baja … Muy Alta).
  - Peso total de 99,9 MB a 43,5 MB (gzip: de 30,1 MB a 9,0 MB); 2020 pasa de 34,2 MB a 14,8 MB.
  - Desaparece el dibujo en triángulos que se veía a zoom alto con la geometría original.
  - Se regeneran con `tools/build-capas.sh`.
- **Archivos separados**: `index.html` (HTML + CSS, 94 KB; antes 735 KB), `assets/app.v1.js` (100 KB) y `assets/data.v1.js` (562 KB). Verificado sección por sección con un smoke test de interacciones.
- **`vercel.json`**: `Cache-Control: public, max-age=31536000, immutable` para `{año}_vN.geojson` y `assets/`. Regla: si un archivo con versión cambia de contenido, cambia de nombre (`tools/bump-asset.sh`).
- **`.vercelignore`**: no se publican `tiles/` (44 MB sin uso), `tools/`, `docs/` ni scripts.

### Imágenes y SRI
- **WebP**: portada de 1600 px (de 409 KB a 64 KB; no se descarga en ≤ 720 px, donde está oculta) y foto de autor de 600 px (de 407 KB a 33 KB, `loading="lazy"`). Los JPG quedan como respaldo y para `og:image`.
- **SRI** (`integrity` + `crossorigin`) en Chart.js, MapLibre (JS y CSS) y deck.gl. Chart.js pasa de cdnjs a unpkg (`chart.umd.js` del paquete oficial) para que el hash sea verificable.

### Color y gráficos
- **Paleta de 9 regiones** desde una sola constante, `REGION_COLORS`: gráficos, tablas, chips y comparador.
  - Validada para daltonismo: pares adyacentes con ΔE ≥ 19,9 y todos contra todos con ΔE ≥ 9,7 (CVD).
  - A ΔE ≥ 15 de los colores de año y con contraste ≥ 3:1 sobre blanco.
  - Chips con texto en tinta y barra lateral de color.
- **Escala Base 100 (1980)** por defecto en la evolución regional y el Comparador, con opción absoluta.
- **Leyenda que aísla regiones**: al pasar el mouse por una, se atenúan las demás (scatters, evolución de densidad, evolución regional).
- "Trayectoria individual" arranca con Villa Carlos Paz; corregido su subtítulo.
- **Sliders** del mapa y del scatter animado con estilo propio y el color del año; el mapa tiene encabezado "Capa · Opacidad".

### Mapa
- Selección con contorno grueso (borde blanco + tinta), sin relleno gris; hover con línea fina.
- **Rampa de densidad** por año en OKLCH, de L 0,73 a 0,41, validada como rampa ordinal.
- **Contorno provincial** sobre la densidad, tomado de la capa `boundary` de OpenMapTiles; acepta un GeoJSON oficial vía `PROVINCIA_URL`.
- En móvil, la hoja de capas arranca colapsada y se despliega al elegir un municipio.

### Accesibilidad
- Etiqueta o `aria-label` en todos los controles (0 sin nombre accesible) y un solo `<h1>`.
- Chips de año como `<button>` con `aria-pressed`.
- Los 21 gráficos tienen `role="img"` y `aria-label` con su conclusión, recalculada en cada redibujo.
- **`prefers-reduced-motion`**: sin animaciones CSS ni de Chart.js. Las tarjetas de la intro son visibles por defecto (antes podían quedar en blanco).
- Tabla regional con la primera columna fija y aviso de scroll horizontal.

### PMTiles (rama `exp/pmtiles`, mergeada)
- El mapa 2D lee las capas de densidad desde `capas/{año}_v1.pmtiles` (tippecanoe, z5–z12) por HTTP Range: la primera vista baja **134 KB** en lugar de ~3 MB con gzip. Medición en `docs/evaluacion-pmtiles.md`.
- Respaldo automático: si la librería no carga o las teselas fallan (servidor sin Range), se usan los GeoJSON v2. La vista 3D usa siempre GeoJSON.
- Se eliminan `tiles/` (44 MB, 8.634 .pbf sin uso), `build-tiles.sh` y `README_MIGRACION.md`. Regeneración: `tools/build-capas.sh` + `tools/build-pmtiles.sh`.

### Capa 1990 real
- La capa 1990 era una copia exacta de la de 1980. Se regenera desde el GeoJSON de píxeles GHSL 1990 (93.791 píxeles en EPSG:22174 con su valor BU en `DN`):
  - Clasificación con los cortes de Metodología (el valor del corte va a la clase inferior, como en QGIS).
  - Unión de píxeles por clase, reproyección a WGS84, 5 decimales.
  - Archivos nuevos: `1990_v3.geojson` (6,7 MB) y `capas/1990_v2.pmtiles`.
- Validación contra `DATA`:
  - 93.791 píxeles, igual al total de 1990.
  - 425 de 427 localidades con el mismo conteo y la misma densidad media (las 8 sin superficie en 1990 también dan 0). Las dos restantes, Valle Hermoso y Casa Grande, se intercambian 2 píxeles de borde.
  - Superficie creciente 1980 → 1990 → 2000 (86.550 → 92.579 → 110.597 ha) y misma grilla que los otros años (distancia mediana entre vértices: 0 m).
- La versión de cada capa queda en `DENS_GEOJSON_VER` / `DENS_TILES_VER`. Script reproducible: `tools/build-capa-pixeles.sh`.


## Tanda 3 · Funciones nuevas (rama `feat/tanda-3`)

Primero se sube `assets/app.v1.js` a `app.v2.js`, porque la v1 ya está en producción con caché immutable.

- **Estado en la URL**: `#seccion`, `#mapa/loc=villa-carlos-paz`, `#comparador/loc=a,b,c` y `#comparador/reg=a,b,c`.
  - Atrás y Adelante funcionan.
  - Los enlaces directos saltean la portada.
  - La ficha tiene un botón "Copiar enlace".
  - Los slugs salen del nombre con tildes; los 427 son únicos.
- **Ficha imprimible** (A4, una página): mini mapa (captura del mapa o contorno SVG), recuadro de la provincia, patrón, ranking, indicadores por corte, comparación con la región y pie con fuentes, cita y enlace.
- **Comparador deslizante 1980 | 2020**: dos mapas sincronizados recortados con `clip-path`; el divisor se arrastra con mouse, con el dedo o con el teclado. Implementación propia, sin dependencias nuevas.
- **Coroplético** de los 427 municipios por patrón, variación de población o LCRPGR, con leyenda, conteos y tooltip.
  - Escalas validadas: rampa ordinal para los patrones y escalas divergentes con neutro gris.
  - "Dispersión intensa" y "En declive" ya no comparten casi el mismo color; el patrón se muestra como chip con texto en tinta.
- **Ranking** en la ficha: puesto en la provincia y percentil en la región para población, superficie, densidad y núcleos.
- **Cómo citar**: citas APA 7 de la tesis (handle) y del panel con botón para copiar, licencia CC BY 4.0 (placeholder a confirmar) y licencias de las fuentes. El JSON-LD queda como `Dataset` (variables con unidades, fuentes, 5 descargas) + `ScholarlyArticle`.
- **Glosario (i)** para BU, núcleos, LCRPGR y cada patrón, con definición y fórmula tomadas de Metodología y de `clasificarPatron`. Popover accesible.
- **Rendimiento y accesibilidad de cierre**:
  - Scripts con `defer`; Google Fonts y el CSS de MapLibre sin bloquear (preload + noscript); preconnect a fuentes.
  - Las cifras grandes de la intro usan tonos del año con contraste ≥ 4,5:1.

## Verificación final

- `grep "hab/km"` en HTML, JS y JSON publicados: **0 apariciones**.
- **Consola**: sin errores en las 8 secciones × 3 tamaños (1440×900, 768×1024, 375×812), incluidos el 3D, la ficha y "Ver análisis". Solo quedan fallos de red del entorno de prueba (OpenFreeMap y Google Fonts bloqueados) y teselas que MapLibre cancela al cambiar de vista.
- **Datos**: `DATA` y `MUNICIPIOS_GJ` idénticos al original (`54ac153`) en cada commit.
- **Lighthouse móvil** (local, misma red y CDN servidas localmente en las dos versiones; mediana de 3 corridas):

  | | Original (`54ac153`) | Tanda 3 |
  |---|---|---|
  | Performance | 61 | **98** |
  | Accessibility | 100* | **100** |
  | SEO | 100 | **100** |
  | FCP | 5,0 s | 1,0 s |
  | LCP | 9,2 s | 1,7 s |
  | Total Blocking Time | 93 ms | 83 ms |
  | Peso transferido, primera carga | **1.422 KiB** (16 pedidos) | **694 KiB** (18 pedidos) |

  \* En el original, las tarjetas de la intro estaban ocultas (`opacity:0`) y Lighthouse no evaluaba su contraste.

- **Mayores ahorros de la primera carga**: la portada pasa de 409 KiB a 0 en móvil (64 KiB en escritorio), la foto del autor de 407 KiB a 0 (carga diferida) y el HTML de 183 KiB a 28 KiB (más `data` 138 KiB + `app` 43 KiB, cacheables por un año).
- **Primera apertura del mapa** (capa 2020): de ~10 MB con gzip (34 MB sin comprimir) a **134 KB** con PMTiles.
