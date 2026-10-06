// Transformaciones Territoriales · lógica del panel (mapa, gráficos, tablas).
// Depende de assets/data.v*.js (DATA, MUNICIPIOS_GJ), Chart.js y MapLibre GL.

const YEARS=[1980,1990,2000,2010,2020];
// Censo usado en cada corte (la superficie GHSL sí es del año redondo)
const CENSO={1980:1980,1990:1991,2000:2001,2010:2010,2020:2022};
const YC={1980:'#28c924',1990:'#1ec3e6',2000:'#854bfa',2010:'#e33943',2020:'#faa523'};
// Paleta de las 9 regiones: ÚNICA fuente de color regional (gráficos, tablas, chips, comparador).
// Validada con el validador CVD (OKLab, Machado 2009): pares adyacentes ΔE ≥ 19,9 con protanopia/
// deuteranopia y ≥ 23,9 en visión normal; todos contra todos ΔE ≥ 9,7 (CVD). A ΔE ≥ 15 de los
// colores de año y ≥ 3:1 sobre blanco. El orden sigue el de DATA.regions (vecinos en líneas y barras).
const REGION_COLORS={
  'Gran Córdoba':     '#249d83',
  'Ciudades +50,000': '#861192',
  'Región Sureste':   '#8f9817',
  'Valles Turisticos':'#943262',
  'Región Norte':     '#9b87d9',
  'Región Centro':    '#a06108',
  'Región Sur':       '#1649d5',
  'Región Este':      '#8f3301',
  'Región Oeste':     '#267aa3'
};
// Chip de región: texto en tinta (contraste), tinte de fondo y barra lateral con el color de la región
function regBadge(rn){
  var c=REGION_COLORS[rn]||'#888';
  return '<span class="badge reg-badge" style="background:'+c+'1f;box-shadow:inset 3px 0 0 '+c+'">'+rlab(rn)+'</span>';
}
// Grafía de visualización (la clave original de DATA/MUNICIPIOS_GJ queda intacta para los joins).
// Tabla de revisión: docs/equivalencias-nombres.csv
const NOMBRE_VIS={"ACHIRAS":"Achiras","ADELIA MARIA":"Adelia María","AGUA DE ORO":"Agua de Oro","ALCIRA":"Alcira","ALDEA SANTA MARIA":"Aldea Santa María","ALEJANDRO ROCA":"Alejandro Roca","ALEJO LEDESMA":"Alejo Ledesma","ALICIA":"Alicia","ALMAFUERTE":"Almafuerte","ALPA CORRAL":"Alpa Corral","ALTA GRACIA":"Alta Gracia","ALTO ALEGRE":"Alto Alegre","ALTO DE LOS QUEBRACHOS":"Alto de los Quebrachos","ALTOS DE CHIPION":"Altos de Chipión","AMBOY":"Amboy","AMBUL":"Ambul","ANA ZUMARAN":"Ana Zumarán","ANISACATE":"Anisacate","ARIAS":"Arias","ARROYITO":"Arroyito","ARROYO ALGODON":"Arroyo Algodón","ARROYO CABRAL":"Arroyo Cabral","ARROYO LOS PATOS":"Arroyo Los Patos","ASSUNTA":"Assunta","ATAHONA":"Atahona","AUSONIA":"Ausonia","AVELLANEDA":"Avellaneda","BALLESTEROS":"Ballesteros","BALLESTEROS SUD":"Ballesteros Sud","BALNEARIA":"Balnearia","BAÑADO DE SOTO":"Bañado de Soto","BELL VILLE":"Bell Ville","BENGOLEA":"Bengolea","BENJAMIN GOULD":"Benjamín Gould","BERROTARAN":"Berrotarán","BIALET MASSE":"Bialet Massé","BOUWER":"Bouwer","BRINKMANN":"Brinkmann","BUCHARDO":"Buchardo","BULNES":"Bulnes","CABALANGO":"Cabalango","CALCHIN":"Calchín","CALCHIN OESTE":"Calchín Oeste","CALMAYO":"Calmayo","CAMILO ALDAO":"Camilo Aldao","CAMINIAGA":"Caminiaga","CANALS":"Canals","CANDELARIA SUD":"Candelaria Sud","CAPILLA DE LOS REMEDIOS":"Capilla de los Remedios","CAPILLA DEL CARMEN":"Capilla del Carmen","CAPILLA DEL MONTE":"Capilla del Monte","CAPILLA DEL SITON":"Capilla del Sitón","CAPITAN GENERAL BERNARDO O'HIGGINS":"Capitán General Bernardo O'Higgins","CARNERILLO":"Carnerillo","CARRILOBO":"Carrilobo","CASA GRANDE":"Casa Grande","CAVANAGH":"Cavanagh","CAÑADA DE LUQUE":"Cañada de Luque","CAÑADA DE MACHADO":"Cañada de Machado","CAÑADA DE RIO PINTO":"Cañada de Río Pinto","CAÑADA DEL SAUCE":"Cañada del Sauce","CERRO COLORADO":"Cerro Colorado","CHAJAN":"Chaján","CHALACEA":"Chalacea","CHANCANI":"Chancaní","CHARBONIER":"Charbonier","CHARRAS":"Charras","CHAZON":"Chazón","CHAÑAR VIEJO":"Chañar Viejo","CHILIBROSTE":"Chilibroste","CHUCUL":"Chucul","CHURQUI CAÑADA":"Churqui Cañada","CHUÑA":"Chuña","CHUÑA HUASI":"Chuña Huasi","CIENAGA DEL CORO":"Ciénaga del Coro","CINTRA":"Cintra","COLAZO":"Colazo","COLONIA ALMADA":"Colonia Almada","COLONIA ANITA":"Colonia Anita","COLONIA BARGE":"Colonia Barge","COLONIA BISMARCK":"Colonia Bismarck","COLONIA BREMEN":"Colonia Bremen","COLONIA CAROYA":"Colonia Caroya","COLONIA ITALIANA":"Colonia Italiana","COLONIA ITURRASPE":"Colonia Iturraspe","COLONIA LAS CUATRO ESQUINAS":"Colonia Las Cuatro Esquinas","COLONIA LAS PICHANAS":"Colonia Las Pichanas","COLONIA MARINA":"Colonia Marina","COLONIA PROSPERIDAD":"Colonia Prosperidad","COLONIA SAN BARTOLOME":"Colonia San Bartolomé","COLONIA SAN PEDRO":"Colonia San Pedro","COLONIA TIROLESA":"Colonia Tirolesa","COLONIA VALTELINA":"Colonia Valtelina","COLONIA VICENTE AGUERO":"Colonia Vicente Agüero","COLONIA VIDELA":"Colonia Videla","COLONIA VIGNAUD":"Colonia Vignaud","COMECHINGONES":"Comechingones","CONLARA":"Conlara","COPACABANA":"Copacabana","CORDOBA":"Córdoba","CORONEL BAIGORRIA":"Coronel Baigorria","CORONEL MOLDES":"Coronel Moldes","CORRAL DE BUSTOS":"Corral de Bustos","CORRALITO":"Corralito","COSQUIN":"Cosquín","COSTASACATE":"Costasacate","CRUZ ALTA":"Cruz Alta","CRUZ DE CAÑA":"Cruz de Caña","CRUZ DEL EJE":"Cruz del Eje","CUESTA BLANCA":"Cuesta Blanca","DALMACIO VELEZ":"Dalmacio Vélez","DEAN FUNES":"Deán Funes","DEL CAMPILLO":"Del Campillo","DESPEÑADEROS":"Despeñaderos","DEVOTO":"Devoto","DIEGO DE ROJAS":"Diego de Rojas","DIQUE CHICO":"Dique Chico","EL ARAÑADO":"El Arañado","EL BRETE":"El Brete","EL CHACHO":"El Chacho","EL CRISPIN":"El Crispín","EL FORTIN":"El Fortín","EL MANZANO":"El Manzano","EL RASTREADOR":"El Rastreador","EL RODEO":"El Rodeo","EL TIO":"El Tío","ELENA":"Elena","EMBALSE":"Embalse","ESQUINA":"Esquina","ESTACION GENERAL PAZ":"Estación General Paz","ESTACION JUAREZ CELMAN":"Estación Juárez Celman","ESTANCIA DE GUADALUPE":"Estancia de Guadalupe","ESTANCIA VIEJA":"Estancia Vieja","ETRURIA":"Etruria","EUFRASIO LOZA":"Eufrasio Loza","FALDA DEL CARMEN":"Falda del Carmen","FREYRE":"Freyre","GENERAL BALDISSERA":"General Baldissera","GENERAL CABRERA":"General Cabrera","GENERAL DEHEZA":"General Deheza","GENERAL FOTHERINGHAM":"General Fotheringham","GENERAL LEVALLE":"General Levalle","GENERAL ROCA":"General Roca","GUANACO MUERTO":"Guanaco Muerto","GUASAPAMPA":"Guasapampa","GUATIMOZIN":"Guatimozín","GUTEMBERG":"Gutemberg","HERNANDO":"Hernando","HUANCHILLA":"Huanchilla","HUERTA GRANDE":"Huerta Grande","HUINCA RENANCO":"Huinca Renancó","IDIAZABAL":"Idiazábal","IMPIRA":"Impira","INRIVILLE":"Inriville","ISLA VERDE":"Isla Verde","ITALO":"Italó","JAMES CRAIK":"James Craik","JESUS MARIA":"Jesús María","JOVITA":"Jovita","JUSTINIANO POSSE":"Justiniano Posse","KILOMETRO 658":"Kilómetro 658","LA BATEA":"La Batea","LA CALERA":"La Calera","LA CARLOTA":"La Carlota","LA CAROLINA EL POTOSI":"La Carolina El Potosí","LA CAUTIVA":"La Cautiva","LA CESIRA":"La Cesira","LA CRUZ":"La Cruz","LA CUMBRE":"La Cumbre","LA CUMBRECITA":"La Cumbrecita","LA FALDA":"La Falda","LA FRANCIA":"La Francia","LA GRANJA":"La Granja","LA HIGUERA":"La Higuera","LA LAGUNA":"La Laguna","LA PAISANITA":"La Paisanita","LA PALESTINA":"La Palestina","LA PAMPA":"La Pampa","LA PAQUITA":"La Paquita","LA PARA":"La Para","LA PAZ":"La Paz","LA PLAYA":"La Playa","LA PLAYOSA":"La Playosa","LA POBLACION":"La Población","LA POSTA":"La Posta","LA PUERTA":"La Puerta","LA QUINTA":"La Quinta","LA RANCHERITA":"La Rancherita","LA RINCONADA":"La Rinconada","LA SERRANITA":"La Serranita","LA TORDILLA":"La Tordilla","LABORDE":"Laborde","LABOULAYE":"Laboulaye","LAGUNA LARGA":"Laguna Larga","LAS ACEQUIAS":"Las Acequias","LAS ALBAHACAS":"Las Albahacas","LAS ARRIAS":"Las Arrias","LAS BAJADAS":"Las Bajadas","LAS CALERAS":"Las Caleras","LAS CALLES":"Las Calles","LAS CAÑADAS":"Las Cañadas","LAS GRAMILLAS":"Las Gramillas","LAS HIGUERAS":"Las Higueras","LAS ISLETILLAS":"Las Isletillas","LAS JUNTURAS":"Las Junturas","LAS PALMAS":"Las Palmas","LAS PERDICES":"Las Perdices","LAS PEÑAS":"Las Peñas","LAS PEÑAS SUD":"Las Peñas Sud","LAS PLAYAS":"Las Playas","LAS RABONAS":"Las Rabonas","LAS SALADAS":"Las Saladas","LAS TAPIAS":"Las Tapias","LAS VARAS":"Las Varas","LAS VARILLAS":"Las Varillas","LAS VERTIENTES":"Las Vertientes","LEGUIZAMÓN":"Leguizamón","LEONES":"Leones","LOS CEDROS":"Los Cedros","LOS CERRILLOS":"Los Cerrillos","LOS CHAÑARITOS":"Los Chañaritos (Río Segundo)","LOS CHAÑARITOS (C.D.E.)":"Los Chañaritos (Cruz del Eje)","LOS CISNES":"Los Cisnes","LOS COCOS":"Los Cocos","LOS CONDORES":"Los Cóndores","LOS HORNILLOS":"Los Hornillos","LOS HOYOS":"Los Hoyos","LOS MISTOLES":"Los Mistoles","LOS MOLINOS":"Los Molinos","LOS POZOS":"Los Pozos","LOS REARTES":"Los Reartes","LOS SURGENTES":"Los Surgentes","LOS TALARES":"Los Talares","LOS ZORROS":"Los Zorros","LOZADA":"Lozada","LUCA":"Luca","LUCIO V. MANSILLA":"Lucio V. Mansilla","LUQUE":"Luque","LUTTI":"Lutti","LUYABA":"Luyaba","MALAGUEÑO":"Malagueño","MALENA":"Malena","MALVINAS ARGENTINAS":"Malvinas Argentinas","MANFREDI":"Manfredi","MAQUINISTA GALLINI":"Maquinista Gallini","MARCOS JUAREZ":"Marcos Juárez","MARULL":"Marull","MATORRALES":"Matorrales","MATTALDI":"Mattaldi","MAYU SUMAJ":"Mayu Sumaj","MEDIA NARANJA":"Media Naranja","MELO":"Melo","MENDIOLAZA":"Mendiolaza","MI GRANJA":"Mi Granja","MINA CLAVERO":"Mina Clavero","MIRAMAR":"Miramar","MONTE BUEY":"Monte Buey","MONTE CRISTO":"Monte Cristo","MONTE DE LOS GAUCHOS":"Monte de los Gauchos","MONTE LEÑA":"Monte Leña","MONTE MAIZ":"Monte Maíz","MONTE RALO":"Monte Ralo","MORRISON":"Morrison","MORTEROS":"Morteros","NICOLAS BRUZZONE":"Nicolás Bruzzone","NOETINGER":"Noetinger","NONO":"Nono","OBISPO TREJO":"Obispo Trejo","OLAETA":"Olaeta","OLIVA":"Oliva","OLIVARES DE SAN NICOLAS":"Olivares de San Nicolás","ONAGOITY":"Onagoity","ONCATIVO":"Oncativo","ORDOÑEZ":"Ordóñez","PACHECO DE MELO":"Pacheco de Melo","PAMPAYASTA NORTE":"Pampayasta Norte","PAMPAYASTA SUD":"Pampayasta Sud","PANAHOLMA":"Panaholma","PASCANAS":"Pascanas","PASCO":"Pasco","PASO DEL DURAZNO":"Paso del Durazno","PASO VIEJO":"Paso Viejo","PILAR":"Pilar","PINCEN":"Pincén","PIQUILLIN":"Piquillín","PLAZA DE MERCEDES":"Plaza de Mercedes","PLAZA LUXARDO":"Plaza Luxardo","PORTEÑA":"Porteña","POTRERO DE GARAY":"Potrero de Garay","POZO DEL MOLLE":"Pozo del Molle","POZO NUEVO":"Pozo Nuevo","PUEBLO ITALIANO":"Pueblo Italiano","PUESTO DE CASTRO":"Puesto de Castro","PUNTA DEL AGUA":"Punta del Agua","QUEBRACHO HERRADO":"Quebracho Herrado","QUILINO":"Quilino","RAFAEL GARCIA":"Rafael García","RANQUELES":"Ranqueles","RAYO CORTADO":"Rayo Cortado","REDUCCION":"Reducción","RINCON":"Rincón","RIO BAMBA":"Río Bamba","RIO CEBALLOS":"Río Ceballos","RIO CUARTO":"Río Cuarto","RIO DE LOS SAUCES":"Río de los Sauces","RIO PRIMERO":"Río Primero","RIO SEGUNDO":"Río Segundo","RIO TERCERO":"Río Tercero","ROSALES":"Rosales","ROSARIO DEL SALADILLO":"Rosario del Saladillo","SACANTA":"Sacanta","SAGRADA FAMILIA":"Sagrada Familia","SAIRA":"Saira","SALADILLO":"Saladillo","SALDAN":"Saldán","SALSACATE":"Salsacate","SALSIPUEDES":"Salsipuedes","SAMPACHO":"Sampacho","SAN AGUSTIN":"San Agustín","SAN ANTONIO DE ARREDONDO":"San Antonio de Arredondo","SAN ANTONIO DE LITIN":"San Antonio de Litín","SAN BASILIO":"San Basilio","SAN CARLOS MINAS":"San Carlos Minas","SAN CLEMENTE":"San Clemente","SAN ESTEBAN":"San Esteban","SAN FRANCISCO":"San Francisco","SAN FRANCISCO DEL CHAÑAR":"San Francisco del Chañar","SAN GERONIMO":"San Gerónimo","SAN IGNACIO":"San Ignacio","SAN JAVIER Y YACANTO":"San Javier y Yacanto","SAN JOAQUIN":"San Joaquín","SAN JOSE":"San José","SAN JOSE DE LA DORMIDA":"San José de la Dormida","SAN JOSE DE LAS SALINAS":"San José de las Salinas","SAN LORENZO":"San Lorenzo","SAN MARCOS SIERRAS":"San Marcos Sierras","SAN MARCOS SUD":"San Marcos Sud","SAN PEDRO":"San Pedro","SAN PEDRO NORTE":"San Pedro Norte","SAN ROQUE":"San Roque","SAN VICENTE":"San Vicente","SANTA CATALINA HOLMBERG":"Santa Catalina Holmberg","SANTA ELENA":"Santa Elena","SANTA EUFEMIA":"Santa Eufemia","SANTA MARIA DE PUNILLA":"Santa María de Punilla","SANTA ROSA DE CALAMUCHITA":"Santa Rosa de Calamuchita","SANTIAGO TEMPLE":"Santiago Temple","SARMIENTO":"Sarmiento","SATURNINO MARIA LASPIUR":"Saturnino María Laspiur","SAUCE ARRIBA":"Sauce Arriba","SEBASTIAN ELCANO":"Sebastián Elcano","SEEBER":"Seeber","SEGUNDA USINA":"Segunda Usina","SERRANO":"Serrano","SERREZUELA":"Serrezuela","SILVIO PELLICO":"Silvio Pellico","SIMBOLAR":"Simbolar","SINSACATE":"Sinsacate","SUCO":"Suco","TALA CAÑADA":"Tala Cañada","TALA HUASI":"Tala Huasi","TALAINI":"Talaini","TANCACHA":"Tancacha","TANTI":"Tanti","TICINO":"Ticino","TINOCO":"Tinoco","TIO PUJIO":"Tío Pujio","TOLEDO":"Toledo","TORO PUJIO":"Toro Pujio","TOSNO":"Tosno","TOSQUITA":"Tosquita","TRANSITO":"Tránsito","TUCLAME":"Tuclame","UCACHA":"Ucacha","UNQUILLO":"Unquillo","VALLE DE ANISACATE":"Valle de Anisacate","VALLE HERMOSO":"Valle Hermoso","VIAMONTE":"Viamonte","VICUNA MACKENNA":"Vicuña Mackenna","VILLA ALLENDE":"Villa Allende","VILLA AMANCAY":"Villa Amancay","VILLA ASCASUBI":"Villa Ascasubi","VILLA CANDELARIA NORTE":"Villa Candelaria Norte","VILLA CARLOS PAZ":"Villa Carlos Paz","VILLA CERRO AZUL":"Villa Cerro Azul","VILLA CIUDAD DE AMERICA":"Villa Ciudad de América","VILLA CIUDAD PARQUE LOS REARTES":"Villa Ciudad Parque Los Reartes","VILLA CONCEPCION DEL TIO":"Villa Concepción del Tío","VILLA CURA BROCHERO":"Villa Cura Brochero","VILLA DE LAS ROSAS":"Villa de las Rosas","VILLA DE MARIA":"Villa de María","VILLA DE POCHO":"Villa de Pocho","VILLA DE SOTO":"Villa de Soto","VILLA DEL DIQUE":"Villa del Dique","VILLA DEL PRADO":"Villa del Prado","VILLA DEL ROSARIO":"Villa del Rosario","VILLA DEL TOTORAL":"Villa del Totoral","VILLA DOLORES":"Villa Dolores","VILLA EL CHACAY":"Villa El Chacay","VILLA ELISA":"Villa Elisa","VILLA FONTANA":"Villa Fontana","VILLA GENERAL BELGRANO":"Villa General Belgrano","VILLA GIARDINO":"Villa Giardino","VILLA GUTIERREZ":"Villa Gutiérrez","VILLA HUIDOBRO":"Villa Huidobro","VILLA LA BOLSA":"Villa La Bolsa","VILLA LOS AROMOS":"Villa Los Aromos","VILLA LOS PATOS":"Villa Los Patos","VILLA MARIA":"Villa María","VILLA NUEVA":"Villa Nueva","VILLA PARQUE SANTA ANA":"Villa Parque Santa Ana","VILLA PARQUE SIQUIMAN":"Villa Parque Siquimán","VILLA QUILLINZO":"Villa Quillinzo","VILLA RIO ICHO CRUZ":"Villa Río Icho Cruz","VILLA ROSSI":"Villa Rossi","VILLA RUMIPAL":"Villa Rumipal","VILLA SAN ESTEBAN":"Villa San Esteban","VILLA SAN ISIDRO":"Villa San Isidro","VILLA SANTA CRUZ DEL LAGO":"Villa Santa Cruz del Lago","VILLA SANTA ROSA":"Villa Santa Rosa","VILLA SARMIENTO":"Villa Sarmiento (San Alberto)","VILLA SARMIENTO (G.R.)":"Villa Sarmiento (General Roca)","VILLA TULUMBA":"Villa Tulumba","VILLA VALERIA":"Villa Valeria","VILLA YACANTO":"Villa Yacanto","WASHINGTON":"Washington","WENCESLAO ESCALANTE":"Wenceslao Escalante"};
const DEPTO_VIS={"CALAMUCHITA":"Calamuchita","CAPITAL":"Capital","COLON":"Colón","CRUZ DEL EJE":"Cruz del Eje","GENERAL ROCA":"General Roca","GRAL.SAN MARTIN":"General San Martín","ISCHILIN":"Ischilín","JUAREZ CELMAN":"Juárez Celman","MARCOS JUAREZ":"Marcos Juárez","MINAS":"Minas","POCHO":"Pocho","PTE.R.S. PEÑA":"Presidente Roque Sáenz Peña","PUNILLA":"Punilla","RIO CUARTO":"Río Cuarto","RIO PRIMERO":"Río Primero","RIO SECO":"Río Seco","RIO SEGUNDO":"Río Segundo","SAN ALBERTO":"San Alberto","SAN JAVIER":"San Javier","SAN JUSTO":"San Justo","SANTA MARIA":"Santa María","SOBREMONTE":"Sobremonte","TERCERO ARRIBA":"Tercero Arriba","TOTORAL":"Totoral","TULUMBA":"Tulumba","UNION":"Unión"};
function dn(k){return NOMBRE_VIS[k]||k;}
function depn(k){return DEPTO_VIS[k]||k;}
const LOCS=Object.keys(DATA.localities).sort(function(a,b){return dn(a).localeCompare(dn(b),'es');});
const REGIONS=[...new Set(LOCS.map(l=>DATA.localities[l].region_nombre))].sort();


