
let ejecutadoSilbido = false;
let ejecutadoShh = false;
let ejecutadoAplauso = false;
let classifier;
let label = "listening...";
// Teachable Machine model URL:
//let soundModel = "https://teachablemachine.withgoogle.com/models/Jibweyqpy/"; // Modelo de Tamir
let soundModel = "https://teachablemachine.withgoogle.com/models/XKK-VjQCy/"; // Modelo de AGUS
//let soundModel = "https://teachablemachine.withgoogle.com/models/g2Fwg2Afp/"; // Modelo de FATI
let FREC_MIN = 100;
let FREC_MAX = 700;
let AMP_MIN = 0.02;
let AMP_MAX = 0.1;
let vol;
let mic;
let pitch;
let audioContext;
let gestorAmp;
let gestorPitch;
let amp;
let haySonido = false;
let haySonido2=true;
let numero=0;
let antesHabiaSonido = false;
let antesHabiaFrec = false;
let frecuencia;
let frecuenciaAnterior;
let estado = "inicio";
const model_url =
  "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";
let cuadDibujado = false;
let fondoDibujado = false;
let cuad;
let cuadr;
let fondo;
let grupos;
let prevX = 0;
let prevY = 0;
let animandoRotacion = false; // Bandera para controlar si se está animando la rotación
const GRAVE_THRESHOLD = 0.5;
let lastSoundTime;
let interval=3*60;
let interval2=10*60;
let startFrame = null; // Inicializa el contador de frames

function preload() {
  classifier = ml5.soundClassifier(soundModel + 'model.json');
  cuadimg = loadImage("img/cuadradoblanco.png");
  diagimg = loadImage("img/diagblanco.png"); //transparente
  rectimg = loadImage("img/rect.png"); //transparente
  cuad1 = loadImage("img/cuad1.png"); //imagen plana
  cuad2 = loadImage("img/cuad2.png"); //imagen plana
  cuad3 = loadImage("img/cuad4.png"); //imagen plana
  cuad4 = loadImage("img/cuad5.png"); //imagen plana
  cuad5 = loadImage("img/cuad6.png"); //imagen plana
}
let predicciones = [
  { label: 'Silbido', confidence: 0.95},
  { label: 'Sh', confidence: 0.95 },
  { label: 'Aplauso', confidence: 1 }
];
let prediccionSilbido = predicciones.find(pred => pred.label === 'Silbido');
let prediccionShh = predicciones.find(pred => pred.label === 'Sh');
let prediccionAplauso = predicciones.find(pred => pred.label === 'Aplauso');

function setup() {
  audioContext = getAudioContext(); // inicia el motor de audio
  mic = new p5.AudioIn(); // inicia el micrófono
  mic.start(startPitch); // se enciende el micrófono y le transmito el analisis de frecuencia (pitch) al micrófono. Conecto la libreria con el micrófono
  userStartAudio(); // inicia el audio
  pg = createGraphics(600, 600);
  cuadr = createGraphics(600, 600);
  fondo = new Fondo();
  frameRate(60);
  createCanvas(600, 600);
  cuad = new Cuad();

  grupos = cuad.grupos; // Obtiene los grupos desde la clase Cuad
  cuad.dibujar(cuadr);
  inicio();

  gestorAmp =  new GestorSenial(AMP_MIN, AMP_MAX);
  gestorPitch = new GestorSenial(FREC_MIN, FREC_MAX);

  antesHabiaSonido = false;
  classifier.classify(gotResult);

  lastSoundTime = millis(); // Inicializa el tiempo de la última detección de sonido
}

