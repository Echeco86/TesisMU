# Dudas pendientes

## Nuevas en la Tanda 2

A. ~~**La capa 1990 era una copia de la de 1980**~~: **resuelto** con el GeoJSON de píxeles 1990. Quedan dos detalles menores del archivo fuente: Valle Hermoso (281 píxeles contra 283 en `DATA`) y Casa Grande (29 contra 27) se intercambian 2 píxeles de borde (por eso también difiere su densidad media). El resto coincide con `DATA`. No afecta el mapa.
B. **Contorno provincial**: hoy sale de la capa `boundary` (admin_level 4) del mapa base OpenFreeMap, así que en el modo de respaldo (sin mapa base) no aparece. Si me pasás el límite oficial (p. ej. de IDECOR) en GeoJSON, se carga con `PROVINCIA_URL` y se ve siempre.
C. **Rampa de 2020**: con más contraste de luminosidad, los pasos oscuros del naranja tiran a ocre y marrón (mismo tono, más oscuro). ¿Lo dejamos así o preferís menos contraste y más naranja?
D. **Paleta regional en scatters**: con 9 regiones no hay paleta que separe todos los pares a ΔE ≥ 15 en visión normal; el par más cercano es Ciudades +50.000 ↔ Valles Turísticos (ΔE 10,8). Lo compensan la leyenda que aísla regiones y el filtro de región. Si querés más separación, conviene agrupar regiones en los scatters.
E. ~~**PMTiles o GeoJSON**~~: **resuelto**, PMTiles mergeado en `perf/tanda-2` con respaldo automático a GeoJSON. Falta confirmar en el preview que `capas/*.pmtiles` responde `206` (si no, el sitio usa GeoJSON solo).
F. **Chart.js** se carga ahora desde unpkg en lugar de cdnjs, para poder verificar el SRI.

## De la Tanda 1

Ningún valor analítico se cambió. Estas son inconsistencias o decisiones que necesitan tu confirmación.

## Datos y textos

1. **28 localidades sin patrón de crecimiento.** Se deduce de `clasificarPatron()`: necesita población y superficie > 0 en 1980 y 2020. Las 28 excluidas fallan todas por 1980:
   - Sin población censada en 1980 (20): La Rancherita, Villa Ciudad Parque Los Reartes, Las Cañadas, Chañar Viejo, Paso del Durazno, Villa Elisa, Dique Chico, Cuesta Blanca, Santa Elena, Candelaria Sud, Tala Cañada, Cabalango, Eufrasio Loza, Estancia Vieja, Colonia Prosperidad, Villa Candelaria Norte, Pozo Nuevo, Monte Leña, Villa Santa Cruz del Lago, Estación Juárez Celman.
   - Sin superficie construida detectada en 1980 (5): Ranqueles, San Clemente, Cañada del Sauce, Leguizamón, San Gerónimo.
   - Sin ninguna de las dos (3): Colonia Iturraspe, Colonia Anita, Los Talares.

   La nota del gráfico dice: "N localidades quedan sin clasificar: no tienen población censada o superficie construida detectada en 1980 (o en 2020), y sin valor de base no se puede calcular la variación". ¿Te parece bien la redacción?
2. **LCRPGR, ¿40 o 42 años?** El código divide LCR y PGR por 40. Como el divisor es el mismo, el cociente no cambia. Si se usara el período censal real (42 años) para la población, el LCRPGR quedaría ×1,05 (p. ej., Oeste 2,10 → 2,21; Valles 1,81 → 1,90). ¿Cuál querés?
3. **"+155 %" de expansión.** `DATA.totals` da +154,49 %, que redondea a +154 %. Aparece en la portada, la intro y la conclusión 1.
4. **Valles Turísticos como "caso extremo".** Por `DATA.regions`, crecieron más en superficie la Región Oeste (+579,7 %) y la Región Centro (+434,9 %) que Valles (+387,6 %). Saqué "la mayor expansión" junto con "per cápita"; confirmá la redacción.
5. **Conclusión 5**: dice que "los Valles Turísticos muestran descensos pronunciados" de densidad, pero en `DATA` sube de 906,3 a 986,7 m² BU/píxel. La Región Oeste sí baja (723,9 → 585,2).
6. **Punto de inflexión**: la conclusión 2 dice que la década 2000–2010 "concentra el mayor salto". La tasa anual de superficie es 2,90 % en 2000–2010 y 4,05 % en 2010–2020 (+37.248 ha contra +73.095 ha). Además, "casi duplicó" se queda corto: 2,90 / 1,16 = 2,5 veces.
7. **"78 % expansión supera al crecimiento"** es 313/399 (localidades clasificables); sobre 427 sería 73,3 %. **"60 localidades en declive"** cuenta caídas de población > 5 %, pero el gráfico de patrones muestra 58 "En declive" porque 2 no tienen superficie en 1980.
8. **README**: la lista de regiones (Región Sur, Noroeste…) no coincide con `DATA` ni con Marco Conceptual (Región Centro, Sur, Sureste…), y dice que el hosting es GitHub Pages.

## Nombres (ver `docs/equivalencias-nombres.csv`)

9. Casos marcados "revisar": Italó, Vicuña Mackenna (la clave dice VICUNA), Lucio V. Mansilla, Leguizamón, Los Chañaritos (Cruz del Eje) / Los Chañaritos (Río Segundo), Villa Sarmiento (General Roca) / Villa Sarmiento (San Alberto), y los departamentos General San Martín y Presidente Roque Sáenz Peña.
10. **Miramar**: lo dejé así. ¿Querés mostrar el nombre actual, "Miramar de Ansenuza"?

## Técnicas

11. ~~**`tiles/`**~~: **resuelto**, eliminado (Tanda 2, con el merge de PMTiles).
12. **Clave de Google Drive** (`DRIVE_API_KEY`) visible en el JS público, para el botón "↓ mapa". Conviene restringirla por HTTP referrer (expansionurbana.vercel.app) en Google Cloud.
13. ~~**Render de densidad en escritorio**~~: **resuelto en la Tanda 2.** El dibujo en triángulos venía de la geometría original (15 decimales), no del entorno; con las capas v2 se ve bien.
14. **OpenFreeMap no se pudo probar en vivo** (la red del contenedor bloquea tiles.openfreemap.org y las CDN); las capturas muestran el respaldo crema. Verificalo en el preview de Vercel.
15. **Rótulos del mapa base**: los saqué para mantener el aspecto anterior (light_nolabels). ¿Querés nombres de lugares?
16. **JSON-LD**: ya declara la licencia CC BY 4.0; queda para confirmar en la Tanda 3.
