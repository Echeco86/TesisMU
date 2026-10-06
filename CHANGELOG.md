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
