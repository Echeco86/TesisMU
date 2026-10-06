// DN = valor BU del píxel (m² construidos en la celda). Cortes de Metodología (naturales de 2010);
// como en el renderizador graduado de QGIS, el valor del corte pertenece a la clase inferior.
var v = this.properties.DN;
this.properties = {dens_cat: v <= 368 ? 'Muy Baja' : v <= 1309 ? 'Baja' : v <= 2634 ? 'Media' : v <= 4074 ? 'Alta' : 'Muy Alta'};