function draw() {
  clear(); // Limpia el canvas principal
  image(pg, 0, 0);
  image(cuadr, 0, 0);

  let vol = mic.getLevel(); // cargo en vol la amplitud del micrófono (señal cruda);
  gestorAmp.actualizar(vol);

  haySonido = gestorAmp.filtrada > 0.01; // umbral de ruido que define el estado haySonido

  let inicioElSonido = haySonido && !antesHabiaSonido; // evento de INICIO de un sonido
  let finDelSonido = !haySonido && antesHabiaSonido; // evento de FIN de un sonido

  if (inicioElSonido) { // Evento
    lastSoundTime = millis(); // Actualiza el tiempo de la última detección de sonido
  }
  if (haySonido) { // Estado
    lastSoundTime = millis(); // Actualiza el tiempo de la última detección de sonido
  }
  if (finDelSonido) { // Evento
    cuadDibujado = false;
    fondoDibujado = false;
  }

  let highAmplitudeThreshold = 0.06; // Define el umbral de amplitud para considerar un sonido grave.
  let confianzaSilbido = prediccionSilbido ? prediccionSilbido.confidence : 0;
  let confianzaShh = prediccionShh ? prediccionShh.confidence : 0;
  let confianzaAplauso = prediccionAplauso ? prediccionAplauso.confidence : 0;
  
  if (label === "Ruido de fondo") {
    if (startFrame === null) {
      startFrame = frameCount;
    } else if (frameCount - startFrame >= interval2) {
      resetSketch();
      
      startFrame = null; // Reinicia el contador
    }
  } else {
    startFrame = null; // Reinicia el contador si no se detecta el label
  }


  if (label == 'Silbido' && confianzaSilbido && !ejecutadoSilbido) {
    
    cuad.cambiarImagenesGrupo1();
    for (let cuadro of grupos[0]) {
      cuadro.dibujar(cuadr);
    }
    for (let cuadro of grupos[1]) {
      cuadro.dibujar(cuadr);
    }
    ejecutadoAplauso = true;
    ejecutadoShh = true;
    ejecutadoSilbido = true;

   //resetEjecutados();
  }

  if (label == 'Sh' && confianzaShh && !ejecutadoShh) {
    cuad.rotarGrupo0();
    for (let cuadro of grupos[0]) {
      cuadro.dibujar(cuadr);
    }
    // Actualizar la variable de control
    ejecutadoAplauso = true;
    ejecutadoShh = true;
    ejecutadoSilbido = true;
    //resetEjecutados();
  }

  if (label == 'Aplauso' && confianzaAplauso && !ejecutadoAplauso) {
    fondo.colorFon();
    // Actualizar la variable de control
    ejecutadoAplauso = true;
    ejecutadoShh = true;
    ejecutadoSilbido = true;
    //resetEjecutados();
  }

  if (frameCount % interval==0){
    resetEjecutados();
  }
  
  prevX = mouseX; // Actualiza la posición previa del cursor para la próxima iteración
  prevY = mouseY;
  amp = mic.getLevel();
  console.log(label);
  //console.log("amplitud:  ", amp);

  // Reinicia la obra si no se detecta sonido en los últimos 30 segundos

 /* if (millis() - lastSoundTime > 10000) {
    
    console.log("adentro del if");
  }*/



} 


function inicio() {
  fondo.colorFon();
  console.log("Grupo 1:", grupos[0]);
  console.log("Grupo 2:", grupos[1]);
}

function rotarGrupo0ConAnimacion() {
  let cuadroAnimado = false;
  for (let cuadro of grupos[0]) {
    if (cuadro.rotar90Grados()) {
      cuadroAnimado = true;
    }
  }
  if (!cuadroAnimado) {
    animandoRotacion = false;
  }
}

function llamadoARotar() {
  if (animandoRotacion) {
    rotarGrupo0ConAnimacion();
  }
}

function generarNuevosCuadros(speed) {
  if (speed > 150) {
    cuadr.clear();
    cuad.cambiarImagenesGrupo1();
    for (let cuadro of grupos[0]) {
      cuadro.dibujar(cuadr);
    }
    for (let cuadro of grupos[1]) {
      cuadro.dibujar(cuadr);
    }
  }
}

function mouseClicked() {
  fondo.colorFon();
}

function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}

function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (frequency) {
      gestorPitch.actualizar(frequency);
      //console.log(frequency);
    }
    getPitch();
  });
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
}

