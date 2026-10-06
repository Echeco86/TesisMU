# Dudas pendientes

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

11. **`tiles/`**: son 44 MB y 8.634 archivos .pbf versionados en git aunque figuran en `.gitignore`, y el sitio no los usa (el mapa carga los GeoJSON). Propuesta para la Tanda 2: decidir entre PMTiles y GeoJSON livianos, y sacar `tiles/` del deploy.
12. **Clave de Google Drive** (`DRIVE_API_KEY`) visible en el JS público, para el botón "↓ mapa". Conviene restringirla por HTTP referrer (expansionurbana.vercel.app) en Google Cloud.
13. **Render de densidad en escritorio**: en el contenedor de pruebas (WebGL por software), a zoom alto en 1440 px las manchas se ven como triángulos; en 375 y 768 px se ven bien, y pasa igual en `main`. Parece un artefacto del entorno: confirmalo en tu navegador.
14. **OpenFreeMap no se pudo probar en vivo** (la red del contenedor bloquea tiles.openfreemap.org y las CDN); las capturas muestran el respaldo crema. Verificalo en el preview de Vercel.
15. **Rótulos del mapa base**: los saqué para mantener el aspecto anterior (light_nolabels). ¿Querés nombres de lugares?
16. **JSON-LD**: ya declara la licencia CC BY 4.0; queda para confirmar en la Tanda 3.