// Helper para fuentes responsivas en Chart.js
var IS_MOBILE=window.innerWidth<768;
function cfs(n){return IS_MOBILE?Math.max(7,n-2):n;}
let charts={},activeYrs=new Set([1980,1990,2000,2010,2020]),tblYr=2020,tblPage=0,sortCol='pob',resYr=2020;
let currentRegInd='pob';
let cmpSels=['CORDOBA','RIO CUARTO','VILLA MARIA'],selectedMun="CORDOBA";
let map,mapActiveYrs=new Set([2020]);

const fmt=(n,d=0)=>n==null||isNaN(n)?'—':new Intl.NumberFormat('es-AR',{maximumFractionDigits:d}).format(n);
const pct=(a,b)=>(!a||!b)?null:((b-a)/a*100).toFixed(1);
// Formato es-AR: decimales fijos y signo explícito en variaciones
function fmtNum(n,d){return n==null||isNaN(n)?'—':new Intl.NumberFormat('es-AR',{minimumFractionDigits:d,maximumFractionDigits:d}).format(n);}
function fmtPct(v,d){if(v==null||v===''||isNaN(v))return '—';v=parseFloat(v);return (v>=0?'+':'')+fmtNum(v,d==null?1:d)+'%';}
function fmtTickPct(v,signo){return (signo&&v>0?'+':'')+fmt(v,1)+'%';}
// Nombres de región para mostrar (la clave de DATA queda igual para los joins)
const REG_LABEL={'Ciudades +50,000':'Ciudades +50.000','Valles Turisticos':'Valles Turísticos'};
function rlab(rn){return REG_LABEL[rn]||rn;}
if(typeof Chart!=='undefined'){
  Chart.defaults.locale='es-AR';
  // Movimiento reducido: sin animaciones en los gráficos
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches) Chart.defaults.animation=false;
}
// Leyenda: al pasar el mouse por una serie se atenúan las demás (aislar una región entre nueve)
function _fadeCol(c){ return (typeof c==='string'&&c.charAt(0)==='#')?c.slice(0,7)+'26':c; }
function _fadeAny(c){ return Array.isArray(c)?c.map(_fadeCol):_fadeCol(c); }
function legendDimHover(e,item,legend){
  var ch=legend.chart;
  ch.data.datasets.forEach(function(d,i){
    if(d._bg===undefined){ d._bg=d.backgroundColor; d._bc=d.borderColor; d._pb=d.pointBackgroundColor; }
    var on=(i===item.datasetIndex)||d.label==='_ref';
    d.backgroundColor=on?d._bg:_fadeAny(d._bg);
    d.borderColor=on?d._bc:_fadeAny(d._bc);
    if(d._pb!==undefined) d.pointBackgroundColor=on?d._pb:_fadeAny(d._pb);
  });
  ch.update('none');
  if(e&&e.native&&e.native.target) e.native.target.style.cursor='pointer';
}
function legendDimLeave(e,item,legend){
  var ch=legend.chart;
  ch.data.datasets.forEach(function(d){
    if(d._bg!==undefined){ d.backgroundColor=d._bg; d.borderColor=d._bc; if(d._pb!==undefined) d.pointBackgroundColor=d._pb; }
  });
  ch.update('none');
  if(e&&e.native&&e.native.target) e.native.target.style.cursor='';
}
function killChart(id){if(charts[id]){charts[id].destroy();delete charts[id];}}
const BS={x:{ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(10)}},grid:{color:'rgba(0,0,0,.05)'}},y:{ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(10)}},grid:{color:'rgba(0,0,0,.05)'}}};
const BO={responsive:true,maintainAspectRatio:false,animation:{duration:300},plugins:{legend:{display:false}},scales:BS};

var _secInited={};
function showSec(id,btn){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b=>{b.classList.remove('active');b.removeAttribute('aria-current');});
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
  btn.setAttribute('aria-current','page');
  if(id==='mapa'){
    if(!_secInited.mapa){
      _secInited.mapa=true;
      setTimeout(function(){ initMap(); },50);
    } else {
      setTimeout(function(){
        if(map){
          map.resize();
          map.fitBounds([[-65.769,-34.858],[-61.788,-29.512]],{padding:10});
        }
      },150);
    }
  }
  if(id==='resumen') buildRegional();
  if(id==='analisis') initAnalisis();
  if(id==='tabla'){populateRegFilt();renderTbl();}
  if(id==='comparador') buildCmp();
  if(id==='conclusiones') buildConclusiones();
  if(id==='intro') initScrollyObserver();
}

// ── MAP (MapLibre GL JS) ──

// Rampa de 5 clases por año: mismo tono que el año, luminosidad OKLCH 0,73 → 0,41 en pasos de 0,08
// (validada como rampa ordinal: monótona, ΔL ≥ 0,06, extremo claro ≥ 2:1 sobre el crema).
const FGB_COLORS = {
  1980: ['#70be6a', '#38aa33', '#019101', '#037603', '#025b02'],
  1990: ['#6bb4c8', '#2c9eb9', '#0a859e', '#046c81', '#005465'],
  2000: ['#ab95fb', '#9571f9', '#814cf0', '#6c27da', '#560fb3'],
  2010: ['#eb8783', '#e25f5e', '#d2323c', '#b60024', '#8f011a'],
  2020: ['#cf9d61', '#c07f21', '#a46905', '#865400', '#674105'],
};
const FGB_CAT_LABELS = ['Muy Baja','Baja','Media','Alta','Muy Alta'];

var layerOpacity = {1980:0.85, 1990:0.85, 2000:0.85, 2010:0.85, 2020:0.85};
var layerActive  = {1980:false, 1990:false, 2000:false, 2010:false, 2020:false};
var _mapLoaded   = false;
var _pendingYrs  = [];
var _loadingYrs  = {};

// Compute bounding box [[minLng,minLat],[maxLng,maxLat]] from a GeoJSON feature
function featureBBox(feat){
  var mn=[Infinity,Infinity], mx=[-Infinity,-Infinity];
  function ring(r){ r.forEach(function(c){ if(c[0]<mn[0])mn[0]=c[0]; if(c[1]<mn[1])mn[1]=c[1]; if(c[0]>mx[0])mx[0]=c[0]; if(c[1]>mx[1])mx[1]=c[1]; }); }
  var g=feat.geometry;
  if(g.type==='Polygon') g.coordinates.forEach(ring);
  else if(g.type==='MultiPolygon') g.coordinates.forEach(function(p){p.forEach(ring);});
  return [[mn[0],mn[1]],[mx[0],mx[1]]];
}

// Capas de densidad v2: propiedad única dens_cat con las clases de la leyenda
// (Muy Baja · Baja · Media · Alta · Muy Alta), 5 decimales. Ver CHANGELOG (Tanda 2).
// Versión de cada capa (caché immutable: si el contenido cambia, sube la versión del nombre).
// 1990: capa real regenerada desde los píxeles GHSL 1990 (antes era una copia de 1980).
var DENS_GEOJSON_VER={1980:2,1990:3,2000:2,2010:2,2020:2};
var DENS_TILES_VER  ={1980:1,1990:2,2000:1,2010:1,2020:1};
function densLayerUrl(yr){ return yr+'_v'+DENS_GEOJSON_VER[yr]+'.geojson'; }   // vista 3D y respaldo
// PMTiles: teselas vectoriales por año (tippecanoe, capa "densidad"), por HTTP Range
function densTilesUrl(yr){ return new URL('capas/'+yr+'_v'+DENS_TILES_VER[yr]+'.pmtiles', location.href).href; }
var USE_PMTILES = typeof pmtiles!=='undefined';

// Expresión MapLibre: clase de densidad → color del año
function _densColorExpr(yr){
  var c=FGB_COLORS[yr];
  return ['match',['get','dens_cat'],
    FGB_CAT_LABELS[0],c[0],
    FGB_CAT_LABELS[1],c[1],
    FGB_CAT_LABELS[2],c[2],
    FGB_CAT_LABELS[3],c[3],
    FGB_CAT_LABELS[4],c[4],
    '#ccc'];
}

function updateDensLegend(){
  var leg=document.getElementById('densLegend');
  var items=document.getElementById('densItems');
  if(!leg) return;
  var activeYears=[1980,1990,2000,2010,2020].filter(function(y){return layerActive[y];});
  if(activeYears.length===0){leg.style.display='none';return;}
  leg.style.display='block';
  var html='';
  activeYears.forEach(function(yr){
    var cols=FGB_COLORS[yr];
    html+='<div style="font-size:9px;font-weight:700;color:'+YC[yr]+';margin-bottom:3px;padding-top:4px;border-top:1px solid var(--border)">'+yr+'</div>';
    FGB_CAT_LABELS.forEach(function(label,i){
      html+='<div style="display:flex;align-items:center;gap:5px;padding:1px 0">'+
        '<div style="width:10px;height:10px;border-radius:2px;background:'+cols[i]+';flex-shrink:0;border:1px solid rgba(0,0,0,.1)"></div>'+
        '<span style="font-size:10px">'+label+'</span></div>';
    });
  });
  if(items) items.innerHTML=html;
}

// Carga el GeoJSON de un año y lo agrega como capa de fill en MapLibre.
// En activaciones siguientes, solo muestra la capa ya cargada (cacheado).
// Si las teselas PMTiles fallan (p. ej. el servidor no responde a pedidos Range),
// se pasa una sola vez a los GeoJSON v2 y se recargan los años activos.
function _pmtilesFallback(){
  if(!USE_PMTILES) return;
  USE_PMTILES=false;
  console.warn('PMTiles no disponible; se usan las capas GeoJSON.');
  YEARS.forEach(function(y){
    if(map.getLayer('density-fill-'+y)) map.removeLayer('density-fill-'+y);
    if(map.getSource('year-'+y)) map.removeSource('year-'+y);
    _loadingYrs[y]=false;
    if(layerActive[y]) _ensureYearLayer(y);
  });
}

async function _ensureYearLayer(yr){
  if(!_mapLoaded){_pendingYrs.push(yr);return;}
  var layerId='density-fill-'+yr;
  if(map.getLayer(layerId)){
    map.setLayoutProperty(layerId,'visibility',layerActive[yr]?'visible':'none');
    return;
  }
  if(_loadingYrs[yr]) return;
  _loadingYrs[yr]=true;
  var loadMsg=document.getElementById('mapLoadMsg');
  var loadTxt=document.getElementById('mapLoadText');
  if(loadMsg){if(loadTxt)loadTxt.textContent='Cargando capa '+yr+'...';loadMsg.style.display='block';}
  try{
    if(USE_PMTILES){
      map.addSource('year-'+yr,{type:'vector',url:'pmtiles://'+densTilesUrl(yr)});
    } else {
      var resp=await fetch(densLayerUrl(yr));
      if(!resp.ok) throw new Error('HTTP '+resp.status);
      map.addSource('year-'+yr,{type:'geojson',data:await resp.json()});
    }
    var lyr={
      id:layerId,
      type:'fill',
      source:'year-'+yr,
      layout:{visibility:layerActive[yr]?'visible':'none'},
      paint:{'fill-color':_densColorExpr(yr),'fill-opacity':layerOpacity[yr]}
    };
    if(USE_PMTILES) lyr['source-layer']='densidad';
    map.addLayer(lyr,map.getLayer('provincia-limite')?'provincia-limite':'muni-outline');
    _loadingYrs[yr]=false;
    if(loadMsg)loadMsg.style.display='none';
  }catch(e){
    _loadingYrs[yr]=false;
    if(loadMsg){if(loadTxt)loadTxt.textContent='Error '+yr+': '+e.message;setTimeout(function(){if(loadMsg)loadMsg.style.display='none';},3000);}
    layerActive[yr]=false;
    var btn=document.getElementById('yrb-'+yr);
    if(btn)btn.classList.add('off');
  }
}

