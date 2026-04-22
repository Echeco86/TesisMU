# Transformaciones Territoriales
### Dinámicas poblacionales y urbanas en Municipios y Comunas de la Provincia de Córdoba (1980–2022)

> **Trabajo Final de Maestría** · Mgtr. Lic. Juan Manuel Echecolanea  
> Dirección: Mgtr. Arq. Leticia Gomez · Codirección: Mgtr. Lic. Laura Luna  
> Universidad Nacional de Córdoba

---

## 📌 Descripción

Este repositorio contiene el **dashboard geoespacial interactivo** desarrollado como producto central del trabajo final de maestría. La investigación analiza los procesos de expansión urbana y crecimiento poblacional en los **427 Municipios y Comunas de la Provincia de Córdoba** durante un período de cuatro décadas (1980–2022), combinando datos censales del INDEC con información satelital procesada a partir de la base de datos global GHSL (Global Human Settlement Layer) del Centro Común de Investigación de la Comisión Europea.

🌐 **Dashboard en línea:** [echeco86.github.io/TesisMU](https://echeco86.github.io/TesisMU)

---

## 🗂️ Contenido del dashboard

El dashboard está organizado en las siguientes secciones:

| Sección | Descripción |
|---|---|
| **Mapa Espacial** | Mapa Leaflet con capas de densidad por año (polígonos disueltos GeoJSON), sidebar flotante y gráficos por localidad |
| **Análisis Regional** | Desglose de indicadores por las 9 regiones definidas en la investigación |
| **Análisis Exploratorio** | Cuatro gráficos de dispersión para explorar relaciones entre variables |
| **Comparador** | Comparación de evolución entre localidades seleccionadas |
| **Tabla de Datos** | Tabla completa con búsqueda, filtros y paginación para los 427 municipios y comunas |
| **Marco Teórico** | Fundamentos conceptuales, metodología y taxonomía regional |
| **Conclusiones** | Línea de tiempo, gráficos de síntesis y conclusiones numeradas con bibliografía |

---

## 📊 Indicadores analizados

Para cada una de las 427 localidades y en cinco cortes temporales (1980, 1990, 2000, 2010, 2020):

- **Población** — datos censales INDEC
- **Conteo de píxeles** — superficie construida GHSL a resolución 100m
- **Densidad media** — hab/km² promedio por núcleo urbano
- **Núcleos de construcción** — cantidad de núcleos urbanos identificados

---

## 🗺️ Regionalización

La provincia se organiza en **9 regiones** de análisis:

1. Área Metropolitana de Córdoba
2. Ciudades con mas de cincuenta mil habitantes
3. Valles Turísticos
4. Región Norte
5. Región Oeste
6. Región Sur
7. Región Este
8. Región Sureste
9. Región Noroeste

---

## 🛠️ Stack tecnológico

| Componente | Tecnología |
|---|---|
| Mapa interactivo | [Leaflet.js](https://leafletjs.com/) 1.9.4 |
| Gráficos | [Chart.js](https://www.chartjs.org/) 4.4.1 |
| Geodatos | GeoJSON (WGS84) |
| Frontend | HTML5 + CSS3 + JavaScript (vanilla) |
| Tipografías | Space Mono, Fraunces, Inter |
| Hosting | GitHub Pages |

---

## 📁 Estructura del repositorio

```
TesisMU/
├── index.html                  # Dashboard principal (archivo autocontenido)
├── {año}_Ligth.geojson         # Capas de densidad por año (1980–2020)
└── README.md
```

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
