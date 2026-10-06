# Transformaciones Territoriales
### Dinámicas poblacionales y urbanas en Municipios y Comunas de la Provincia de Córdoba (1980–2022)

> **Trabajo Final de Maestría** · Mgtr. Lic. Juan Manuel Echecolanea  
> Dirección: Mgtr. Arq. Leticia Gomez · Codirección: Mgtr. Lic. Laura Luna  
> Universidad Nacional de Córdoba

---

## 📌 Descripción

Este repositorio contiene el **dashboard geoespacial interactivo** desarrollado como producto central del trabajo final de maestría. La investigación analiza los procesos de expansión urbana y crecimiento poblacional en los **427 Municipios y Comunas de la Provincia de Córdoba** durante un período de cuatro décadas (1980–2022), combinando datos censales del INDEC con información satelital procesada a partir de la base de datos global GHSL (Global Human Settlement Layer) del Centro Común de Investigación de la Comisión Europea.

🌐 **Dashboard en línea:** [expansionurbana.vercel.app](https://expansionurbana.vercel.app/)

---

## 🗂️ Contenido del dashboard

El dashboard está organizado en las siguientes secciones:

| Sección | Descripción |
|---|---|
| **Introducción** | Cifras clave, línea de tiempo y síntesis de hallazgos |
| **Exploración Territorial** | Mapa MapLibre con capas de densidad por año (PMTiles), coroplético por indicador, comparación 1980 \| 2020, vista 3D y ficha por localidad |
| **Análisis Regional** | Desglose de indicadores por las 9 regiones definidas en la investigación |
| **Análisis Exploratorio** | Cuatro gráficos de dispersión para explorar relaciones entre variables |
| **Comparador** | Comparación de evolución entre localidades seleccionadas |
| **Tabla de Datos** | Tabla completa con búsqueda, filtros y paginación para los 427 municipios y comunas |
| **Marco Conceptual y Metodológico** | Fundamentos conceptuales, metodología y taxonomía regional |
| **Conclusiones** | Línea de tiempo, gráficos de síntesis y conclusiones numeradas con bibliografía |

---

## 📊 Indicadores analizados

Para cada una de las 427 localidades y en cinco cortes temporales (1980, 1990, 2000, 2010, 2020):

- **Población** — datos censales INDEC
- **Conteo de píxeles** — superficie construida GHSL a resolución 100m
- **Densidad media** — superficie construida media por píxel (m² BU/píxel, GHSL)
- **Núcleos de construcción** — cantidad de núcleos urbanos identificados

---

## 🗺️ Regionalización

La provincia se organiza en **9 regiones** de análisis:

1. Gran Córdoba
2. Ciudades de más de 50.000 habitantes
3. Valles Turísticos
4. Región Norte
5. Región Oeste
6. Región Centro
7. Región Este
8. Región Sureste
9. Región Sur

---

## 🛠️ Stack tecnológico

| Componente | Tecnología |
|---|---|
| Mapa interactivo | [MapLibre GL JS](https://maplibre.org/) 4.7.1 · mapa base [OpenFreeMap](https://openfreemap.org/) |
| Vista 3D | [deck.gl](https://deck.gl/) |
| Gráficos | [Chart.js](https://www.chartjs.org/) 4.4.1 |
| Geodatos | PMTiles (capas de densidad) y GeoJSON (WGS84, vista 3D y respaldo) |
| Frontend | HTML5 + CSS3 + JavaScript (vanilla) |
| Tipografías | Space Mono, Fraunces, Inter |
| Hosting | [Vercel](https://vercel.com/) (deploy automático desde `main`) |

---

## 📁 Estructura del repositorio

```
TesisMU/
├── index.html                  # Estructura y estilos del dashboard
├── assets/
│   ├── app.vN.js               # Lógica de la aplicación
│   ├── data.vN.js              # Datos por localidad y región (DATA, MUNICIPIOS_GJ)
│   └── *.webp                  # Imágenes
├── capas/{año}_vN.pmtiles      # Capas de densidad por año para el mapa
├── {año}_vN.geojson            # Las mismas capas en GeoJSON (vista 3D y respaldo)
├── docs/                       # Dudas abiertas, equivalencias de nombres, evaluación PMTiles
├── tools/                      # Scripts para regenerar capas y versionar archivos
├── vercel.json                 # Encabezados de caché
├── CHANGELOG.md
└── README.md
```

Los archivos de `assets/`, `capas/` y las capas GeoJSON se sirven con caché inmutable: al modificarlos hay que subir la versión del nombre (`tools/bump-asset.sh`).

---

## 🔬 Fuentes de datos

- **INDEC** — Censos Nacionales de Población y Vivienda (1980, 1991, 2001, 2010, 2022)
- **GHSL GHS-BUILT-S R2022A** — Global Human Settlement Layer, resolución 100m · Centro Común de Investigación (JRC), Comisión Europea
- Procesamiento SIG: **QGIS 3.22.5**

---

## 📐 Metodología

El cruce entre datos censales (INDEC) y superficie construida (GHSL) permite reconstruir la evolución de la **densidad urbana** a escala municipal. A partir de ello, se identifican y caracterizan distintos procesos de urbanización: crecimiento compacto, expansión difusa, despoblamiento con expansión, y núcleos en retracción. El enfoque metodológico combina herramientas del Urbanismo y la Geografía con análisis demográfico y espacial desde una perspectiva crítica que considera factores socioeconómicos y político-institucionales.

---

## 📖 Marco teórico

La investigación dialoga con autores como Henri Lefebvre, David Harvey, Milton Santos, Walter Christaller, Brian Berry, William Alonso y Manuel Castells, entre otros, para interpretar las transformaciones territoriales en el contexto latinoamericano y, específicamente, en la provincia de Córdoba.

---

## 🏆 Reconocimientos y difusión

- Proyecto presentado en la convocatoria **UNC Innova 2026** (categoría: Investigación y/o desarrollo aplicable · Eje 3.4: Economías regionales)

---

## 👤 Autor

**Mgtr. Lic. Juan Manuel Echecolanea**  
✉️ echecolaneajuan&#64;gmail&#46;com

---

## 📄 Licencia

Este proyecto es de código abierto. Los datos del INDEC son de acceso público. Los datos GHSL son provistos bajo licencia Creative Commons por el Joint Research Centre de la Comisión Europea.

---

*Dashboard desarrollado como producto del Trabajo Final de Maestría · Universidad Nacional de Córdoba · 2025*