// Mapa base vectorial libre (OpenFreeMap, sin API key). Si el estilo no carga,
// el mapa arranca igual sobre un fondo liso crema.
var BASEMAP_STYLE_URL='https://tiles.openfreemap.org/styles/positron';
var BASEMAP_ATTR='<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> &copy; <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> · Datos &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">colaboradores de OpenStreetMap</a>';
var MAP_BG='#f5f3ee';

function _fallbackStyle(){
  return {
    version:8,
    sources:{'municipios':{type:'geojson',data:MUNICIPIOS_GJ}},
    layers:[{id:'bg-crema',type:'background',paint:{'background-color':MAP_BG}}]
  };
}

function _loadBaseStyle(){
  var ctrl=(typeof AbortController!=='undefined')?new AbortController():null;
  var timer=setTimeout(function(){ if(ctrl) ctrl.abort(); },5000);
  return fetch(BASEMAP_STYLE_URL,ctrl?{signal:ctrl.signal}:{})
    .then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
    .then(function(st){
      clearTimeout(timer);
      if(!st||!st.sources||!Array.isArray(st.layers)) throw new Error('estilo inválido');
      // Sin rótulos, como el basemap anterior (light_nolabels): las capas propias quedan legibles
      st.layers=st.layers.filter(function(l){ return l.type!=='symbol'; });
      st.layers.forEach(function(l){
        if(l.type==='background'){ l.paint=l.paint||{}; l.paint['background-color']=MAP_BG; }
      });
      Object.keys(st.sources).forEach(function(k){ st.sources[k].attribution=BASEMAP_ATTR; });
      st.sources['municipios']={type:'geojson',data:MUNICIPIOS_GJ};
      return st;
    })
    .catch(function(e){
      clearTimeout(timer);
      console.warn('Mapa base no disponible; se usa fondo liso.',e&&e.message);
      return _fallbackStyle();
    });
}

// Límite provincial. Con PROVINCIA_URL (GeoJSON oficial, p. ej. de IDECOR) se dibuja siempre;
// si no, se toma la capa boundary (admin_level 4) de OpenMapTiles del mapa base.
var PROVINCIA_URL=null;
function _addProvinciaLayer(){
  var paint={'line-color':'#1a1a1a','line-width':1.8,'line-opacity':0.75};
  if(PROVINCIA_URL){
    map.addSource('provincia',{type:'geojson',data:PROVINCIA_URL});
    map.addLayer({id:'provincia-limite',type:'line',source:'provincia',paint:paint},'muni-outline');
    return;
  }
  var st=map.getStyle(), vec=Object.keys(st.sources).filter(function(k){return st.sources[k].type==='vector';})[0];
  if(!vec) return; // modo de respaldo: sin mapa base no hay límites
  map.addLayer({id:'provincia-limite',type:'line',source:vec,'source-layer':'boundary',
    filter:['all',['==',['to-number',['get','admin_level']],4],['!=',['to-number',['coalesce',['get','maritime'],0]],1]],
    paint:paint},'muni-outline');
}

// Hoja inferior del mapa en móvil: arranca colapsada; se despliega al elegir un municipio
function toggleMapSheet(open){
  var sb=document.querySelector('.map-sidebar'), bt=document.getElementById('mapSheetToggle');
  if(!sb||!bt) return;
  if(open===undefined) open=sb.classList.contains('collapsed');
  sb.classList.toggle('collapsed',!open);
  bt.setAttribute('aria-expanded',open?'true':'false');
  bt.querySelector('span').textContent=open?'Ocultar panel':'Capas, búsqueda y leyenda';
}

function initMap(){
  if(window.matchMedia('(max-width:767px)').matches) toggleMapSheet(false);
  _loadBaseStyle().then(_createMap);
}

function _createMap(style){
  if(USE_PMTILES && !_createMap._proto){ _createMap._proto=new pmtiles.Protocol(); maplibregl.addProtocol('pmtiles',_createMap._proto.tile); }
  map=new maplibregl.Map({
    container:'map',
    style:style,
    center:[-63.78,-32.18],
    zoom:7,
    attributionControl:false,
    // En móvil el mapa está dentro de una página que scrollea: un dedo scrollea, dos mueven el mapa
    cooperativeGestures:window.matchMedia('(max-width:767px)').matches,
    locale:{
      'CooperativeGesturesHandler.WindowsHelpText':'Usá Ctrl + rueda para hacer zoom en el mapa',
      'CooperativeGesturesHandler.MacHelpText':'Usá ⌘ + rueda para hacer zoom en el mapa',
      'CooperativeGesturesHandler.MobileHelpText':'Usá dos dedos para mover el mapa'
    }
  });

  map.addControl(new maplibregl.NavigationControl(),'bottom-right');
  map.on('error',function(e){ if(USE_PMTILES && e && e.sourceId && /^year-/.test(e.sourceId)) _pmtilesFallback(); });
  map.addControl(new maplibregl.AttributionControl({compact:true}),'bottom-left');

  map.on('load',function(){
    _mapLoaded=true;

    // Límites municipales (siempre visibles, desde GeoJSON inline)
    map.addLayer({id:'muni-outline',type:'line',source:'municipios',paint:{'line-color':'#333','line-width':0.8,'line-opacity':0.35}});
    // Contorno provincial, por encima de la densidad
    _addProvinciaLayer();
    // Fill invisible solo para capturar eventos de puntero
    map.addLayer({id:'muni-interact',type:'fill',source:'municipios',paint:{'fill-color':'#000','fill-opacity':0}});
    // Resaltado hover
    map.addLayer({id:'muni-hover',type:'line',source:'municipios',paint:{'line-color':'#1a1a1a','line-width':1.4,'line-opacity':0.55},filter:['==','NOMBRE','']});
    // Resaltado selección
    // Selección: contorno grueso (borde blanco + tinta), sin relleno que tape la densidad
    map.addLayer({id:'muni-selected-casing',type:'line',source:'municipios',layout:{'line-join':'round'},paint:{'line-color':'#ffffff','line-width':6,'line-opacity':0.9},filter:['==','NOMBRE','']});
    map.addLayer({id:'muni-selected',type:'line',source:'municipios',layout:{'line-join':'round'},paint:{'line-color':'#1a1a1a','line-width':2.8},filter:['==','NOMBRE','']});

    // Handlers de hover y click
    map.on('mousemove','muni-interact',function(e){
      if(e.features.length>0){
        var n=e.features[0].properties.NOMBRE;
        if(n!==selectedMun)map.setFilter('muni-hover',['==','NOMBRE',n]);
        map.getCanvas().style.cursor='pointer';
      }
    });
    map.on('mouseleave','muni-interact',function(){
      map.setFilter('muni-hover',['==','NOMBRE','']);
      map.getCanvas().style.cursor='';
    });
    map.on('click','muni-interact',function(e){
      if(e.features.length>0)selectMun(e.features[0].properties.NOMBRE,e.features[0]);
    });

    // Procesar años que llegaron antes del evento load
    var pending=_pendingYrs.splice(0);
    pending.forEach(function(yr){_ensureYearLayer(yr);});

    map.fitBounds([[-65.769,-34.858],[-61.788,-29.512]],{padding:10});
    renderMunList('');
    setTimeout(function(){
      // Años activados antes de que el mapa existiera: cargarlos; si no hay ninguno, 2020
      var act=YEARS.filter(function(y){return layerActive[y];});
      if(!act.length) toggleMapYr(2020);
      else act.forEach(function(y){ if(!map.getLayer('density-fill-'+y)) _ensureYearLayer(y); });
    },100);
  });
}

function toggleMapYr(yr){
  var btn=document.getElementById('yrb-'+yr);
  var bgs={1980:'#edfced',1990:'#e8f9fd',2000:'#f3edff',2010:'#fef0f0',2020:'#fff5e6'};
  if(layerActive[yr]){
    layerActive[yr]=false;
    if(map&&map.getLayer('density-fill-'+yr))map.setLayoutProperty('density-fill-'+yr,'visibility','none');
    if(btn){btn.classList.add('off');btn.style.background='transparent';}
  }else{
    layerActive[yr]=true;
    if(btn){btn.classList.remove('off');btn.style.background=bgs[yr]||'transparent';}
    if(map)_ensureYearLayer(yr);
    if(typeof is3D!=='undefined'&&is3D){tlCurYr=yr;render3DMap();}
  }
  updateDensLegend();
}

function setLayerOpacity(yr,val){
  layerOpacity[yr]=parseInt(val)/100;
  if(map && map.getLayer('density-fill-'+yr)){
    map.setPaintProperty('density-fill-'+yr,'fill-opacity',layerOpacity[yr]);
  }
}

function selectMun(name,featOrNull){
  var es=document.getElementById('empty-state');
  var cc=document.getElementById('charts-container');
  if(es) es.style.display='none';
  if(cc) cc.style.display='flex';

  selectedMun=name;
  if(window.matchMedia('(max-width:767px)').matches) toggleMapSheet(true);

  if(map){
    map.setFilter('muni-selected',['==','NOMBRE',name]);
    map.setFilter('muni-selected-casing',['==','NOMBRE',name]);
    map.setFilter('muni-hover',['==','NOMBRE','']);
  }

  // Zoom to feature bounds
  var feat=featOrNull;
  if(!feat || !feat.geometry){
    feat=MUNICIPIOS_GJ.features.find(function(f){return f.properties.NOMBRE===name;});
  }
  if(feat && feat.geometry){
    if(typeof is3D!=='undefined'&&is3D&&deckInstance){
      // En vista 3D: volar al municipio y actualizar highlight
      _fly3DTo(feat);
      deckInstance.setProps({layers:_build3DLayers(tlCurYr||2020,loaded3D[tlCurYr||2020])});
    } else if(map){
      try{ map.fitBounds(featureBBox(feat),{padding:20,maxZoom:12}); }catch(e){}
    }
  }

  const ld=DATA.localities[name];
  document.getElementById('mapInfoPanel').style.display='block';
  document.getElementById('mapInfoName').textContent=dn(name);
  document.getElementById('chartLocName').textContent=dn(name);
  var ld2=DATA.localities[name];
  if(ld2) document.getElementById('chartLocMeta').textContent=depn(ld2.dep)+' · '+rlab(ld2.region_nombre);
  renderCharts();
  if(ld){
    const d20=ld.data[2020]||{},d80=ld.data[1980]||{};
    const rid=ld.region_id||1;
    const p=pct(d80.pob,d20.pob);
    const ppix=d80.pix>0?((d20.pix-d80.pix)/d80.pix*100).toFixed(1):null;
    const patron=clasificarPatron(name);
    document.getElementById('mapInfoContent').innerHTML=
      '<div style="font-size:10px;color:var(--muted);margin-bottom:8px">'+depn(ld.dep)+' · '+regBadge(ld.region_nombre)+'</div>'+
      '<div class="map-info-row"><span>Población (censo 2022)</span><span>'+fmt(d20.pob)+'</span></div>'+
      '<div class="map-info-row"><span>Sup. construida 2020</span><span>'+fmt(d20.pix)+' ha</span></div>'+
      '<div class="map-info-row"><span>Dens. construida 2020</span><span>'+fmt(d20.den,1)+' m² BU/píxel</span></div>'+
      '<div class="map-info-row"><span>Núcleos 2020</span><span>'+fmt(d20.nuc)+'</span></div>'+
      '<div class="map-info-row" style="margin-top:4px;padding-top:4px;border-top:2px solid var(--border)">'+
        '<span>Crec. pob. 1980–2022</span><span style="color:'+(p&&parseFloat(p)>=0?'#1a7a1a':'#7a1a1a')+';font-weight:700">'+fmtPct(p)+'</span>'+
      '</div>'+
      '<div class="map-info-row">'+
        '<span>Crec. sup. 1980–2020</span><span style="color:'+(ppix&&parseFloat(ppix)>=0?'#1a7a1a':'#7a1a1a')+';font-weight:700">'+fmtPct(ppix)+'</span>'+
      '</div>'+
      (patron?'<div class="map-info-row" style="margin-top:4px"><span>Patrón</span><span style="font-size:10px;font-weight:700;color:'+patron.color+'">'+patron.label+'</span></div>':'')+
      '<div class="nota-chart">Población: censos 1980–2022 · superficie: GHSL 1980–2020.</div>'+
      '<button onclick="jumpToMunFromMap()" style="width:100%;margin-top:8px;padding:6px;background:var(--text);color:#fff;border:none;border-radius:5px;font-family:Space Mono,monospace;font-size:10px;cursor:pointer;font-weight:700">Ver análisis →</button>';
  }
}

function flipCard(btn){
  var cc=btn.closest('.cc');
  cc.classList.add('flip-out');
  cc.addEventListener('animationend',function h1(){
    cc.removeEventListener('animationend',h1);
    cc.classList.remove('flip-out');
    cc.classList.toggle('flipped');
    cc.classList.add('flip-in');
    cc.addEventListener('animationend',function h2(){
      cc.removeEventListener('animationend',h2);
      cc.classList.remove('flip-in');
    },{once:true});
  },{once:true});
}

function goToLocalidad(){
  if(!selectedMun) return;
  showSec('analisis', document.querySelector('.nav-items button[onclick*="analisis"]'));
  var rf=document.getElementById('aRegFilt');
  if(rf && DATA.localities[selectedMun]) rf.value=DATA.localities[selectedMun].region_nombre;
  buildAnalisis();
}

// "Ver análisis →": en pantallas angostas los gráficos están debajo del mapa → scroll hasta ellos;
// en escritorio ya están a la derecha → se vuelve al primero y se marca la columna.
function jumpToMunFromMap(){
  if(!selectedMun) return;
  renderCharts();
  var panel=document.querySelector('.mapa-right');
  if(!panel) return;
  var cc=document.getElementById('charts-container');
  if(window.matchMedia('(max-width:767px)').matches){
    var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    panel.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
  } else {
    if(cc) cc.scrollTop=0;
    panel.classList.remove('flash'); void panel.offsetWidth; panel.classList.add('flash');
  }
}