function resetEjecutados() {
    ejecutadoSilbido = false;
    ejecutadoShh = false;
    ejecutadoAplauso = false;
    console.log("Variables reseteadas a false después de 3 segundos");
}

function resetSketch() {
 
  console.log("se reinicio");
  pg = createGraphics(600, 600); // Si se usa y necesita reinicio
  cuadr = createGraphics(600, 600);

  fondo = new Fondo();
  cuad = new Cuad();
  grupos = cuad.grupos;
  cuad.dibujar(cuadr);
  
   // Reiniciar gestores de señal
   gestorAmp = new GestorSenial(AMP_MIN, AMP_MAX);
   gestorPitch = new GestorSenial(FREC_MIN, FREC_MAX);

   // Reiniciar variables de control
  antesHabiaSonido = false;
  lastSoundTime = millis(); // Reinicia el tiempo de la última detección de sonido

  fondo.colorFon();
}



/*
let ejecutadoSilbido = false;
let ejecutadoShh = false;
let ejecutadoAplauso = false;
let classifier;
let label = "listening...";
// Teachable Machine model URL:
let soundModel = "https://teachablemachine.withgoogle.com/models/Jibweyqpy/";// Modelo de Tamir 
//let soundModel = "https://teachablemachine.withgoogle.com/models/-pyc93kmY/";// Modelo de AGUS
//let soundModel = "https://teachablemachine.withgoogle.com/models/g2Fwg2Afp/";// Modelo de FATI
let FREC_MIN = 100;
let FREC_MAX = 700;
let AMP_MIN = 0.02;
let AMP_MAX = 0.1;
let vol;
let mic;
let pitch;
let audioContext;
let gestorAmp;
let gestorPitch;
let amp;
let haySonido = false;
let antesHabiaSonido = false;
let antesHabiaFrec = false;
let frecuencia;
let frecuenciaAnterior;
let estado = "inicio";
const model_url =
  "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/"; 
let cuadDibujado = false;
let fondoDibujado = false;
let cuad;
let cuadr;
let fondo;
let grupos;
let prevX = 0;
let prevY = 0;
let animandoRotacion = false; // Bandera para controlar si se está animando la rotación
const GRAVE_THRESHOLD = 0.5;
function preload() {
    classifier = ml5.soundClassifier(soundModel + 'model.json');
  cuadimg = loadImage("img/cuadradoblanco.png");
  diagimg = loadImage("img/diagblanco.png"); //transparente
  rectimg = loadImage("img/rect.png"); //transparente
  cuad1 = loadImage("img/cuad1.png"); //imagen plana
  cuad2 = loadImage("img/cuad2.png"); //imagen plana
  cuad3 = loadImage("img/cuad4.png"); //imagen plana
  cuad4 = loadImage("img/cuad5.png"); //imagen plana
  cuad5 = loadImage("img/cuad6.png"); //imagen plana
}
let predicciones = [
  { label: 'Silbido', confidence: 0.98},
  { label: 'Shh', confidence: 0.98 },
  { label: 'Aplauso', confidence: 1 }
];
let prediccionSilbido = predicciones.find(pred => pred.label === 'Silbido');
let prediccionShh = predicciones.find(pred => pred.label === 'Shh');
let prediccionAplauso = predicciones.find(pred => pred.label === 'Aplauso');

set
function setup() {
  audioContext = getAudioContext(); // inicia el motor de audio
  mic = new p5.AudioIn(); // inicia el micrófono
  mic.start(startPitch); // se enciende el micrófono y le transmito el analisis de frecuencia (pitch) al micrófono. Conecto la libreria con el micrófono
  userStartAudio(); // inicia el audio
  pg = createGraphics(600, 600);
  cuadr = createGraphics(600, 600);
  fondo = new Fondo();
  frameRate(60);
  createCanvas(600, 600);
  cuad = new Cuad();
  
  grupos = cuad.grupos; // Obtiene los grupos desde la clase Cuad
  cuad.dibujar(cuadr);
  inicio();

  gestorAmp =  new GestorSenial( AMP_MIN, AMP_MAX);
  gestorPitch = new GestorSenial( FREC_MIN, FREC_MAX);

  antesHabiaSonido = false;
  classifier.classify(gotResult);
}

function draw() {
  //clear(); // Limpia el canvas principal
  image(pg, 0, 0);
  image(cuadr, 0, 0);

  let vol = mic.getLevel(); // cargo en vol la amplitud del micrófono (señal cruda);
  gestorAmp.actualizar(vol);
  
  haySonido = gestorAmp.filtrada > 0.01; // umbral de ruido que define el estado haySonido

  let inicioElSonido = haySonido && !antesHabiaSonido; // evendo de INICIO de un sonido
  let finDelSonido = !haySonido && antesHabiaSonido; // evento de fIN de un sonido

  if(inicioElSonido){ //Evento
  }
  if(haySonido){ //Estado
}
  if(finDelSonido){//Evento
    cuadDibujado = false;
    fondoDibujado = false;
  }

  let highAmplitudeThreshold = 0.06; // Define el umbral de amplitud para considerar un sonido grave.
  let confianzaSilbido = prediccionSilbido ? prediccionSilbido.confidence : 0;
  let confianzaShh = prediccionShh ? prediccionShh.confidence : 0;
  let confianzaAplauso = prediccionAplauso ? prediccionAplauso.confidence : 0;
  
if (label == 'Silbido' && confianzaSilbido > 0.97 && !ejecutadoSilbido) {  
  cuadr.clear();
  cuad.cambiarImagenesGrupo1();
  for (let cuadro of grupos[0]) {
    cuadro.dibujar(cuadr);
  }
  for (let cuadro of grupos[1]) {
    cuadro.dibujar(cuadr);
  }
  ejecutadoSilbido = true;

  resetEjecutados(); 
}


if (label == 'Shh' && confianzaShh && !ejecutadoShh) {   
  cuad.rotarGrupo0();
  for (let cuadro of grupos[0]) {
    cuadro.dibujar(cuadr); 
  }
  // Actualizar la variable de control
  ejecutadoShh = true;
  resetEjecutados();
}

if (label == 'Aplauso' && confianzaAplauso && !ejecutadoAplauso){
  fondo.colorFon();
  // Actualizar la variable de control
  ejecutadoAplauso = true;
  resetEjecutados();
}

  prevX = mouseX; // Actualiza la posición previa del cursor para la próxima iteración
  prevY = mouseY;
  amp = mic.getLevel();
  console.log(label);
  //console.log("amplitud:  ", amp);
}

function inicio() {
  fondo.colorFon();
  console.log("Grupo 1:", grupos[0]);
  console.log("Grupo 2:", grupos[1]);
}


function rotarGrupo0ConAnimacion() {
  let cuadroAnimado = false;
  for (let cuadro of grupos[0]) {
    if (cuadro.rotar90Grados()) {
      cuadroAnimado = true;
    }
  }
  if (!cuadroAnimado) {
    animandoRotacion = false;
  }
}
function llamadoARotar() {
  if (animandoRotacion) {
    rotarGrupo0ConAnimacion();
  }
}
function generarNuevosCuadros(speed) {
  if (speed > 150) {
    cuadr.clear();
    cuad.cambiarImagenesGrupo1();
    for (let cuadro of grupos[0]) {
      cuadro.dibujar(cuadr);
    }
    for (let cuadro of grupos[1]) {
      cuadro.dibujar(cuadr);
    }
  }
}


function mouseClicked() {
  fondo.colorFon();
}

function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}
function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (frequency) {
      gestorPitch.actualizar(frequency);
      //console.log(frequency);
    }
    getPitch();
  });
}
function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
}

function resetEjecutados() {
  setTimeout(() => {
    ejecutadoSilbido = false;
    ejecutadoShh = false;
    ejecutadoAplauso = false;
    console.log("Variables reseteadas a false después de 5 segundos");
  }, 5000);
}
*/
