// expresión -each de mapshaper: normaliza el nombre de campo y la clase
var raw = (this.properties.dens_cat || this.properties.Dens_Cat || this.properties.Densi_Cat || this.properties.Dens_cat || '').toLowerCase().trim();
var M = {'muy bajo':'Muy Baja','muy baja':'Muy Baja','bajo':'Baja','baja':'Baja','medio':'Media','media':'Media','alto':'Alta','alta':'Alta','muy alto':'Muy Alta','muy alta':'Muy Alta'};
this.properties = {dens_cat: M[raw] || 'SIN_CLASE'};