function renderMunList(q){
  const el=document.getElementById('mapMunList');
  const nq=_normStr(q);
  const f=LOCS.filter(l=>_normStr(dn(l)).includes(nq)).slice(0,60);
  el.innerHTML=f.map(l=>{
    const safe=l.replace(/'/g,"\\'");
    return '<div onclick="zoomToMun(\''+safe+'\')" style="padding:5px 6px;cursor:pointer;border-radius:4px;transition:background .1s" onmouseover="this.style.background=\'var(--surface)\'" onmouseout="this.style.background=\'\'">'+dn(l)+'</div>';
  }).join('');
}
function filterMapSearch(q){renderMunList(q);}
function zoomToMun(name){
  var feat=MUNICIPIOS_GJ.features.find(function(f){return f.properties.NOMBRE===name;});
  if(feat) selectMun(name,feat);
}

// ── LOCALIDAD ──
function toggleYr(yr,chip){
  if(activeYrs.has(yr)&&activeYrs.size===1) return;
  if(activeYrs.has(yr)) activeYrs.delete(yr); else activeYrs.add(yr);
  chip.classList.toggle('off',!activeYrs.has(yr));
  chip.setAttribute('aria-pressed',activeYrs.has(yr)?'true':'false');
  renderCharts();
}
function renderCharts(){
  var loc=selectedMun;

  if(!loc||!DATA.localities[loc]) return;
  var ld=DATA.localities[loc];
  var rid=ld.region_id||1;
  // Header
  var cn=document.getElementById('chartLocName');
  if(cn) cn.textContent=dn(loc);
  var cm=document.getElementById('chartLocMeta');
  if(cm) cm.innerHTML='Dpto. '+depn(ld.dep)+' &nbsp;·&nbsp; '+regBadge(ld.region_nombre)+'';
  // Charts
  var inds=['pob','pix','den','nuc'];
  var ids=['chL1','chL2','chL3','chL4'];
  inds.forEach(function(ind,i){
    killChart('loc'+i);
    var ctx=document.getElementById(ids[i]);
    if(!ctx) return;
    var pts=YEARS.filter(function(y){return activeYrs.has(y);}).map(function(y){
      return {x:y, y:(ld.data[y]&&ld.data[y][ind]!=null)?ld.data[y][ind]:null};
    });
    charts['loc'+i]=new Chart(ctx.getContext('2d'),{
      type:'line',
      data:{datasets:[{
        label:dn(loc),
        data:pts,
        segment:{borderColor:function(ctx2){var yr=pts[ctx2.p0DataIndex]&&pts[ctx2.p0DataIndex].x;return YC[yr]||'#888';}},
        pointBackgroundColor:pts.map(function(p){return YC[p.x]||'#888';}),
        pointBorderColor:pts.map(function(p){return YC[p.x]||'#888';}),
        pointRadius:6,
        pointHoverRadius:8,
        borderWidth:2.5,
        tension:0.35,
        fill:false
      }]},
      options:{
        responsive:true,
        maintainAspectRatio:false,
        parsing:false,
        animation:{duration:300},
        plugins:{
          legend:{display:false},
          tooltip:{callbacks:{
            title:function(items){var y=items[0].raw.x;return ind==='pob'?'Censo '+CENSO[y]:'GHSL '+y;},
            label:function(item){return ' '+fmt(item.raw.y, ind==='den'?1:0);}
          }}
        },
        scales:{
          x:{type:'linear',min:1978,max:2022,
            afterBuildTicks:function(ax){ax.ticks=YEARS.map(function(v){return {value:v};});},
            ticks:{color:'#888879',font:{family:'Space Mono',size:10},stepSize:10,callback:function(v){return ind==='pob'?CENSO[v]:v;}},
            grid:{color:'rgba(0,0,0,.05)'}},
          y:{beginAtZero:true,
            ticks:{color:'#888879',font:{family:'Space Mono',size:10},maxTicksLimit:5,callback:function(v){return fmt(v,ind==='den'?1:0);}},
            grid:{color:'rgba(0,0,0,.05)'}}
        }
      }
    });
  });
  ariaCharts();
}



// Helper: compute display data for a chart (absolute or % relative to 1980)
// Regional data points (absolute or relative to 1980)




// Helper: y-axis formatter depending on mode


// Helper: tooltip formatter



// ── RESUMEN ──






// ══ ANÁLISIS REGIONAL ══
var regYr = 2020;
var regEsc = 'norm'; // 'norm' = base 100 (1980) · 'abs' = valores absolutos
function setRegEsc(esc,btn){
  regEsc=esc;
  document.querySelectorAll('#regEscNorm,#regEscAbs').forEach(function(b){ b.classList.remove('on'); b.setAttribute('aria-pressed','false'); });
  if(btn){ btn.classList.add('on'); btn.setAttribute('aria-pressed','true'); }
  buildRegional();
}
const RNAMES = Object.keys(DATA.regions);
const RCOLORS_MAP = REGION_COLORS;
const IND_LABELS = {pob:'Población',pix:'Superficie construida',den:'Densidad construida',nuc:'Núcleos'};
const IND_UNITS  = {pob:'habitantes',pix:'ha',den:'m² BU/píxel',nuc:'núcleos'};

function setRegYr(yr, btn){
  regYr = yr;
  document.querySelectorAll('.reg-yr-pills .pill').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  var ind = document.getElementById('regInd') ? document.getElementById('regInd').value : (currentRegInd||'pob');
  updateRegBar(ind);
  updateRegTable(ind);
}

function setRegInd(ind, btn){
  currentRegInd = ind;
  document.querySelectorAll('#regIndTabs .ind-tab').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  document.getElementById('regInd').value = ind;
  buildRegional();
}

function buildRegional(){
  var ind = document.getElementById('regInd') ? document.getElementById('regInd').value : (currentRegInd||'pob');
  var units = IND_UNITS[ind];
  var label = IND_LABELS[ind];

  // Update subtitle
  var sub = document.getElementById('regIndUnits');
  if(sub) sub.textContent = units + (ind==='pob' ? ' · censos 1980–2022' : ' · GHSL 1980–2020');
  var title = document.getElementById('regTableTitle');
  if(title) title.textContent = 'Evolución por región · ' + label;

  // ── Line chart: evolution all regions ──
  var rnorm = regEsc==='norm';
  var rsub = document.getElementById('regTimeSub');
  if(rsub) rsub.textContent = rnorm ? 'índice 100 = valor de 1980 · todas las regiones' : 'valores absolutos · todas las regiones';
  function regVal(rn,y){ return DATA.regions[rn][y] ? DATA.regions[rn][y][ind] : 0; }
  killChart('regTime');
  charts['regTime'] = new Chart(document.getElementById('chRegTime').getContext('2d'),{
    type: 'line',
    data: {
      labels: YEARS,
      datasets: RNAMES.map(function(rn){
        return {
          label: rlab(rn),
          data: YEARS.map(function(y){
            var v=regVal(rn,y), b=regVal(rn,1980);
            return rnorm ? (b>0 ? Math.round(v/b*1000)/10 : null) : v;
          }),
          borderColor: RCOLORS_MAP[rn] || '#888',
          backgroundColor: 'transparent',
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: RCOLORS_MAP[rn] || '#888',
          pointHoverRadius: 6,
          borderWidth: 2,
          fill: false
        };
      })
    },
    options:{
      responsive: true,
      maintainAspectRatio: false,
      plugins:{
        legend:{
          position: 'bottom',
          onHover: legendDimHover, onLeave: legendDimLeave,
          labels:{
            color:'#888879',
            font:{family:'Space Mono',size:cfs(9)},
            padding: 8,
            boxWidth: 10,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip:{
          callbacks:{
            label: function(item){
              var abs = regVal(RNAMES[item.datasetIndex], YEARS[item.dataIndex]);
              var absTxt = fmt(abs, ind==='den'?1:0) + ' ' + IND_UNITS[ind];
              return rnorm ? ' ' + item.dataset.label + ': ' + fmtNum(item.raw,1) + ' (base 100) · ' + absTxt
                           : ' ' + item.dataset.label + ': ' + absTxt;
            }
          }
        }
      },
      scales:{
        x:{ ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(9)}}, grid:{color:'rgba(0,0,0,.05)'} },
        y:{ ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(9)},callback:function(v){return rnorm?fmt(v):fmt(v,ind==='den'?1:0);}}, grid:{color:'rgba(0,0,0,.05)'}, beginAtZero:!rnorm }
      }
    }
  });

  updateRegBar(ind);
  updateRegTable(ind);
}

function updateRegBar(ind){
  var lbl = document.getElementById('regBarYrLbl');
  if(lbl) lbl.textContent = regYr;

  // Sort regions by value descending for the bar chart
  var sorted = RNAMES.slice().sort(function(a,b){
    return (DATA.regions[b][regYr]?.[ind]||0) - (DATA.regions[a][regYr]?.[ind]||0);
  });

  killChart('regBar');
  charts['regBar'] = new Chart(document.getElementById('chRegBar').getContext('2d'),{
    type: 'bar',
    data:{
      labels: sorted.map(function(rn){ return rlab(rn).replace('Región ',''); }),
      datasets:[{
        data: sorted.map(function(rn){ return DATA.regions[rn][regYr]?.[ind]||0; }),
        backgroundColor: sorted.map(function(rn){ return RCOLORS_MAP[rn]||'#888'; }),
        borderRadius: 4,
        borderSkipped: false
      }]
    },
    options:{
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins:{
        legend:{display:false},
        tooltip:{callbacks:{
          label:function(item){ return ' '+fmt(item.raw,ind==='den'?1:0)+' '+IND_UNITS[ind]; }
        }}
      },
      scales:{
        x:{ ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(9)},callback:function(v){return fmt(v,ind==='den'?1:0);}}, grid:{color:'rgba(0,0,0,.05)'}, beginAtZero:true },
        y:{ ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(9)}}, grid:{display:false} }
      }
    }
  });
  ariaCharts();
}

function updateRegTable(ind){
  var thead = document.getElementById('regTableHead');
  var tbody = document.getElementById('regTableBody');
  if(!thead||!tbody) return;

  // Header
  var hrow = '<tr><th>Región</th>';
  YEARS.forEach(function(y){
    hrow += '<th class="yr-col" style="border-top:3px solid '+YC[y]+'">'+y+'</th>';
  });
  hrow += '<th class="grow-col">Crec. total</th></tr>';
  thead.innerHTML = hrow;

  // Sort by 2020 value descending
  var sorted = RNAMES.slice().sort(function(a,b){
    return (DATA.regions[b][2020]?.[ind]||0) - (DATA.regions[a][2020]?.[ind]||0);
  });

  tbody.innerHTML = '';
  setTimeout(updateScrollHint,0);
  sorted.forEach(function(rn, rank){
    var col = RCOLORS_MAP[rn] || '#888';
    var val80 = DATA.regions[rn][1980]?.[ind]||0;
    var val20 = DATA.regions[rn][2020]?.[ind]||0;
    var growth = val80 > 0 ? ((val20-val80)/val80*100).toFixed(1) : null;
    var growthColor = growth && parseFloat(growth)>=0 ? '#1a7a1a' : '#7a1a1a';

    var tr = document.createElement('tr');
    var cells = '<td><span class="reg-dot" style="background:'+col+'"></span>'+rlab(rn)+'</td>';
    YEARS.forEach(function(y){
      var v = DATA.regions[rn][y]?.[ind]||0;
      cells += '<td class="val-col" style="color:'+YC[y]+'">'+(v?fmt(v,ind==='den'?1:0):'—')+'</td>';
    });
    cells += '<td class="grow-col" style="color:'+growthColor+'">'+fmtPct(growth)+'</td>';
    tr.innerHTML = cells;
    tbody.appendChild(tr);
  });
}

