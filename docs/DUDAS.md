# Dudas pendientes

## Nuevas en la Tanda 3

G. **Años de las citas**: la cita APA usa 2024 para la tesis y para el panel (tomado del JSON-LD original). ¿Es el año de defensa o de publicación en el repositorio? El README dice 2025.
H. **Licencia CC BY 4.0**: placeholder visible en "Cómo citar" y en el JSON-LD (marcado con un comentario `PLACEHOLDER` en `index.html`). Confirmala o indicame otra.
I. **Colores de patrón**: la rampa nueva (Compacta → Dispersión intensa) y "En declive" en azul también cambian el gráfico de patrones del Análisis Exploratorio. Antes "Dispersión intensa" y "En declive" eran casi el mismo color.
J. **Rama `datos-1990`**: desde esta sesión no tengo permiso para borrar ramas en GitHub. Borrala en GitHub → Branches → ícono de papelera junto a `datos-1990`.
K. **Rama `vercel/install-and-configure-vercel-w-6a0ezx`**: la creó el bot de Vercel para instalar Web Analytics, que ya está activo en `main` (`/_vercel/insights/script.js`). Se puede cerrar o borrar.
L. **Lighthouse**: medido en local con la red del contenedor (Google Fonts lento o bloqueado y CDN servidas localmente). Conviene repetirlo en producción con PageSpeed Insights; los valores absolutos van a cambiar, la mejora relativa debería mantenerse.


## Nuevas en la Tanda 2

A. ~~**La capa 1990 era una copia de la de 1980**~~: **resuelto** con el GeoJSON de píxeles 1990. Quedan dos detalles menores del archivo fuente: Valle Hermoso (281 píxeles contra 283 en `DATA`) y Casa Grande (29 contra 27) se intercambian 2 píxeles de borde (por eso también difiere su densidad media). El resto coincide con `DATA`. No afecta el mapa.
B. **Contorno provincial**: hoy sale de la capa `boundary` (admin_level 4) del mapa base OpenFreeMap, así que en el modo de respaldo (sin mapa base) no aparece. Si me pasás el límite oficial (p. ej. de IDECOR) en GeoJSON, se carga con `PROVINCIA_URL` y se ve siempre.
C. **Rampa de 2020**: con más contraste de luminosidad, los pasos oscuros del naranja tiran a ocre y marrón (mismo tono, más oscuro). ¿Lo dejamos así o preferís menos contraste y más naranja?
D. **Paleta regional en scatters**: con 9 regiones no hay paleta que separe todos los pares a ΔE ≥ 15 en visión normal; el par más cercano es Ciudades +50.000 ↔ Valles Turísticos (ΔE 10,8). Lo compensan la leyenda que aísla regiones y el filtro de región. Si querés más separación, conviene agrupar regiones en los scatters.
E. ~~**PMTiles o GeoJSON**~~: **resuelto**, PMTiles mergeado en `perf/tanda-2` con respaldo automático a GeoJSON. Falta confirmar en el preview que `capas/*.pmtiles` responde `206` (si no, el sitio usa GeoJSON solo).
F. **Chart.js** se carga ahora desde unpkg en lugar de cdnjs, para poder verificar el SRI.

## De la Tanda 1

Ningún valor de `DATA` cambió: se corrigieron los textos para que digan lo que muestran los datos.

## Datos y textos

1. ~~**28 localidades sin patrón de crecimiento**~~: **resuelto**, se mantiene la nota del gráfico. Detalle: las 28 fallan por 1980. Sin población censada (20): La Rancherita, Villa Ciudad Parque Los Reartes, Las Cañadas, Chañar Viejo, Paso del Durazno, Villa Elisa, Dique Chico, Cuesta Blanca, Santa Elena, Candelaria Sud, Tala Cañada, Cabalango, Eufrasio Loza, Estancia Vieja, Colonia Prosperidad, Villa Candelaria Norte, Pozo Nuevo, Monte Leña, Villa Santa Cruz del Lago, Estación Juárez Celman. Sin superficie construida (5): Ranqueles, San Clemente, Cañada del Sauce, Leguizamón, San Gerónimo. Sin ninguna de las dos (3): Colonia Iturraspe, Colonia Anita, Los Talares.
2. ~~**LCRPGR, ¿40 o 42 años?**~~: **resuelto**, se mantiene t = 40 años para LCR y PGR. Se aclara en el subtítulo del gráfico y en el glosario (la población usa el censo 2022).
3. ~~**"+155 %" de expansión**~~: **resuelto**, ahora dice +154 % (`DATA.totals`: +154,49 %) en portada, intro y conclusión 1.
4. ~~**Valles Turísticos como "caso extremo"**~~: **resuelto**. Se mantiene como caso extremo por el aumento absoluto: +49.562 ha, el 37 % de lo que sumó la provincia. La conclusión 3 aclara que en términos relativos la superan la Región Oeste (+580 %) y la Región Centro (+435 %).
5. ~~**Conclusión 5**~~: **resuelto**. Los descensos de densidad citados son los de los datos: Región Oeste (−19 %), Región Sureste (−15 %) y Ciudades +50.000 (−11 %). Valles sube (+9 %), aunque sigue entre las densidades más bajas (987 m² BU/píxel).
6. ~~**Punto de inflexión**~~: **resuelto**, reformulado. En 2000–2010 la expansión se despega de la población (2,5 veces su ritmo, contra 1,4 en 1990–2000), y 2010–2020 es la década de mayor ritmo (4,05 % anual).
7. ~~**"78 % expansión supera al crecimiento"**~~: **resuelto**, ahora dice 73 %, "en 313 de las 427 localidades".
   **Abierto:** la tarjeta "60 localidades en declive" cuenta las caídas de población > 5 %, y el gráfico de patrones muestra 58 "En declive" porque 2 no tienen superficie en 1980. Se puede dejar así (miden cosas distintas) o aclararlo en la tarjeta.
8. ~~**README**~~: **resuelto**, con las 9 regiones de `DATA`, hosting en Vercel, stack (MapLibre, PMTiles) y la estructura actual.

## Nombres (ver `docs/equivalencias-nombres.csv`)

9. ~~**Casos marcados "revisar"**~~: **aprobados** (Italó, Vicuña Mackenna, Lucio V. Mansilla, Leguizamón, los Chañaritos y Villa Sarmiento con departamento, General San Martín y Presidente Roque Sáenz Peña).
10. ~~**Miramar**~~: **resuelto**, se muestra "Miramar de Ansenuza" (enlace: `#mapa/loc=miramar-de-ansenuza`).

## Técnicas

11. ~~**`tiles/`**~~: **resuelto**, eliminado (Tanda 2, con el merge de PMTiles).
12. **Clave de Google Drive** (`DRIVE_API_KEY`) visible en el JS público, para el botón "↓ mapa". Conviene restringirla por HTTP referrer (expansionurbana.vercel.app) en Google Cloud.
13. ~~**Render de densidad en escritorio**~~: **resuelto en la Tanda 2.** El dibujo en triángulos venía de la geometría original (15 decimales), no del entorno; con las capas v2 se ve bien.
14. **OpenFreeMap no se pudo probar en vivo** (la red del contenedor bloquea tiles.openfreemap.org y las CDN); las capturas muestran el respaldo crema. Verificalo en el preview de Vercel.
15. ~~**Rótulos del mapa base**~~: **resuelto**, se mantiene el mapa base sin rótulos.
16. **JSON-LD**: ya declara la licencia CC BY 4.0; queda para confirmar en la Tanda 3.
