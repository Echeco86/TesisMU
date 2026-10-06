# Capas de densidad: GeoJSON v2 vs. PMTiles

Medido en local (Chromium, 1440×900) con las mismas capas v2 (5 decimales, `dens_cat` normalizado).
Escenario: abrir el mapa con la capa 2020 a escala provincial y después hacer zoom a Villa Carlos Paz.

| | GeoJSON v2 (rama `perf/tanda-2`) | PMTiles (rama `exp/pmtiles`) |
|---|---|---|
| Peso en el repo (5 años) | 43,5 MB | 13,6 MB (+ GeoJSON v2 para la vista 3D) |
| Primera vista, capa 2020 | **14,8 MB** sin comprimir · ~3,1 MB con gzip (Vercel comprime al vuelo) · 1 pedido | **134 KB** · 5 pedidos |
| Zoom a Villa Carlos Paz | 0 (ya estaba todo descargado) | +1,37 MB · 29 pedidos |
| Tiempo hasta ver la capa (local) | ~2,4 s (descarga + parseo de 14,8 MB en el hilo principal) | ~1,2 s |
| Librería extra | — | `pmtiles@3.2.1` (52 KB, 12,5 KB con gzip), con SRI |
| Vista 3D (deck.gl) | GeoJSON | sigue usando GeoJSON (se baja solo al activar 3D) |
| Requisitos del hosting | ninguno | HTTP Range (Vercel lo soporta en archivos estáticos) |
| Regenerar | `tools/build-capas.sh` (mapshaper) | `tools/build-capas.sh` + `tools/build-pmtiles.sh` (tippecanoe) |

**Por qué PMTiles transfiere menos:** baja solo las teselas de la vista y del zoom actual, ya comprimidas
y simplificadas por nivel. Con GeoJSON el navegador baja y parsea la capa entera aunque se mire una sola
localidad. En móviles con datos limitados es la diferencia entre ~3 MB por año activado y ~0,1–1,5 MB.

## Recomendación

**PMTiles.** La primera vista baja de ~3 MB (con gzip) a 134 KB por año y el mapa responde antes,
sobre todo en móvil. Lo que cuesta: una librería de 12,5 KB, un paso más con tippecanoe al regenerar
y mantener los GeoJSON v2 solo para la vista 3D.

Antes de mergear: verificar en el preview de Vercel que `capas/*.pmtiles` responde `206 Partial Content`
(`curl -r 0-99 -I https://…/capas/2020_v1.pmtiles`).

En esta rama también se eliminan `tiles/` (44 MB, 8.634 .pbf que el sitio nunca cargaba), `build-tiles.sh`
y `README_MIGRACION.md`, que documentaban ese intento anterior.