// ── TABLA ──
var tblModo = 'normal';
function setTblModo(modo,btn){tblModo=modo;document.querySelectorAll('#tblModoNorm,#tblModoEvo').forEach(function(b){b.classList.remove('on');});if(btn)btn.classList.add('on');renderTbl();}
function populateRegFilt(){const rf=document.getElementById('regFilt');if(rf.children.length>1)return;REGIONS.forEach(r=>{const o=document.createElement('option');o.value=r;o.textContent=rlab(r);rf.appendChild(o);});}
function setTblYr(yr,btn){tblYr=yr;tblPage=0;document.querySelectorAll('#tblPills .pill').forEach(b=>b.classList.remove('on'));btn.classList.add('on');document.getElementById('tblYrLbl').textContent=yr;renderTbl();}
function setSortCol(col){sortCol=col;document.getElementById('sortSel').value=col;renderTbl();}
function getFiltered(){
  const q=document.getElementById('srch').value.toLowerCase().trim();
  const rf=document.getElementById('regFilt').value;
  let arr=LOCS.map(l=>{const d=DATA.localities[l];return{name:l,...d,...(d.data[tblYr]||{pob:0,pix:0,den:0,nuc:0})};});
  if(q){const nq=_normStr(q);arr=arr.filter(r=>_normStr(dn(r.name)).includes(nq)||_normStr(depn(r.dep)).includes(nq));}
  if(rf) arr=arr.filter(r=>r.region_nombre===rf);
  const sc=document.getElementById('sortSel').value||sortCol;
  if(sc==='nombre') arr.sort((a,b)=>dn(a.name).localeCompare(dn(b.name),'es'));
  else arr.sort((a,b)=>(b[sc]||0)-(a[sc]||0));
  return arr;
}
function renderTbl(){
  populateRegFilt();
  const arr=getFiltered(),perPage=20,pages=Math.max(1,Math.ceil(arr.length/perPage));
  if(tblPage>=pages) tblPage=pages-1;
  const slice=arr.slice(tblPage*perPage,(tblPage+1)*perPage);
  const tb=document.getElementById('tblBody');tb.innerHTML='';
  const yc=YC[tblYr];
  var thead=document.getElementById('mainTHead');
  // Clase en <table> para ocultar columnas en mobile vía CSS
  document.getElementById('mainTable').className=tblModo==='evo'?'tbl-evo':'tbl-normal';
  if(tblModo==='evo'){
    if(thead) thead.innerHTML='<tr><th>#</th><th>Localidad</th><th>Región</th><th>Patrón</th>'+
      [1980,1990,2000,2010,2020].map(function(y){return '<th style="border-top:3px solid '+YC[y]+';text-align:right">Pob. '+CENSO[y]+'</th><th style="border-top:3px solid '+YC[y]+';text-align:right">Sup. '+y+' (ha)</th>';}).join('')+'</tr>';
    slice.forEach(function(r,i){
      var p=clasificarPatron(r.name);
      var cells='<td style="color:var(--muted);font-size:10px">'+(tblPage*perPage+i+1)+'</td>'+
        '<td class="td-n">'+dn(r.name)+'</td>'+
        '<td>'+regBadge(r.region_nombre)+'</td>'+
        '<td style="font-size:10px;font-weight:700;color:'+(p?p.color:'#888')+'">'+(p?p.label:'—')+'</td>'+
        [1980,1990,2000,2010,2020].map(function(y){
          var d=DATA.localities[r.name].data[y]||{};
          return '<td style="text-align:right;color:'+YC[y]+';font-variant-numeric:tabular-nums">'+fmt(d.pob||0)+'</td>'+
                 '<td style="text-align:right;color:'+YC[y]+';font-variant-numeric:tabular-nums">'+fmt(d.pix||0)+'</td>';
        }).join('');
      var tr=document.createElement('tr');tr.innerHTML=cells;tb.appendChild(tr);
    });
  } else {
    if(thead) thead.innerHTML='<tr><th>#</th><th>Localidad</th><th>Dpto.</th><th>Región</th>'+
      '<th onclick="setSortCol(\'pob\')">Población (censo '+CENSO[tblYr]+')</th><th onclick="setSortCol(\'pix\')">Sup. (ha)</th>'+
      '<th onclick="setSortCol(\'den\')" title="Densidad construida: m² BU por píxel">Dens. (m² BU/píxel)</th><th onclick="setSortCol(\'nuc\')">Núcleos</th>'+
      '<th>Crec.Pob%</th><th>Crec.Sup%</th><th>Patrón</th><th>Mapa</th></tr>';
    slice.forEach((r,i)=>{
      const rid=r.region_id||1;
      var d80=DATA.localities[r.name].data[1980]||{};
      var d=DATA.localities[r.name].data[tblYr]||{};
      var gp=d80.pob>0?((d.pob-d80.pob)/d80.pob*100).toFixed(1):null;
      var gpx=d80.pix>0?((d.pix-d80.pix)/d80.pix*100).toFixed(1):null;
      var p=clasificarPatron(r.name);
      const tr=document.createElement('tr');
      tr.onclick=()=>jumpToLoc(r.name);
      tr.innerHTML='<td style="color:var(--muted);font-size:10px">'+(tblPage*perPage+i+1)+'</td>'+
        '<td class="td-n">'+dn(r.name)+'</td><td style="color:var(--muted);font-size:10px">'+depn(r.dep)+'</td>'+
        '<td>'+regBadge(r.region_nombre)+'</td>'+
        '<td style="color:'+yc+';font-variant-numeric:tabular-nums">'+fmt(r.pob)+'</td>'+
        '<td style="color:'+yc+';font-variant-numeric:tabular-nums">'+fmt(r.pix)+'</td>'+
        '<td style="color:'+yc+';font-variant-numeric:tabular-nums">'+fmt(r.den,1)+'</td>'+
        '<td style="color:'+yc+';font-variant-numeric:tabular-nums">'+fmt(r.nuc)+'</td>'+
        '<td style="font-size:11px;color:'+(gp&&parseFloat(gp)>=0?'#1a7a1a':'#7a1a1a')+';font-weight:700">'+fmtPct(gp)+'</td>'+
        '<td style="font-size:11px;color:'+(gpx&&parseFloat(gpx)>=0?'#1a7a1a':'#7a1a1a')+';font-weight:700">'+fmtPct(gpx)+'</td>'+
        '<td style="font-size:10px;font-weight:700;color:'+(p?p.color:'#888')+'">'+(p?p.label:'—')+'</td>'+
        '<td onclick="event.stopPropagation()" style="text-align:center">'+
          '<button onclick="downloadMapPDF(\''+r.name.replace(/'/g,"\\'")+'\',' +
            '\''+r.region_nombre.replace(/'/g,"\\'")+'\''+
            ',this)" '+
          'title="Descargar mapa · '+dn(r.name)+'" '+
          'style="display:inline-flex;align-items:center;gap:3px;color:var(--muted);font-size:9px;background:none;border:1px solid var(--border);border-radius:4px;padding:3px 7px;cursor:pointer;font-family:Space Mono,monospace;transition:all .2s" '+
          'onmouseover="this.style.borderColor=\'var(--text)\';this.style.color=\'var(--text)\'" '+
          'onmouseout="this.style.borderColor=\'var(--border)\';this.style.color=\'var(--muted)\'"'+
          '>↓ mapa</button></td>';
      tb.appendChild(tr);
    });
  }
  document.getElementById('tblCnt').textContent=arr.length+' localidades';
  document.getElementById('pageInfo').textContent='Pág. '+(tblPage+1)+'/'+pages+' · '+arr.length+' total';
  document.getElementById('btnPrev').disabled=tblPage===0;
  document.getElementById('btnNext').disabled=tblPage>=pages-1;
}
function chPage(d){tblPage=Math.max(0,tblPage+d);renderTbl();}
function jumpToLoc(name){selectedMun=name;renderCharts();document.getElementById('chartLocName').textContent=dn(name);}

// ── COMPARADOR ──
var cmpModo = 'localidad'; // 'localidad' o 'region'
var cmpEsc = 'norm'; // 'norm' (base 100, por defecto) o 'abs'
var cmpRegSels = [Object.keys(DATA.regions)[0],'',''];

function setCmpModo(modo, btn){
  cmpModo = modo;
  document.querySelectorAll('#cmpModoLoc,#cmpModoReg').forEach(function(b){b.classList.remove('on');});
  if(btn) btn.classList.add('on');
  var hallazgos = document.getElementById('cmpHallazgos');
  if(hallazgos) hallazgos.style.display = modo==='region' ? 'block' : 'none';
  buildCmp();
}

function setCmpEsc(esc, btn){
  cmpEsc = esc;
  document.querySelectorAll('#cmpEscAbs,#cmpEscNorm').forEach(function(b){b.classList.remove('on');});
  if(btn) btn.classList.add('on');
  renderCmpChart();
}

function buildCmp(){
  const g=document.getElementById('cmpGrid');g.innerHTML='';
  if(cmpModo==='region'){
    // Comparar regiones
    var RNAMES2 = Object.keys(DATA.regions);
    [0,1,2].forEach(function(i){
      const d=document.createElement('div');d.className='cmp-c';
      const s=document.createElement('select');
      s.setAttribute('aria-label','Región '+(i+1)+' a comparar');
      s.innerHTML='<option value="">— Región —</option>'+RNAMES2.map(function(r){return'<option value="'+r+'"'+(r===cmpRegSels[i]?' selected':'')+'>'+rlab(r)+'</option>';}).join('');
      s.onchange=function(){cmpRegSels[i]=s.value;buildCmpRegCards();renderCmpChart();buildHallazgos();};
      d.appendChild(s);
      const inner=document.createElement('div');inner.id='cc'+i;d.appendChild(inner);
      g.appendChild(d);
    });
    buildCmpRegCards();
    buildHallazgos();
  } else {
    [0,1,2].forEach(function(i){
      const d=document.createElement('div');d.className='cmp-c';
      const s=document.createElement('select');
      s.setAttribute('aria-label','Localidad '+(i+1)+' a comparar');
      s.innerHTML='<option value="">— Seleccionar —</option>'+LOCS.map(function(l){return'<option value="'+l+'"'+(l===cmpSels[i]?' selected':'')+'>'+dn(l)+'</option>';}).join('');
      s.onchange=function(){cmpSels[i]=s.value;buildCmpCards();renderCmpChart();};
      d.appendChild(s);
      const inner=document.createElement('div');inner.id='cc'+i;d.appendChild(inner);
      g.appendChild(d);
    });
    buildCmpCards();
  }
  renderCmpChart();
}

function buildCmpCards(){
  [0,1,2].forEach(i=>{
    const el=document.getElementById('cc'+i),loc=cmpSels[i];
    if(!loc||!DATA.localities[loc]){el.innerHTML='<p style="color:var(--muted);font-size:11px;text-align:center;padding:14px">Seleccioná una localidad</p>';return;}
    const ld=DATA.localities[loc],rid=ld.region_id||1;
    var p=clasificarPatron(loc);
    el.innerHTML='<div style="font-size:10px;color:var(--muted);margin-bottom:8px">'+depn(ld.dep)+' · '+regBadge(ld.region_nombre)+'</div>'+
      '<div style="font-size:10px;font-weight:700;color:'+(p?p.color:'#888')+';margin-bottom:6px">'+(p?'Patrón: '+p.label:'')+'</div>'+
      YEARS.map(function(y){const d=ld.data[y]||{};return'<div class="cmp-row"><span style="font-size:10px;font-weight:700;color:'+YC[y]+'">'+y+'</span><span style="font-size:11px">'+fmt(d.pob)+' hab &nbsp;·&nbsp; '+fmt(d.pix)+' ha</span></div>';}).join('');
  });
}

function buildCmpRegCards(){
  [0,1,2].forEach(function(i){
    const el=document.getElementById('cc'+i);
    var rn=cmpRegSels[i];
    if(!rn||!DATA.regions[rn]){el.innerHTML='<p style="color:var(--muted);font-size:11px;text-align:center;padding:14px">Seleccioná una región</p>';return;}
    var col=RCOLORS_MAP[rn]||'#888';
    var r80=DATA.regions[rn][1980]||{}, r20=DATA.regions[rn][2020]||{};
    var gp=r80.pob>0?((r20.pob-r80.pob)/r80.pob*100).toFixed(1):null;
    var gpx=r80.pix>0?((r20.pix-r80.pix)/r80.pix*100).toFixed(1):null;
    el.innerHTML='<div style="font-size:11px;font-weight:700;color:'+col+';margin-bottom:8px">'+rlab(rn)+'</div>'+
      '<div class="cmp-row"><span>Crec. pob. 1980→2022</span><span style="font-weight:700;color:'+(gp&&parseFloat(gp)>=0?'#1a7a1a':'#7a1a1a')+'">'+fmtPct(gp)+'</span></div>'+
      '<div class="cmp-row"><span>Crec. sup. 1980→2020</span><span style="font-weight:700;color:'+(gpx&&parseFloat(gpx)>=0?'#1a7a1a':'#7a1a1a')+'">'+fmtPct(gpx)+'</span></div>'+
      YEARS.map(function(y){var d=DATA.regions[rn][y]||{};return'<div class="cmp-row"><span style="font-size:10px;font-weight:700;color:'+YC[y]+'">'+y+'</span><span style="font-size:11px">'+fmt(d.pob)+' hab</span></div>';}).join('');
  });
}

// Mejora #16: hallazgos auto-generados por región
function buildHallazgos(){
  var container = document.getElementById('hallazgosContent');
  if(!container) return;
  var rns = Object.keys(DATA.regions);
  container.innerHTML = rns.map(function(rn){
    var r80=DATA.regions[rn][1980]||{}, r20=DATA.regions[rn][2020]||{};
    var gp=r80.pob>0?((r20.pob-r80.pob)/r80.pob*100).toFixed(1):null;
    var gpx=r80.pix>0?((r20.pix-r80.pix)/r80.pix*100).toFixed(1):null;
    var den80=r80.den||0, den20=r20.den||0;
    var denTend=den20>den80?'densificación moderada':'tendencia a la dispersión (densidad descendente)';
    var col=RCOLORS_MAP[rn]||'#888';
    return '<div style="background:var(--card);border:1px solid var(--border);border-left:4px solid '+col+';border-radius:6px;padding:12px">'+
      '<div style="font-size:11px;font-weight:700;color:'+col+';margin-bottom:6px">'+rlab(rn)+'</div>'+
      '<div style="font-family:Inter,sans-serif;font-size:12px;line-height:1.6;color:var(--text)">'+
        'Crecimiento poblacional 1980–2022 <strong>'+fmtPct(gp)+'</strong>, '+
        'expansión superficial 1980–2020 <strong>'+fmtPct(gpx)+'</strong>. '+
        'Densidad media: '+(den80?fmt(den80,0):'—')+' → '+(den20?fmt(den20,0):'—')+' m² BU/píxel ('+denTend+'). '+
        'Núcleos 1980→2020: '+(r80.nuc||'—')+' → '+(r20.nuc||'—')+'.'+
      '</div>'+
    '</div>';
  }).join('');
}

function renderCmpChart(){
  killChart('cmp');
  killChart('cmpRel');
  var ind=document.getElementById('cmpInd').value;
  var norm=(cmpEsc==='norm');
  // Regiones: su color de REGION_COLORS. Localidades: tinta con trazos distintos (no son regiones).
  var INK=['#1a1a1a','#5c5c52','#8f8b7c'], DASH=[[],[7,4],[2,3]];
  function lineCol(sel,i){ return cmpModo==='region'?(REGION_COLORS[sel]||'#888'):INK[i]; }
  function lineDash(i){ return cmpModo==='region'?[]:DASH[i]; }

  // Determine sources (localities or regions)
  var sels = cmpModo==='region' ? cmpRegSels : cmpSels;
  var getData = cmpModo==='region'
    ? function(sel,y){return (DATA.regions[sel]&&DATA.regions[sel][y]&&DATA.regions[sel][y][ind])||0;}
    : function(sel,y){return (DATA.localities[sel]&&DATA.localities[sel].data&&DATA.localities[sel].data[y]&&DATA.localities[sel].data[y][ind])||0;};

  var ds = sels.map(function(sel,i){
    if(!sel) return null;
    var base = getData(sel,1980);
    return {
      label:cmpModo==='region'?rlab(sel):dn(sel),
      data:YEARS.map(function(y){
        var v=getData(sel,y);
        if(norm) return base>0?parseFloat((v/base*100).toFixed(2)):0;
        return v;
      }),
      borderColor:lineCol(sel,i),borderDash:lineDash(i),
      backgroundColor:'transparent',
      tension:.35,
      pointBackgroundColor:YEARS.map(function(y){return YC[y]||'#888';}),
      pointBorderColor:YEARS.map(function(y){return YC[y]||'#888';}),
      pointRadius:6,borderWidth:2,fill:false
    };
  }).filter(Boolean);
  if(!ds.length) return;

  var titleEl=document.getElementById('cmpChartTitle');
  var subEl=document.getElementById('cmpChartSub');
  if(norm){
    if(titleEl) titleEl.textContent='Evolución normalizada (base 100 = 1980)';
    if(subEl) subEl.textContent='índice 100 = valor en 1980 · permite comparar sin importar escala absoluta';
  } else {
    if(titleEl) titleEl.textContent='Evolución comparada';
    if(subEl) subEl.textContent='valores absolutos · cortes 1980–2020 (población: censos 1980–2022)';
  }

  var yFmt = norm
    ? function(v){return fmt(v);}
    : function(v){return fmt(v);};

  charts['cmp']=new Chart(document.getElementById('chCmp').getContext('2d'),{
    type:'line',
    data:{labels:YEARS,datasets:ds},
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{color:'#888879',font:{family:'Space Mono',size:cfs(10)}}}},
      scales:{
        x:{ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(10)}},grid:{color:'rgba(0,0,0,.05)'}},
        y:{ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(10)},callback:yFmt},grid:{color:'rgba(0,0,0,.05)'}}
      }
    }
  });

  // Relative % vs 1980
  var dsRel=sels.map(function(sel,i){
    if(!sel) return null;
    var base=getData(sel,1980);
    return {
      label:cmpModo==='region'?rlab(sel):dn(sel),
      data:YEARS.map(function(y){
        var val=getData(sel,y);
        return base>0?parseFloat(((val-base)/base*100).toFixed(2)):0;
      }),
      borderColor:lineCol(sel,i),borderDash:lineDash(i),backgroundColor:lineCol(sel,i)+'1a',
      tension:.35,
      pointBackgroundColor:YEARS.map(function(y){return YC[y]||'#888';}),
      pointBorderColor:YEARS.map(function(y){return YC[y]||'#888';}),
      pointRadius:6,borderWidth:2,fill:true
    };
  }).filter(Boolean);

  charts['cmpRel']=new Chart(document.getElementById('chCmpRel').getContext('2d'),{
    type:'line',
    data:{labels:YEARS,datasets:dsRel},
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{
        legend:{labels:{color:'#888879',font:{family:'Space Mono',size:cfs(10)}}},
        tooltip:{callbacks:{label:function(item){return ' '+item.dataset.label+': '+fmtPct(item.raw);}}}
      },
      scales:{
        x:{ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(10)}},grid:{color:'rgba(0,0,0,.05)'}},
        y:{
          ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(10)},callback:function(v){return fmtTickPct(v,true);}},
          grid:{color:'rgba(0,0,0,.05)'},
          afterDataLimits:function(scale){scale.max=Math.max(scale.max,10);}
        }
      }
    }
  });
  ariaCharts();
}

// ── CONCLUSIONES ──
function buildConclusiones(){
  // Expansión vs. población base 100
  killChart('concExp');
  var t = DATA.totals;
  var pob80 = t[1980].pob, pix80 = t[1980].pix;
  charts['concExp'] = new Chart(document.getElementById('chConcExp').getContext('2d'),{
    type:'line',
    data:{
      labels: YEARS,
      datasets:[
        {label:'Superficie construida',
         data: YEARS.map(function(y){return Math.round(t[y].pix/pix80*100);}),
         borderColor:'#e33943',backgroundColor:'rgba(227,57,67,.08)',
         tension:.35,pointRadius:6,pointBackgroundColor:'#e33943',borderWidth:2.5,fill:true},
        {label:'Población',
         data: YEARS.map(function(y){return Math.round(t[y].pob/pob80*100);}),
         borderColor:'#1ec3e6',backgroundColor:'rgba(30,195,230,.08)',
         tension:.35,pointRadius:6,pointBackgroundColor:'#1ec3e6',borderWidth:2.5,fill:true},
        // Línea de referencia base 100 (el plugin annotation no está cargado: se dibuja como dataset)
        {label:'_ref',
         data: YEARS.map(function(){return 100;}),
         borderColor:'rgba(0,0,0,.25)',borderDash:[4,4],borderWidth:1,
         pointRadius:0,fill:false,tension:0}
      ]
    },
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{color:'#888879',font:{family:'Space Mono',size:cfs(10)},filter:function(i){return i.text!=='_ref';}}},
        tooltip:{filter:function(i){return i.dataset.label!=='_ref';},callbacks:{label:function(i){return ' '+i.dataset.label+': '+i.raw+' (base 100)';}}}
      },
      scales:{
        x:{ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(9)}},grid:{color:'rgba(0,0,0,.05)'}},
        y:{ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(9)},callback:function(v){return v;}},
           grid:{color:'rgba(0,0,0,.05)'},beginAtZero:false}
      }
    }
  });
  // Densidad media
  killChart('concDen');
  charts['concDen'] = new Chart(document.getElementById('chConcDen').getContext('2d'),{
    type:'bar',
    data:{
      labels: YEARS,
      datasets:[{
        label:'Densidad construida (m² BU/píxel)',
        data: YEARS.map(function(y){return t[y].den;}),
        backgroundColor: YEARS.map(function(y){return YC[y]+'cc';}),
        borderColor: YEARS.map(function(y){return YC[y];}),
        borderWidth:2,borderRadius:5
      }]
    },
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},
        tooltip:{callbacks:{label:function(i){return ' '+fmt(i.raw,1)+' m² BU/píxel';}}}
      },
      scales:{
        x:{ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(9)}},grid:{display:false}},
        y:{ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(9)},callback:function(v){return fmt(v,0);}},
           grid:{color:'rgba(0,0,0,.05)'},beginAtZero:false}
      }
    }
  });
  buildConcTasas();
  buildConcLCR();
  ariaCharts();
}

// ── Tasa de crecimiento anual compuesta por década (provincia total) ──
function buildConcTasas(){
  var cv=document.getElementById('chConcTasas'); if(!cv) return;
  killChart('concTasas');
  var t=DATA.totals;
  var decades=[[1980,1990],[1990,2000],[2000,2010],[2010,2020]];
  function cagr(v1,v2){return (Math.pow(v2/v1,1/10)-1)*100;}
  charts['concTasas']=new Chart(cv.getContext('2d'),{
    type:'bar',
    data:{
      labels:decades.map(function(d){return d[0]+'–'+d[1];}),
      datasets:[
        {label:'Población',
         data:decades.map(function(d){return parseFloat(cagr(t[d[0]].pob,t[d[1]].pob).toFixed(2));}),
         backgroundColor:'rgba(30,195,230,.75)',borderColor:'#1ec3e6',borderWidth:1.5,borderRadius:4},
        {label:'Superficie construida',
         data:decades.map(function(d){return parseFloat(cagr(t[d[0]].pix,t[d[1]].pix).toFixed(2));}),
         backgroundColor:'rgba(227,57,67,.75)',borderColor:'#e33943',borderWidth:1.5,borderRadius:4}
      ]
    },
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{color:'#888879',font:{family:'Space Mono',size:cfs(10)}}},
        tooltip:{callbacks:{label:function(i){return ' '+i.dataset.label+': '+fmtNum(i.raw,2)+'% anual';}}}},
      scales:{
        x:{ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(9)}},grid:{display:false}},
        y:{title:{display:true,text:'Tasa anual (%)',color:'#888879',font:{family:'Space Mono',size:cfs(9)}},
           ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(9)},callback:function(v){return fmtTickPct(v);}},
           grid:{color:'rgba(0,0,0,.05)'},beginAtZero:true}
      }
    }
  });
}

// ── LCRPGR por región (ODS 11.3.1, ONU-Hábitat) ──
// LCR = ln(sup_2020/sup_1980)/40 · PGR = ln(pob_2020/pob_1980)/40 · LCRPGR = LCR/PGR
function buildConcLCR(){
  var cv=document.getElementById('chConcLCR'); if(!cv) return;
  killChart('concLCR');
  var rows=[];
  Object.keys(DATA.regions).forEach(function(rn){
    var r80=DATA.regions[rn][1980],r20=DATA.regions[rn][2020];
    if(!r80||!r20||!r80.pob||!r80.pix||!r20.pob||!r20.pix) return;
    var lcr=Math.log(r20.pix/r80.pix)/40;
    var pgr=Math.log(r20.pob/r80.pob)/40;
    if(pgr<=0) return; // el indicador no está definido con población decreciente
    rows.push({rn:rn,v:lcr/pgr,lcr:lcr*100,pgr:pgr*100});
  });
  rows.sort(function(a,b){return b.v-a.v;});
  charts['concLCR']=new Chart(cv.getContext('2d'),{
    type:'bar',
    data:{
      labels:rows.map(function(r){return rlab(r.rn).replace('Región ','');}),
      datasets:[
        {type:'line',label:'Equilibrio (LCRPGR = 1)',
         data:rows.map(function(){return 1;}),
         borderColor:'rgba(0,0,0,.4)',borderDash:[5,4],borderWidth:1.5,pointRadius:0,fill:false},
        {label:'LCRPGR 1980–2020',
         data:rows.map(function(r){return parseFloat(r.v.toFixed(2));}),
         backgroundColor:rows.map(function(r){return (RCOLORS_MAP[r.rn]||'#888')+'cc';}),
         borderColor:rows.map(function(r){return RCOLORS_MAP[r.rn]||'#888';}),
         borderWidth:1.5,borderRadius:4}
      ]
    },
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{color:'#888879',font:{family:'Space Mono',size:cfs(9)},boxWidth:14}},
        tooltip:{callbacks:{label:function(i){
          if(i.dataset.type==='line') return ' Equilibrio: expansión proporcional al crecimiento poblacional';
          var r=rows[i.dataIndex];
          return [' LCRPGR: '+fmtNum(r.v,2),
                  ' Tasa consumo de suelo: '+fmtNum(r.lcr,2)+'% anual',
                  ' Tasa crec. poblacional: '+fmtNum(r.pgr,2)+'% anual'];}}}},
      scales:{
        x:{ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(8)},maxRotation:45,minRotation:30},grid:{display:false}},
        y:{ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(9)}},grid:{color:'rgba(0,0,0,.05)'},beginAtZero:true}
      }
    }
  });
}


// ══ ANÁLISIS EXPLORATORIO ══
var aYr = 2020;
var aLog = true; // escala logarítmica en scatters de superficie/población

