const apiKey = "JPycizfbKZivbIASGtZyMg6m60hPcOXk";

const mostrarBloquesGrabación = () => {
  document.getElementById("grabar-guifos").hidden = false;
  document.getElementById("instrucciones").hidden = true;
  let icono = document.getElementById("divIcono");
  icono.style.display = "none";
  let barra = document.getElementById("barraCrear");
  barra.style.display = "none";
};
const getStreamAndRecord = () => {
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        width: 590,
        height: 240,
      },
    })
    .then(comenzarGrabacion);
};
const comenzarGrabacion = (stream) => {
  video.srcObject = stream;
  video.play();

  recorder = RecordRTC(stream, {
    type: "gif",
    frameRate: 1,
    quality: 10,
    width: 360,
    hidden: 240,
    onGifRecordingStarted: function () {
      console.log("started");
    },
  });
  recorder.startRecording();
};
const frenarGrabacion = async () => {
  document.getElementById("video").hidden = true;
  document.getElementById("img").hidden = false;

  recorder.stopRecording();

  let blob = recorder.getBlob();
  const imagen = document.getElementById("img");
  const objURL = URL.createObjectURL(blob);
  imagen.src = objURL;
  imagen.setAttribute("width", "590");
  imagen.setAttribute("height", "240");
  let contenedor = document.getElementById("video-wrap");
  contenedor.appendChild(imagen);
  console.log("vista previa");

  //COPIAR EN EL PORTAPAPELES EL GIF QUE OBTUVE
  let botonCopiar = document.getElementById("botonCopiar");
  botonCopiar.setAttribute("url", objURL);
  navigator.clipboard.writeText(objURL);

  //DESCARGAR EL GIF QUE OBTUVE
  let a = document.getElementById("descarga");
  a.setAttribute("href", objURL);
};

window.onload = () => {
  const grabar = document.getElementById("comenzar");
  const capturar = document.getElementById("capturar");
  const botonListo = document.getElementById("botonStop");
  const botonSubir = document.getElementById("subirGuifo");

  grabar.addEventListener("click", mostrarBloquesGrabación);
  capturar.addEventListener("click", getStreamAndRecord);
  capturar.addEventListener("click", cambiarBoton);
  botonListo.addEventListener("click", frenarGrabacion);
  botonListo.addEventListener("click", apretarBotonListo);
  botonSubir.addEventListener("click", apretarBotonSubir);
};

function cambiarBoton() {
  let capturar = document.getElementById("botonesCapturar");
  let recording = document.getElementById("botonesGrabar");
  capturar.style.display = "none";
  recording.style.display = "flex";
  let barraChequeo = document.getElementById("barraChequeo");
  let barraCaptura = document.getElementById("barraCapturando");
  barraChequeo.style.display = "none";
  barraCaptura.style.display = "flex";
}
function apretarBotonListo() {
  let barraCaptura = document.getElementById("barraCapturando");
  let barrraVistaPrevia = document.getElementById("barraVistaPrevia");
  barraCaptura.style.display = "none";
  barrraVistaPrevia.style.display = "flex";
  let recording = document.getElementById("botonesGrabar");
  let guifRealizado = document.getElementById("botonesRealizado");
  recording.style.display = "none";
  guifRealizado.style.display = "flex";
  let img = document.getElementById("img");
  img.style.display = "flex";
}
function apretarBotonSubir() {
  let barrraVistaPrevia = document.getElementById("barraVistaPrevia");
  let barraSubir = document.getElementById("barraSubiendoGuifo");
  barrraVistaPrevia.style.display = "none";
  barraSubir.style.display = "flex";
  let contenedorVideo = document.getElementById("video-wrap");
  let contenedorSubiendo = document.getElementById("cuadradoBlanco");
  let guifRealizado = document.getElementById("botonesRealizado");
  let botonCancelar = document.getElementById("botonCancelar");
  contenedorVideo.style.display = "none";
  contenedorSubiendo.style.display = "block";
  guifRealizado.style.display = "none";
  botonCancelar.style.display = "flex";

  let form = new FormData();
  form.append("file", recorder.getBlob(), "myGif.gif");
  form.append("apiKey", apiKey);
  console.log(form.get("file"));
  subirAGhipy(form);
}

async function subirAGhipy(form) {
  fetch("https://upload.giphy.com/v1/gifs?" + "api_key=" + apiKey, {
    method: "POST",
    body: form,
    mode: "cors",
  })
    .then(async function (response) {
      if (response.ok) {
        let jSON = await response.json();
        console.log(jSON);
        return jSON;
      } else {
        throw "Error en la llamada";
      }
    })
    .then((datos) => {
      let gifId = datos.data.id;
      let gifs = JSON.parse(localStorage.getItem("url")) || [];
      gifs.push(
        `https://media1.giphy.com/media/${gifId}/giphy.gif?cid=52afa79a31b48e99d4268c4cc71df9dcbf8f8b3c9db10a07&rid=giphy.gif`
      );
      localStorage.setItem("url", JSON.stringify(gifs));

      gifs.forEach(misGuifos);
    });
  setTimeout("visualizarGuifo()", 3000);
}

function misGuifos(mostrar) {
  let contenedorGeneral = document.getElementById("contenedorGuifos");
  let miGif = document.createElement("img");
  miGif.classList.add("miGif");
  miGif.src = mostrar;
  console.log(mostrar);
  contenedorGeneral.appendChild(miGif);
}

const visualizarGuifo = async () => {
  let barraSubiendo = document.getElementById("barraSubiendoGuifo");
  let barraGuifoSubido = document.getElementById("barraGuifoSubido");
  barraSubiendo.style.display = "none";
  barraGuifoSubido.style.display = "flex";
  let guifo = document.getElementById("guifoCreado");
  guifo.style.display = "flex";
  let cuadradoB = document.getElementById("cuadradoBlanco");
  cuadradoB.style.display = "none";
  let botonC = document.getElementById("botonCancelar");
  botonC.style.display = "none";
  let imagen = document.getElementById("img");
  imagen.style.display = "block";
  let contenedor2 = document.getElementById("enmarcarGuifo");
  contenedor2.appendChild(imagen);
  imagen.setAttribute("width", "365");
  imagen.setAttribute("height", "191");
  document.getElementById("contenedorGuifos").hidden = false;
};