function toggleALog(btn){
  aLog = !aLog;
  if(btn){
    btn.classList.toggle('on', aLog);
    btn.textContent = aLog ? 'Logarítmica' : 'Lineal';
  }
  buildAnalisis();
}

function setAYr(yr, btn){
  aYr = yr;
  document.querySelectorAll('#aPills .pill').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  buildAnalisis();
}

function buildAnalisis(){
  var RCOLORS = typeof RCOLORS_MAP !== 'undefined' ? RCOLORS_MAP : {};
  var regFilter = document.getElementById('aRegFilt') ? document.getElementById('aRegFilt').value : '';
  var locs = LOCS.filter(function(l){
    if(regFilter && DATA.localities[l].region_nombre !== regFilter) return false;
    var d = DATA.localities[l].data[aYr];
    return d && d.pob > 0 && d.pix > 0;
  });
  function getCol(rn){ return RCOLORS[rn]||'#888'; }
  function makeGroups(fn){
    var g={};
    locs.forEach(function(l){
      var pt=fn(l); if(!pt) return;
      var rn=DATA.localities[l].region_nombre;
      if(!g[rn]) g[rn]=[];
      g[rn].push(Object.assign({label:l},pt));
    });
    return g;
  }
  function scDs(groups){
    return Object.keys(groups).map(function(rn){
      return{label:rlab(rn),data:groups[rn],backgroundColor:getCol(rn)+'cc',
        borderColor:getCol(rn),borderWidth:1,pointRadius:4,pointHoverRadius:7};
    });
  }
  var sb={responsive:true,maintainAspectRatio:false,
    plugins:{legend:{position:'bottom',onHover:legendDimHover,onLeave:legendDimLeave,labels:{color:'#888879',font:{family:'Space Mono',size:cfs(10)},padding:6,boxWidth:8,usePointStyle:true}}}};

  // Actualizar subtítulos con el año de corte activo
  (function(){
    var el;
    el=document.getElementById('chScatter1');
    if(el){el=el.closest('.cc').querySelector('.cs');if(el) el.textContent='superficie construida · densidad construida · '+aYr;}
    el=document.getElementById('chScatter2');
    if(el){el=el.closest('.cc').querySelector('.cs');if(el) el.textContent=(aYr==1980?'comparación vs 1980 · seleccioná otro año para ver diferencias':'variación % respecto a 1980 · 1980 → '+aYr+' · diagonal = crecimiento proporcional');}
    el=document.getElementById('chDenEvol');
    if(el){el=el.closest('.cc').querySelector('.cs');if(el) el.textContent='1980 – '+aYr+' · curva descendente = expansión extensiva';}
    el=document.getElementById('chScatter3');
    if(el){el=el.closest('.cc').querySelector('.cs');if(el) el.textContent=(aYr==1980?'comparación vs 1980 · seleccioná otro año para ver diferencias':'crecimiento de núcleos vs. crecimiento de la superficie construida · 1980→'+aYr);}
  })();

  killChart('sc1');
  var g1=makeGroups(function(l){var d=DATA.localities[l].data[aYr];return(d&&d.pix&&d.den)?{x:d.pix,y:d.den}:null;});
  charts['sc1']=new Chart(document.getElementById('chScatter1').getContext('2d'),{
    type:'scatter',data:{datasets:scDs(g1)},
    options:Object.assign({},sb,{plugins:Object.assign({},sb.plugins,{tooltip:{callbacks:{
      title:function(i){return dn(i[0].raw.label);},
      label:function(i){return[' Superficie: '+fmt(i.raw.x)+' ha',' Densidad construida: '+fmt(i.raw.y,1)+' m² BU/píxel'];}
    }}}),
    scales:{
      x:{type:aLog?'logarithmic':'linear',title:{display:true,text:'Superficie construida (ha)'+(aLog?' · escala log':''),color:'#888879',font:{family:'Space Mono',size:cfs(10)}},ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(10)},maxTicksLimit:7,callback:function(v){return fmt(v);}},grid:{color:'rgba(0,0,0,.05)'}},
      y:{title:{display:true,text:'Densidad construida (m² BU/píxel)',color:'#888879',font:{family:'Space Mono',size:cfs(10)}},ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(10)},callback:function(v){return fmt(v,1);}},grid:{color:'rgba(0,0,0,.05)'}}
    }})
  });

  var maxV2=0;
  killChart('sc2');
  var g2=makeGroups(function(l){
    var d80=DATA.localities[l].data[1980],dYr=DATA.localities[l].data[aYr];
    if(!d80||!dYr||!d80.pob||!d80.pix||!dYr.pob||!dYr.pix) return null;
    var gp=((dYr.pob-d80.pob)/d80.pob*100),gpx=((dYr.pix-d80.pix)/d80.pix*100);
    if(Math.abs(gp)>1000||Math.abs(gpx)>1000) return null;
    maxV2=Math.max(maxV2,Math.abs(gp),Math.abs(gpx));
    return{x:gp,y:gpx};
  });
  var ds2=scDs(g2);
  ds2.push({label:'_ref',data:[{x:-50,y:-50},{x:maxV2*1.05,y:maxV2*1.05}],type:'line',borderColor:'#1a1a1a',borderWidth:1.5,borderDash:[6,4],pointRadius:0,fill:false,order:-1});
  charts['sc2']=new Chart(document.getElementById('chScatter2').getContext('2d'),{
    type:'scatter',data:{datasets:ds2},
    options:Object.assign({},sb,{plugins:Object.assign({},sb.plugins,{
      legend:Object.assign({},sb.plugins.legend,{labels:Object.assign({},sb.plugins.legend.labels,{filter:function(i){return i.text!=='_ref';}})}),
      tooltip:{callbacks:{title:function(i){return dn(i[0].raw.label)||'';},label:function(i){if(!i.raw.label) return'';return[' Crec. pob.: '+fmtPct(i.raw.x),' Crec. sup.: '+fmtPct(i.raw.y)];}}}
    }),
    scales:{
      x:{min:-100,title:{display:true,text:'Crecimiento poblacional (%)',color:'#888879',font:{family:'Space Mono',size:cfs(10)}},ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(10)},callback:function(v){return fmtTickPct(v);}},grid:{color:'rgba(0,0,0,.05)'}},
      y:{title:{display:true,text:'Crecimiento superficial (%)',color:'#888879',font:{family:'Space Mono',size:cfs(10)}},ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(10)},callback:function(v){return fmtTickPct(v);}},grid:{color:'rgba(0,0,0,.05)'}}
    }})
  });

  killChart('denEvol');
  var denYears=YEARS.filter(function(y){return y<=aYr;});
  charts['denEvol']=new Chart(document.getElementById('chDenEvol').getContext('2d'),{
    type:'line',data:{labels:denYears,datasets:Object.keys(DATA.regions).map(function(rn){
      return{label:rlab(rn),data:denYears.map(function(y){return DATA.regions[rn]&&DATA.regions[rn][y]?DATA.regions[rn][y].den:null;}),
        borderColor:getCol(rn),backgroundColor:'transparent',tension:.35,pointRadius:4,pointBackgroundColor:getCol(rn),borderWidth:2,fill:false};
    })},
    options:Object.assign({},sb,{plugins:Object.assign({},sb.plugins,{tooltip:{callbacks:{label:function(i){return' '+i.dataset.label+': '+fmt(i.raw,1)+' m² BU/píxel';}}}}),
    scales:{
      x:{ticks:{color:'#888879',font:{family:'Space Mono',size:11}},grid:{color:'rgba(0,0,0,.05)'}},
      y:{title:{display:true,text:'Densidad construida (m² BU/píxel)',color:'#888879',font:{family:'Space Mono',size:cfs(10)}},ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(10)},callback:function(v){return fmt(v,1);}},grid:{color:'rgba(0,0,0,.05)'}}
    }})
  });

  var maxV3=0;
  killChart('sc3');
  var g3=makeGroups(function(l){
    var d80=DATA.localities[l].data[1980],dYr=DATA.localities[l].data[aYr];
    if(!d80||!dYr||!d80.nuc||!d80.pix||!dYr.nuc||!dYr.pix) return null;
    var gn=((dYr.nuc-d80.nuc)/d80.nuc*100),gpx=((dYr.pix-d80.pix)/d80.pix*100);
    if(Math.abs(gn)>2000||Math.abs(gpx)>2000) return null;
    maxV3=Math.max(maxV3,Math.abs(gn),Math.abs(gpx));
    return{x:gpx,y:gn};
  });
  var ds3=scDs(g3);
  ds3.push({label:'_ref',data:[{x:-50,y:-50},{x:maxV3*1.05,y:maxV3*1.05}],type:'line',borderColor:'#1a1a1a',borderWidth:1.5,borderDash:[6,4],pointRadius:0,fill:false,order:-1});
  charts['sc3']=new Chart(document.getElementById('chScatter3').getContext('2d'),{
    type:'scatter',data:{datasets:ds3},
    options:Object.assign({},sb,{plugins:Object.assign({},sb.plugins,{
      legend:Object.assign({},sb.plugins.legend,{labels:Object.assign({},sb.plugins.legend.labels,{filter:function(i){return i.text!=='_ref';}})}),
      tooltip:{callbacks:{title:function(i){return dn(i[0].raw.label)||'';},label:function(i){if(!i.raw.label) return'';return[' Crec. sup.: '+fmtPct(i.raw.x),' Crec. núcleos: '+fmtPct(i.raw.y)];}}}
    }),
    scales:{
      x:{title:{display:true,text:'Crecimiento superficial (%)',color:'#888879',font:{family:'Space Mono',size:cfs(10)}},ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(10)},callback:function(v){return fmtTickPct(v);}},grid:{color:'rgba(0,0,0,.05)'}},
      y:{title:{display:true,text:'Crecimiento de núcleos (%)',color:'#888879',font:{family:'Space Mono',size:cfs(10)}},ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(10)},callback:function(v){return fmtTickPct(v);}},grid:{color:'rgba(0,0,0,.05)'}}
    }})
  });
  // Actualizar scatter animado con el año actual de análisis (sincronizando slider y etiqueta)
  if(document.getElementById('chAnimScatter')){
    var yrIdx=YEARS_ARR.indexOf(aYr);
    if(yrIdx>=0){
      var sl=document.getElementById('animSlider'),yl=document.getElementById('animYrLabel');
      if(sl){ sl.value=yrIdx; sl.style.setProperty('--acc',YC[aYr]); sl.setAttribute('aria-valuetext',aYr); rngFill(sl); }
      if(yl) yl.textContent=aYr;
      animYrIdx=yrIdx;
    }
    buildAnimScatter(aYr);
  }
  buildPatrones();
  buildTop10();
  ariaCharts();
}

// ── Distribución de patrones de crecimiento (1980→2020) ──
var PATRON_ORDER=['Compacta','Sprawl moderado','Sprawl acelerado','Dispersión intensa','En declive'];
var PATRON_COLORS={'Compacta':'#1a7a1a','Sprawl moderado':'#a07010','Sprawl acelerado':'#c03010','Dispersión intensa':'#7a0010','En declive':'#7a1a1a'};

function buildPatrones(){
  var cv=document.getElementById('chPatrones'); if(!cv) return;
  killChart('patrones');
  var regFilter=document.getElementById('aRegFilt')?document.getElementById('aRegFilt').value:'';
  var counts={},total=0,sinClasif=0;
  LOCS.forEach(function(l){
    if(regFilter&&DATA.localities[l].region_nombre!==regFilter) return;
    var p=clasificarPatron(l); if(!p){ sinClasif++; return; }
    counts[p.label]=(counts[p.label]||0)+1; total++;
  });
  var cs=document.getElementById('csPatrones');
  if(cs) cs.textContent='clasificación 1980→2020 · '+total+' localidades'+(regFilter?' · '+rlab(regFilter):'');
  // clasificarPatron() necesita población y superficie > 0 en 1980 y 2020 para calcular la variación
  var nota=document.getElementById('notaPatrones');
  if(nota) nota.textContent=sinClasif?(sinClasif+(sinClasif===1?' localidad queda':' localidades quedan')+' sin clasificar: no tienen población censada o superficie construida detectada en 1980 (o en 2020), y sin valor de base no se puede calcular la variación.'):'';
  var labels=PATRON_ORDER.filter(function(o){return counts[o];});
  charts['patrones']=new Chart(cv.getContext('2d'),{
    type:'bar',
    data:{labels:labels,datasets:[{
      data:labels.map(function(o){return counts[o];}),
      backgroundColor:labels.map(function(o){return PATRON_COLORS[o]+'cc';}),
      borderColor:labels.map(function(o){return PATRON_COLORS[o];}),
      borderWidth:1.5,borderRadius:5}]},
    options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},
        tooltip:{callbacks:{label:function(i){return ' '+fmt(i.raw)+' localidades ('+fmtNum(i.raw/total*100,1)+'%)';}}}},
      scales:{
        x:{ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(10)},callback:function(v){return Number.isInteger(v)?fmt(v):'';}},grid:{color:'rgba(0,0,0,.05)'},beginAtZero:true},
        y:{ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(10)}},grid:{display:false}}
      }
    }
  });
}

// ── Top 10 localidades por expansión superficial ──
function buildTop10(){
  var cv=document.getElementById('chTop10'); if(!cv) return;
  killChart('top10');
  var regFilter=document.getElementById('aRegFilt')?document.getElementById('aRegFilt').value:'';
  var yrEnd=(aYr==1980)?2020:aYr;
  var rows=[];
  LOCS.forEach(function(l){
    var ld=DATA.localities[l];
    if(regFilter&&ld.region_nombre!==regFilter) return;
    var d80=ld.data[1980],dY=ld.data[yrEnd];
    // base mínima de 30 píxeles en 1980 para evitar artefactos de base pequeña
    if(!d80||!dY||!d80.pix||d80.pix<30||!dY.pix) return;
    rows.push({l:l,g:(dY.pix-d80.pix)/d80.pix*100,rn:ld.region_nombre,p0:d80.pix,p1:dY.pix});
  });
  rows.sort(function(a,b){return b.g-a.g;});
  var top=rows.slice(0,10);
  var cs=document.getElementById('csTop10');
  if(cs) cs.textContent='% de crecimiento de la superficie construida · 1980 → '+yrEnd+' · base mínima 30 ha'+(regFilter?' · '+rlab(regFilter):'');
  charts['top10']=new Chart(cv.getContext('2d'),{
    type:'bar',
    data:{labels:top.map(function(r){return dn(r.l);}),datasets:[{
      data:top.map(function(r){return parseFloat(r.g.toFixed(1));}),
      backgroundColor:top.map(function(r){return (RCOLORS_MAP[r.rn]||'#888')+'cc';}),
      borderColor:top.map(function(r){return RCOLORS_MAP[r.rn]||'#888';}),
      borderWidth:1.5,borderRadius:4}]},
    options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},
        tooltip:{callbacks:{
          title:function(i){var r=top[i[0].dataIndex];return dn(r.l)+' · '+rlab(r.rn);},
          label:function(i){var r=top[i.dataIndex];return[' '+fmtPct(r.g),' '+fmt(r.p0)+' → '+fmt(r.p1)+' ha'];}}}},
      scales:{
        x:{ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(10)},callback:function(v){return '+'+fmt(v)+'%';}},grid:{color:'rgba(0,0,0,.05)'},beginAtZero:true},
        y:{ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(9)}},grid:{display:false}}
      }
    }
  });
}

function initAnalisis(){
  var rf=document.getElementById('aRegFilt');
  if(rf&&rf.children.length<=1){
    REGIONS.forEach(function(r){var o=document.createElement('option');o.value=r;o.textContent=rlab(r);rf.appendChild(o);});
  }
  initAnalisisExtras();
  buildAnalisis();
}

// ── ANÁLISIS DERIVADO ──

// Mejora #8 & #9: Scatter animado y trayectoria individual
var animYrIdx = 4;
var animTimer = null;
var YEARS_ARR = [1980,1990,2000,2010,2020];

function updateAnimScatter(idx){
  animYrIdx = parseInt(idx);
  var yr = YEARS_ARR[animYrIdx];
  document.getElementById('animYrLabel').textContent = yr;
  var sl = document.getElementById('animSlider');
  sl.value = idx; sl.style.setProperty('--acc', YC[yr]); sl.setAttribute('aria-valuetext', yr); rngFill(sl);
  buildAnimScatter(yr);
}

function playAnimation(){
  if(animTimer){ clearInterval(animTimer); animTimer=null; return; }
  animYrIdx = 0;
  animTimer = setInterval(function(){
    updateAnimScatter(animYrIdx);
    animYrIdx++;
    if(animYrIdx > 4){ clearInterval(animTimer); animTimer=null; }
  }, 900);
}

function buildAnimScatter(yr){
  killChart('animSc');
  var regFilter = document.getElementById('aRegFilt')?document.getElementById('aRegFilt').value:'';
  // Ejes fijos calculados sobre TODOS los años: la animación queda comparable
  // (sin esto, los ejes se reescalan en cada año y el crecimiento no se percibe)
  var mnx=Infinity,mxx=0,mny=Infinity,mxy=0;
  LOCS.forEach(function(l){
    var ld=DATA.localities[l];
    if(regFilter&&ld.region_nombre!==regFilter) return;
    YEARS_ARR.forEach(function(y){
      var d=ld.data[y]; if(!d||!d.pob||!d.pix) return;
      if(d.pix<mnx)mnx=d.pix; if(d.pix>mxx)mxx=d.pix;
      if(d.pob<mny)mny=d.pob; if(d.pob>mxy)mxy=d.pob;
    });
  });
  var bx,by;
  if(!isFinite(mnx)){ bx=[undefined,undefined]; by=[undefined,undefined]; }
  else if(aLog){
    bx=[Math.max(1,Math.floor(mnx*0.8)),Math.ceil(mxx*1.25)];
    by=[Math.max(1,Math.floor(mny*0.8)),Math.ceil(mxy*1.25)];
  } else {
    bx=[0,Math.ceil(mxx*1.05)];
    by=[0,Math.ceil(mxy*1.05)];
  }
  var groups={};
  LOCS.forEach(function(l){
    var ld=DATA.localities[l];
    if(regFilter && ld.region_nombre!==regFilter) return;
    var d=ld.data[yr];
    if(!d||!d.pob||!d.pix) return;
    var rn=ld.region_nombre;
    if(!groups[rn]) groups[rn]=[];
    groups[rn].push({x:d.pix, y:d.pob, label:l});
  });
  var datasets=Object.keys(groups).map(function(rn){
    return{label:rlab(rn),data:groups[rn],backgroundColor:(RCOLORS_MAP[rn]||'#888')+'bb',
      borderColor:RCOLORS_MAP[rn]||'#888',borderWidth:1,pointRadius:4,pointHoverRadius:7};
  });
  charts['animSc']=new Chart(document.getElementById('chAnimScatter').getContext('2d'),{
    type:'scatter',data:{datasets:datasets},
    options:{responsive:true,maintainAspectRatio:false,
      animation:{duration:400},
      plugins:{
        legend:{position:'bottom',onHover:legendDimHover,onLeave:legendDimLeave,labels:{color:'#888879',font:{family:'Space Mono',size:cfs(9)},padding:5,boxWidth:8,usePointStyle:true}},
        tooltip:{callbacks:{
          title:function(i){return dn(i[0].raw.label);},
          label:function(i){return[' Superficie: '+fmt(i.raw.x)+' ha',' Población: '+fmt(i.raw.y)];}
        }}
      },
      scales:{
        x:{type:aLog?'logarithmic':'linear',min:bx[0],max:bx[1],title:{display:true,text:'Superficie construida (ha)'+(aLog?' · escala log':''),color:'#888879',font:{family:'Space Mono',size:cfs(10)}},
          ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(9)},maxTicksLimit:7,callback:function(v){return fmt(v);}},grid:{color:'rgba(0,0,0,.05)'}},
        y:{type:aLog?'logarithmic':'linear',min:by[0],max:by[1],title:{display:true,text:'Población'+(aLog?' (escala log)':''),color:'#888879',font:{family:'Space Mono',size:cfs(10)}},
          ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(9)},maxTicksLimit:7,callback:function(v){return fmt(v);}},grid:{color:'rgba(0,0,0,.05)'}}
      }
    }
  });
  ariaCharts();
}

function buildTrayectoria(){
  var loc=document.getElementById('trajLoc').value;
  killChart('tray');
  if(!loc||!DATA.localities[loc]) return;
  var ld=DATA.localities[loc];
  var pts=YEARS_ARR.map(function(y){
    var d=ld.data[y]||{};
    return{x:d.pix||0, y:d.pob||0, yr:y};
  });
  var ds=[{
    label:dn(loc)+' (trayectoria)',
    data:pts,
    backgroundColor:YEARS_ARR.map(function(y){return YC[y]||'#888';}),
    borderColor:'rgba(0,0,0,0.3)',
    borderWidth:1,
    pointRadius:YEARS_ARR.map(function(){return 8;}),
    pointHoverRadius:11,
    showLine:true,
    tension:0.3,
    fill:false
  }];
  // Agregar etiquetas de año como anotaciones via puntos extra
  charts['tray']=new Chart(document.getElementById('chTrayectoria').getContext('2d'),{
    type:'scatter',data:{datasets:ds},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{
        legend:{display:false},
        tooltip:{callbacks:{
          title:function(i){return 'Año '+i[0].raw.yr;},
          label:function(i){return[' Superficie: '+fmt(i.raw.x)+' ha',' Población: '+fmt(i.raw.y)];}
        }}
      },
      scales:{
        x:{title:{display:true,text:'Superficie construida (ha)',color:'#888879',font:{family:'Space Mono',size:cfs(10)}},
          ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(9)},callback:function(v){return fmt(v);}},grid:{color:'rgba(0,0,0,.05)'}},
        y:{title:{display:true,text:'Población',color:'#888879',font:{family:'Space Mono',size:cfs(10)}},
          ticks:{color:'#888879',font:{family:'Space Mono',size:cfs(9)},callback:function(v){return fmt(v);}},grid:{color:'rgba(0,0,0,.05)'}}
      }
    }
  });
  ariaCharts();
}

function initAnalisisExtras(){
  // Poblar selector de trayectoria
  var sel=document.getElementById('trajLoc');
  if(sel&&sel.children.length<=1){
    LOCS.forEach(function(l){var o=document.createElement('option');o.value=l;o.textContent=dn(l);sel.appendChild(o);});
    if(!sel.value && DATA.localities['VILLA CARLOS PAZ']) sel.value='VILLA CARLOS PAZ';
  }
  buildTrayectoria();
  updateAnimScatter(4);
}

// Mejora #6: Clasificación automática de patrón de crecimiento
function clasificarPatron(loc){
  var ld = DATA.localities[loc];
  if(!ld) return null;
  var d80=ld.data[1980], d20=ld.data[2020];
  if(!d80||!d20||!d80.pob||!d80.pix||!d20.pob||!d20.pix) return null;
  var gpob=(d20.pob-d80.pob)/d80.pob*100;
  var gpix=(d20.pix-d80.pix)/d80.pix*100;
  if(gpob<-5) return {label:'En declive',color:'#7a1a1a'};
  var ratio=gpix/Math.max(Math.abs(gpob),1);
  if(gpob>=gpix*0.8) return {label:'Compacta',color:'#1a7a1a'};
  if(ratio<2) return {label:'Sprawl moderado',color:'#a07010'};
  if(ratio<4) return {label:'Sprawl acelerado',color:'#c03010'};
  return {label:'Dispersión intensa',color:'#7a0010'};
}

// Mejora #7: Índice de fragmentación (núcleos por 100 píxeles)
function indiceFrag(loc, yr){
  var ld=DATA.localities[loc];
  if(!ld||!ld.data[yr]) return null;
  var d=ld.data[yr];
  if(!d.pix||d.pix===0) return null;
  return (d.nuc/d.pix*100).toFixed(3);
}

// Mejora #11: Exportación a CSV
function csvEscape(v){
  return '"' + String(v).split('"').join('""') + '"';
}
function exportCSV(){
  var arr = getFiltered();
  var modoEvoEl = document.getElementById('tblModoEvo');
  var evo = modoEvoEl && modoEvoEl.classList.contains('on');
  var lines = [];
  var i, j, r, d, d80, p, gp, gpx, frag, row, cells;
  if(evo){
    var hdr = ['Localidad','Depto','Region','Patron'];
    for(i=0;i<YEARS.length;i++){
      hdr.push('Pob_'+YEARS[i], 'Sup_ha_'+YEARS[i], 'Den_'+YEARS[i], 'Nuc_'+YEARS[i]);
    }
    lines.push(hdr.map(csvEscape).join(','));
    for(i=0;i<arr.length;i++){
      r = arr[i];
      p = clasificarPatron(r.name);
      row = [dn(r.name), depn(r.dep), rlab(r.region_nombre), p ? p.label : ''];
      for(j=0;j<YEARS.length;j++){
        d = DATA.localities[r.name].data[YEARS[j]] || {};
        row.push(d.pob||0, d.pix||0, (d.den||0).toFixed(1), d.nuc||0);
      }
      lines.push(row.map(csvEscape).join(','));
    }
  } else {
    var yr = tblYr;
    var hdr2 = ['Localidad','Depto','Region','Poblacion','Superficie_ha','Densidad_m2BU_pixel','Nucleos',
                'Crec_Pob_pct','Crec_Pix_pct','Indice_Frag','Patron'];
    lines.push(hdr2.map(csvEscape).join(','));
    for(i=0;i<arr.length;i++){
      r = arr[i];
      d = DATA.localities[r.name].data[yr] || {};
      d80 = DATA.localities[r.name].data[1980] || {};
      gp  = d80.pob > 0 ? ((d.pob - d80.pob) / d80.pob * 100).toFixed(1) : '';
      gpx = d80.pix > 0 ? ((d.pix - d80.pix) / d80.pix * 100).toFixed(1) : '';
      frag = indiceFrag(r.name, yr) || '';
      p = clasificarPatron(r.name);
      row = [dn(r.name), depn(r.dep), rlab(r.region_nombre),
             d.pob||0, d.pix||0, (d.den||0).toFixed(1), d.nuc||0,
             gp, gpx, frag, p ? p.label : ''];
      lines.push(row.map(csvEscape).join(','));
    }
  }
  var blob = new Blob(['\ufeff' + lines.join('\n')], {type: 'text/csv;charset=utf-8;'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'cordoba_urbano_' + tblYr + '.csv';
  a.click();
}

// ── Descripción accesible de cada gráfico (role="img" + aria-label con la conclusión) ──
// Se recalcula después de cada redibujo con el estado actual (año, región, indicador, localidad).
function _ariaSet(id,txt){
  var c=document.getElementById(id); if(!c) return;
  c.setAttribute('role','img'); c.setAttribute('aria-label',txt);
}
function _g(a,b){ return a>0&&b!=null?(b-a)/a*100:null; }
function ariaCharts(){ try{ _ariaCharts(); }catch(e){ console.warn('ariaCharts:',e); } }
function _ariaCharts(){
  var T=DATA.totals, R=DATA.regions, INDS={pob:'Población',pix:'Superficie construida',den:'Densidad construida',nuc:'Núcleos'};
  var UN={pob:'habitantes',pix:'ha',den:'m² BU/píxel',nuc:'núcleos'};
  // Gráficos de la localidad seleccionada (mapa)
  var ld=selectedMun&&DATA.localities[selectedMun];
  if(ld){
    ['pob','pix','den','nuc'].forEach(function(ind,i){
      var a=(ld.data[1980]||{})[ind], b=(ld.data[2020]||{})[ind];
      var d=ind==='den'?1:0;
      _ariaSet('chL'+(i+1), INDS[ind]+' de '+dn(selectedMun)+': '+fmt(a,d)+' '+UN[ind]+' en 1980 y '+fmt(b,d)+' '+UN[ind]+' en '+(ind==='pob'?'2022 (censo)':'2020')+'; variación '+fmtPct(_g(a,b))+'.');
    });
  }
  // Análisis regional
  var rind=(document.getElementById('regInd')||{}).value||'pob';
  var rg=RNAMES.map(function(rn){ return {rn:rn,g:_g((R[rn][1980]||{})[rind],(R[rn][2020]||{})[rind]),v:(R[rn][regYr]||{})[rind]||0}; });
  var byG=rg.slice().sort(function(a,b){return b.g-a.g;}), byV=rg.slice().sort(function(a,b){return b.v-a.v;});
  _ariaSet('chRegTime','Evolución de '+INDS[rind].toLowerCase()+' por región, 1980–2020'+(regEsc==='norm'?', en base 100':'')+'. Mayor crecimiento: '+rlab(byG[0].rn)+' ('+fmtPct(byG[0].g)+'); menor: '+rlab(byG[byG.length-1].rn)+' ('+fmtPct(byG[byG.length-1].g)+').');
  _ariaSet('chRegBar',INDS[rind]+' por región en '+regYr+': encabeza '+rlab(byV[0].rn)+' con '+fmt(byV[0].v,rind==='den'?1:0)+' '+UN[rind]+'; último '+rlab(byV[byV.length-1].rn)+' con '+fmt(byV[byV.length-1].v,rind==='den'?1:0)+'.');
  // Análisis exploratorio
  var rf=(document.getElementById('aRegFilt')||{}).value||'', reg=rf?' ('+rlab(rf)+')':'';
  var locs=LOCS.filter(function(l){ return !rf||DATA.localities[l].region_nombre===rf; });
  var n1=0,over=0,n2=0,nucMas=0,n3=0;
  locs.forEach(function(l){
    var d80=DATA.localities[l].data[1980]||{}, d=DATA.localities[l].data[aYr]||{};
    if(d.pob>0&&d.pix>0) n1++;
    if(d80.pob&&d80.pix&&d.pob&&d.pix){ n2++; if(_g(d80.pix,d.pix)>_g(d80.pob,d.pob)) over++; }
    if(d80.nuc&&d80.pix&&d.nuc&&d.pix){ n3++; if(_g(d80.nuc,d.nuc)>_g(d80.pix,d.pix)) nucMas++; }
  });
  _ariaSet('chScatter1','Superficie construida vs. densidad construida de '+n1+' localidades en '+aYr+reg+'; cada punto es una localidad, con el color de su región.');
  _ariaSet('chScatter2',aYr==1980?'Crecimiento poblacional vs. expansión superficial: elegí un año de corte posterior a 1980.':over+' de '+n2+' localidades'+reg+' quedan por encima de la diagonal: su superficie construida creció más que su población entre 1980 y '+aYr+'.');
  var baja=RNAMES.filter(function(rn){ return (R[rn][aYr]||{}).den<(R[rn][1980]||{}).den; }).length;
  _ariaSet('chDenEvol','La densidad construida bajó en '+baja+' de '+RNAMES.length+' regiones entre 1980 y '+aYr+'.');
  _ariaSet('chScatter3',aYr==1980?'Fragmentación: elegí un año de corte posterior a 1980.':'En '+nucMas+' de '+n3+' localidades'+reg+' los núcleos crecieron más que la superficie construida entre 1980 y '+aYr+'.');
  var pc={},pt=0; locs.forEach(function(l){ var p=clasificarPatron(l); if(p){ pc[p.label]=(pc[p.label]||0)+1; pt++; } });
  var pm=Object.keys(pc).sort(function(a,b){return pc[b]-pc[a];})[0];
  if(pm) _ariaSet('chPatrones','Patrón de crecimiento más frecuente'+reg+': '+pm+' ('+pc[pm]+' de '+pt+' localidades clasificadas).');
  var yrEnd=(aYr==1980)?2020:aYr, best=null;
  locs.forEach(function(l){ var a=(DATA.localities[l].data[1980]||{}).pix, b=(DATA.localities[l].data[yrEnd]||{}).pix; if(a>=30&&b){ var g=_g(a,b); if(!best||g>best.g) best={l:l,g:g}; } });
  if(best) _ariaSet('chTop10','Diez localidades con mayor expansión de la superficie construida 1980–'+yrEnd+reg+'; encabeza '+dn(best.l)+' ('+fmtPct(best.g)+').');
  var ay=YEARS_ARR[animYrIdx]||2020;
  _ariaSet('chAnimScatter','Población vs. superficie construida de cada localidad en '+ay+reg+', escala '+(aLog?'logarítmica':'lineal')+'.');
  var tl=(document.getElementById('trajLoc')||{}).value, tld=tl&&DATA.localities[tl];
  if(tld) _ariaSet('chTrayectoria','Trayectoria de '+dn(tl)+': superficie construida de '+fmt((tld.data[1980]||{}).pix)+' a '+fmt((tld.data[2020]||{}).pix)+' ha y población de '+fmt((tld.data[1980]||{}).pob)+' a '+fmt((tld.data[2020]||{}).pob)+' habitantes entre 1980 y 2022.');
  // Comparador
  var ci=(document.getElementById('cmpInd')||{}).value||'pob', sels=(cmpModo==='region'?cmpRegSels:cmpSels).filter(Boolean);
  var cg=sels.map(function(s){ var src=cmpModo==='region'?R[s]:(DATA.localities[s]||{}).data; if(!src) return ''; return (cmpModo==='region'?rlab(s):dn(s))+' '+fmtPct(_g((src[1980]||{})[ci],(src[2020]||{})[ci])); }).filter(Boolean).join(', ');
  if(cg){
    _ariaSet('chCmp',INDS[ci]+' comparada'+(cmpEsc==='norm'?' en base 100 (1980)':' en valores absolutos')+'. Variación 1980–2020: '+cg+'.');
    _ariaSet('chCmpRel','Crecimiento relativo de '+INDS[ci].toLowerCase()+' respecto de 1980: '+cg+'.');
  }
  // Conclusiones
  _ariaSet('chConcExp','Índice base 100 en 1980: en 2020 la superficie construida llega a '+Math.round(T[2020].pix/T[1980].pix*100)+' y la población a '+Math.round(T[2020].pob/T[1980].pob*100)+'.');
  _ariaSet('chConcDen','Densidad construida provincial: '+fmt(T[1980].den,1)+' m² BU/píxel en 1980 y '+fmt(T[2020].den,1)+' en 2020.');
  var dec=[[1980,1990],[1990,2000],[2000,2010],[2010,2020]], cg2=function(a,b){return (Math.pow(b/a,1/10)-1)*100;};
  var supMas=dec.filter(function(d){ return cg2(T[d[0]].pix,T[d[1]].pix)>cg2(T[d[0]].pob,T[d[1]].pob); }).length;
  var dmax=dec.slice().sort(function(a,b){ return cg2(T[b[0]].pix,T[b[1]].pix)-cg2(T[a[0]].pix,T[a[1]].pix); })[0];
  _ariaSet('chConcTasas','La tasa anual de la superficie construida supera a la de la población en '+supMas+' de 4 décadas; la mayor es '+dmax[0]+'–'+dmax[1]+' ('+fmtNum(cg2(T[dmax[0]].pix,T[dmax[1]].pix),2)+'% anual).');
  var lc=RNAMES.map(function(rn){ var a=R[rn][1980],b=R[rn][2020]; var pg=Math.log(b.pob/a.pob); return pg>0?{rn:rn,v:Math.log(b.pix/a.pix)/pg}:null; }).filter(Boolean);
  var lmax=lc.slice().sort(function(a,b){return b.v-a.v;})[0];
  _ariaSet('chConcLCR','LCRPGR 1980–2020 mayor que 1 en '+lc.filter(function(r){return r.v>1;}).length+' de '+lc.length+' regiones: el suelo se consume más rápido que lo que crece la población. Máximo: '+rlab(lmax.rn)+' ('+fmtNum(lmax.v,2)+').');
}

// Sliders .rng: el tramo recorrido se pinta con --pct
function rngFill(el){
  var mn=+el.min||0, mx=+el.max||100;
  el.style.setProperty('--pct', ((+el.value-mn)/(mx-mn)*100)+'%');
}
document.addEventListener('input',function(e){ if(e.target.classList&&e.target.classList.contains('rng')) rngFill(e.target); });

// Tabla regional: sombra y aviso cuando hay columnas fuera de vista
function updateScrollHint(){
  var w=document.getElementById('regTableWrap'); if(!w) return;
  var f=w.parentElement, more=w.scrollWidth-w.clientWidth-w.scrollLeft>4;
  f.classList.toggle('overflowing',more);
}
window.addEventListener('resize',updateScrollHint);

// ── INIT ──
window.addEventListener('DOMContentLoaded',()=>{
  var rtw=document.getElementById('regTableWrap'); if(rtw) rtw.addEventListener('scroll',updateScrollHint,{passive:true});
  document.querySelectorAll('input.rng').forEach(rngFill);
  initSplash();
  initScrollyObserver();
});

// ══ MAP DOWNLOAD FROM DRIVE ══
var DRIVE_FOLDER = '1GSGLTnf-798G4vggjE7BbhgAr6PVCVEN';
var DRIVE_API_KEY = 'AIzaSyD2L8VGh1CbXJLj3ab6IpyyJpBiDIbl3nk';
var _driveFilesCache = null;

// Normaliza un string para comparación: minúsculas, sin tildes, sin caracteres especiales
function _normStr(s){
  return (s||'').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[^a-z0-9\s]/g,' ')
    .replace(/\s+/g,' ').trim();
}

// Lista todos los PDFs de la carpeta Drive y los cachea (una sola llamada API)
function _loadDriveFiles(cb){
  if(_driveFilesCache){ cb(_driveFilesCache); return; }
  if(!DRIVE_API_KEY){ cb([]); return; }
  var q = encodeURIComponent("'"+DRIVE_FOLDER+"' in parents and trashed=false and mimeType='image/png'");
  fetch('https://www.googleapis.com/drive/v3/files?q='+q+'&fields=files(id,name)&pageSize=1000&key='+DRIVE_API_KEY)
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(d.error){ console.warn('Drive API error:', d.error.code, d.error.message); _driveFilesCache=[]; }
      else { _driveFilesCache = d.files||[]; }
      console.log('Drive files cargados:', _driveFilesCache.length);
      cb(_driveFilesCache);
    })
    .catch(function(e){ console.error('Drive API fetch failed:', e); cb([]); });
}

function downloadMapPDF(localidad, region, btnEl){
  if(!DRIVE_API_KEY){
    window.open('https://drive.google.com/drive/folders/'+DRIVE_FOLDER,'_blank');
    return;
  }
  if(btnEl){ btnEl.textContent='⏳'; btnEl.disabled=true; }

  _loadDriveFiles(function(files){
    if(btnEl){ btnEl.textContent='↓ mapa'; btnEl.disabled=false; }
    if(!files.length){
      window.open('https://drive.google.com/drive/folders/'+DRIVE_FOLDER,'_blank');
      return;
    }

    var nLoc = _normStr(localidad);
    var match = null;

    // 1) Match exacto: nombre del archivo (sin extensión) == nombre de localidad normalizado
    for(var i=0; i<files.length; i++){
      if(_normStr(files[i].name.replace(/\.[^.]+$/,'')) === nLoc){ match=files[i]; break; }
    }

    // 2) Fallback: localidad aparece en cualquier parte del nombre normalizado
    if(!match){
      for(var i=0;i<files.length;i++){
        if(_normStr(files[i].name).indexOf(nLoc)!==-1){ match=files[i]; break; }
      }
    }

    if(match){
      var a=document.createElement('a');
      a.href='https://drive.google.com/uc?export=download&id='+match.id;
      a.target='_blank';
      a.download=match.name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } else {
      window.open('https://drive.google.com/drive/folders/'+DRIVE_FOLDER,'_blank');
    }
  });
}

// ══ SPLASH ══
function animCount(elId,target,suffix,decimals){
  var el=document.getElementById(elId); if(!el) return;
  var start=0,dur=1400,step=target/(dur/16);
  var t=setInterval(function(){
    start+=step; if(start>=target){start=target;clearInterval(t);}
    el.textContent=(decimals?start.toFixed(1):Math.round(start))+suffix;
  },16);
}
function initSplash(){}
function closeSplash(){
  var sp=document.getElementById('splash');
  sp.classList.add('fade-out');
  setTimeout(function(){ sp.style.display='none'; },700);
}

// ══ CV MODAL ══
function openCV(){ document.getElementById('cvModal').style.display='flex'; }
function closeCV(){ document.getElementById('cvModal').style.display='none'; }

// ══ SCROLLYTELLING ══
// Intro: las tarjetas son visibles por defecto. Solo se animan si hay IntersectionObserver y no se
// pidió movimiento reducido; a los 2,5 s se muestran igual (antes podían quedar en blanco).
var _scrollyObs=null;
function initScrollyObserver(){
  var box=document.querySelector('.sc-chapters'), items=document.querySelectorAll('.sc-item');
  if(!box||!items.length||_scrollyObs) return;
  if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  box.classList.add('reveal');
  _scrollyObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('vis'); _scrollyObs.unobserve(e.target); } });
  },{threshold:0.05});
  items.forEach(function(it){ _scrollyObs.observe(it); });
  setTimeout(function(){ items.forEach(function(it){ it.classList.add('vis'); }); },2500);
}
function goToMapa(){
  var btn=document.querySelector('nav button:nth-child(2)');
  if(btn) btn.click();
}

// ══ MAP TIMELINE ══
var tlPlaying=false, tlTimer=null, tlCurYr=2020;
var TL_YRS=[1980,1990,2000,2010,2020];
var TL_COLS={1980:'#28c924',1990:'#1ec3e6',2000:'#854bfa',2010:'#e33943',2020:'#faa523'};

function tlSelectYr(yr){
  tlCurYr=yr;
  TL_YRS.forEach(function(y){
    var b=document.getElementById('tl-'+y); if(!b) return;
    b.classList.toggle('on',y===yr);
    b.style.color=y===yr?'#fff':TL_COLS[y];
    b.style.borderColor=TL_COLS[y];
  });
  // Remove all active layers except chosen year
  TL_YRS.forEach(function(y){
    if(layerActive[y]&&y!==yr) toggleMapYr(y);
  });
  if(!layerActive[yr]) toggleMapYr(yr);
  // Update 3D if active
  if(is3D) render3DMap();
}
function tlPlay(){
  if(tlPlaying){
    clearInterval(tlTimer); tlPlaying=false;
    document.getElementById('tl-play').innerHTML='▶ Play'; return;
  }
  tlPlaying=true;
  document.getElementById('tl-play').innerHTML='■ Stop';
  var idx=0; tlSelectYr(TL_YRS[idx]);
  tlTimer=setInterval(function(){
    idx++;
    if(idx>=TL_YRS.length){
      clearInterval(tlTimer); tlPlaying=false;
      document.getElementById('tl-play').innerHTML='▶ Play'; return;
    }
    tlSelectYr(TL_YRS[idx]);
  },2400);
}

// ══ 3D MAP (deck.gl) ══
var is3D=false, deckInstance=null, loaded3D={};
var _3dViewState=null; // persiste la posición del usuario entre re-renders

// Carga deck.gl dinámicamente la primera vez que se necesita
var _deckReady=false, _deckPending=[];
function _ensureDeck(cb){
  if(_deckReady){ cb(); return; }
  _deckPending.push(cb);
  if(_deckPending.length>1) return; // ya hay una carga en progreso
  var s=document.createElement('script');
  s.src='https://unpkg.com/deck.gl@8.9.35/dist.min.js';
  s.integrity='sha384-3nvwSk2Fxpw61RPr5Tnc6mHNuWAxEppaSbRUJe1Y+Qeggt50+j9Qvcxw0kCBYWD5';
  s.crossOrigin='anonymous';
  s.onload=function(){ _deckReady=true; _deckPending.forEach(function(f){f();}); _deckPending=[]; };
  s.onerror=function(){
    _deckPending=[]; is3D=false;
    var btn=document.getElementById('btn3D');
    if(btn){btn.classList.remove('active');btn.textContent='⬡ Vista 3D';}
    alert('No se pudo cargar el módulo 3D.');
  };
  document.head.appendChild(s);
}

function toggle3D(){
  is3D=!is3D;
  var btn=document.getElementById('btn3D');
  var info=document.getElementById('deck3DInfo');
  btn.classList.toggle('active',is3D);
  btn.textContent=is3D?'◼ Vista 2D':'⬡ Vista 3D';
  if(is3D){
    btn.textContent='⏳ Cargando 3D...';
    btn.disabled=true;
    _ensureDeck(function(){
      btn.disabled=false;
      btn.textContent='◼ Vista 2D';
      render3DMap();
      if(info) info.style.display='block';
    });
  } else {
    var dc=document.getElementById('deckCanvas');
    if(dc) dc.style.display='none';
    document.getElementById('map').style.display='block';
    if(info) info.style.display='none';
    if(deckInstance){ deckInstance.finalize(); deckInstance=null; }
    _3dViewState=null;
    if(map) map.resize();
  }
}
function _build3DLayers(yr, ghslData){
  var DENS_COLORS=[[80,180,255],[60,220,160],[250,210,60],[255,130,40],[220,40,60]];
  var DENS_ELEV=[120,400,1000,2200,3800];
  var CAT3D={'muy baja':0,'muy bajo':0,'baja':1,'bajo':1,'media':2,'medio':2,'alta':3,'alto':3,'muy alta':4,'muy alto':4};
  function catIdx(f){
    var props=f.properties||{};
    var idx=CAT3D[(props.dens_cat||'').toLowerCase()];
    return idx!==undefined?idx:2;
  }
  var selFeatures=selectedMun
    ? MUNICIPIOS_GJ.features.filter(function(f){return f.properties.NOMBRE===selectedMun;})
    : [];
  return [
    // Base del 3D: ejidos municipales en tono crema (sin teselas raster externas)
    new deck.GeoJsonLayer({
      id:'muni-base-3d',
      data:MUNICIPIOS_GJ,
      stroked:false, filled:true,
      getFillColor:[221,217,206,120]
    }),
    new deck.GeoJsonLayer({
      id:'ghsl3d-'+yr,
      data:ghslData,
      extruded:true, wireframe:false,
      getElevation:function(f){ return DENS_ELEV[catIdx(f)]; },
      getFillColor:function(f){ var rgb=DENS_COLORS[catIdx(f)]; return [rgb[0],rgb[1],rgb[2],220]; },
      getLineColor:[80,80,80,15], lineWidthMinPixels:0
    }),
    // Highlight del municipio seleccionado
    selFeatures.length ? new deck.GeoJsonLayer({
      id:'muni-sel-3d',
      data:{type:'FeatureCollection',features:selFeatures},
      stroked:true, filled:true,
      getLineColor:[30,30,30,230], lineWidthUnits:'pixels', getLineWidth:2, lineWidthMinPixels:2,
      getFillColor:[30,30,30,40],
      parameters:{depthTest:false}
    }) : null,
    // Capa de municipios: transparente pero pickable para click/hover
    new deck.GeoJsonLayer({
      id:'municipios3d',
      data:MUNICIPIOS_GJ,
      stroked:true, filled:true,
      getLineColor:[60,60,60,140], getFillColor:[0,0,0,0],
      lineWidthUnits:'pixels', getLineWidth:1, lineWidthMinPixels:1,
      parameters:{depthTest:false},
      pickable:true,
      autoHighlight:true,
      highlightColor:[80,80,80,30],
      onClick:function(info){
        if(info.object) selectMun(info.object.properties.NOMBRE, info.object);
      }
    })
  ].filter(Boolean);
}

function _fly3DTo(feat){
  if(!deckInstance||!feat||!feat.geometry) return;
  var bb=featureBBox(feat);
  var cx=(bb[0][0]+bb[1][0])/2;
  var cy=(bb[0][1]+bb[1][1])/2;
  var span=Math.max(Math.abs(bb[1][1]-bb[0][1]),Math.abs(bb[1][0]-bb[0][0]));
  var zoom=Math.min(12,Math.max(8,-Math.log2(span)+9));
  var vs={longitude:cx,latitude:cy,zoom:zoom,pitch:52,bearing:0,transitionDuration:800};
  try{ vs.transitionInterpolator=new deck.FlyToInterpolator({speed:1.5}); }catch(e){}
  _3dViewState=vs;
  deckInstance.setProps({viewState:vs});
}

async function render3DMap(){
  var yr=tlCurYr||2020;
  var loadMsg=document.getElementById('mapLoadMsg');
  var loadTxt=document.getElementById('mapLoadText');
  if(loadMsg){ if(loadTxt) loadTxt.textContent='Cargando vista 3D '+yr+'...'; loadMsg.style.display='block'; }
  if(!loaded3D[yr]){
    try{
      var resp=await fetch(densLayerUrl(yr));
      if(!resp.ok) throw new Error('HTTP '+resp.status);
      loaded3D[yr]=await resp.json();
    }catch(e){
      if(loadTxt) loadTxt.textContent='Error: '+e.message;
      setTimeout(function(){if(loadMsg) loadMsg.style.display='none';},3000);
      is3D=false; document.getElementById('btn3D').classList.remove('active');
      document.getElementById('btn3D').textContent='⬡ Vista 3D';
      return;
    }
  }
  if(loadMsg) loadMsg.style.display='none';
  document.getElementById('map').style.display='none';
  var dc=document.getElementById('deckCanvas');
  dc.style.display='block';
  if(typeof deck==='undefined'){
    dc.style.display='none'; document.getElementById('map').style.display='block';
    is3D=false; alert('deck.gl no disponible'); return;
  }
  var defaultVS={longitude:-64.2,latitude:-31.4,zoom:6.5,pitch:52,bearing:-18};
  var initVS=_3dViewState||defaultVS;
  // Si hay un municipio seleccionado y no tenemos view state guardado, partir del municipio
  if(!_3dViewState && selectedMun){
    var sf=MUNICIPIOS_GJ.features.find(function(f){return f.properties.NOMBRE===selectedMun;});
    if(sf){ var bb=featureBBox(sf); initVS={longitude:(bb[0][0]+bb[1][0])/2,latitude:(bb[0][1]+bb[1][1])/2,zoom:10,pitch:52,bearing:0}; }
  }
  if(deckInstance){ deckInstance.finalize(); deckInstance=null; }
  deckInstance=new deck.Deck({
    canvas:dc,
    viewState:initVS,
    onViewStateChange:function(info){ _3dViewState=info.viewState; deckInstance.setProps({viewState:_3dViewState}); },
    controller:true,
    style:{background:'#f5f3ee'},
    layers:_build3DLayers(yr,loaded3D[yr]),
    getTooltip:function(o){
      if(!o.object||!o.object.properties) return null;
      var p=o.object.properties;
      if(p.NOMBRE) return {html:'<div style="font-family:Space Mono,monospace;font-size:10px;background:#1a1a1a;color:#f5f3ee;padding:6px 10px;border-radius:4px"><strong>'+dn(p.NOMBRE)+'</strong></div>'};
      if(!p.dens_cat) return null;
      return {html:'<div style="font-family:Space Mono,monospace;font-size:10px;background:#1a1a1a;color:#f5f3ee;padding:6px 10px;border-radius:4px">Densidad construida: <strong>'+p.dens_cat+'</strong></div>'};
    }
  });
}

// ── Menú móvil y resize del mapa ──
function toggleMobileNav(){
  var ham=document.getElementById('navHamburger');
  var items=document.getElementById('navItems');
  var open=items.classList.toggle('open');
  ham.classList.toggle('open',open);
  ham.setAttribute('aria-expanded',open);
  ham.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
}
function closeMobileNav(){
  var ham=document.getElementById('navHamburger');
  var items=document.getElementById('navItems');
  if(!items)return;
  items.classList.remove('open');
  ham.classList.remove('open');
  ham.setAttribute('aria-expanded','false');
  ham.setAttribute('aria-label','Abrir menú de navegación');
}
// Cierra el menú al navegar en mobile
document.addEventListener('DOMContentLoaded',function(){
  var navItems=document.getElementById('navItems');
  if(navItems){
    navItems.addEventListener('click',function(e){
      if(e.target.tagName==='BUTTON') closeMobileNav();
    });
  }
});
// Recalcula tamaño del mapa al redimensionar ventana
// El mapa usa MapLibre GL: map.resize() equivale a invalidateSize() de Leaflet
(function(){
  var _mapResizeTimer;
  window.addEventListener('resize',function(){
    clearTimeout(_mapResizeTimer);
    _mapResizeTimer=setTimeout(function(){
      if(typeof map!=='undefined'&&map&&typeof map.resize==='function'){
        map.resize();
      }
    },150);
  });
})();
