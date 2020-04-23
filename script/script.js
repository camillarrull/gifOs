const apiKey = "JPycizfbKZivbIASGtZyMg6m60hPcOXk";
window.onload = cargaPagina;
function cargaPagina() {
  eventos();
  mostrarSugerencias();
  sugerenciasPorCuatro();
  mostrarTendencias();
}

async function getApi(url) {
  let found = await fetch(url);
  let response = await found.json();
  console.log(response);
  return response;
}

function elegirTema() {
  let menu = document.getElementById("menuTema");
  menu.style.display = "block";
  document.body.addEventListener("click", () => {
    menu.style.display = "none";
  });
  event.stopPropagation(event);
}
function temaDark() {
  let body = document.querySelector("body");
  body.classList.add("modoDark");
  let lupaNegra = document.getElementById('lupa-negra');
  let lupaBlanca = document.getElementById('lupa-blanca');
  if(habilitarBotonBuscar){
    lupaNegra.replaceWith(lupaBlanca);
    lupaBlanca.style.display='flex';

  }else{
    lupaNegra.remove(lupaBlanca)
  }
}

function temaDay() {
  let body = document.querySelector("body");
  body.classList.remove("modoDark");
}

function displayMenuBuscador() {
  let menu = document.getElementById("menuBuscador");
  let busqueda = document.getElementById("input-buscar");
  if (busqueda !== null) {
    menu.style.display = "block";
    document.body.addEventListener("click", () => {
      menu.style.display = "none";
    });
  }
}
function habilitarBotonBuscar() {
  let boton = document.getElementById("buscar");
  let botonRosa = document.getElementById('buscar-rosa');
  let buscador = document.getElementById("input-buscar");
  if (buscador.value) {
    boton.style.display = 'none';
    botonRosa.style.display = 'flex';
  } else {
    boton.style.display = 'flex';
    botonRosa.style.display = 'none';
  }
}


function eventos() {
  document.getElementById("input-buscar").addEventListener("keydown", accionesEnElBuscador);
  document.getElementById("buscar-rosa").addEventListener("click", getSearchResults);
  document.getElementById("dark").addEventListener("click", temaDark);
  document.getElementById("day").addEventListener("click", temaDay);
  document.getElementById("botonDrop").addEventListener("click", elegirTema);
}
function accionesEnElBuscador() {
  displayMenuBuscador();
  habilitarBotonBuscar();
}
// SUEGERENCIAS //

function mostrarSugerencias() {
  getApi(
    "https://api.giphy.com/v1/gifs/random?api_key=JPycizfbKZivbIASGtZyMg6m60hPcOXk&tag=&rating=G"
  ).then(mostrar);
}
function mostrar(random) {
  let contenedorSugerencias = document.getElementById("contenedor-sugerencias");
  let box = document.createElement("div");
  box.classList.add("sugerencia");
  contenedorSugerencias.appendChild(box);

  let descripcion = document.createElement("p");
  descripcion.id = "titulo";
  descripcion.innerHTML = "#" + random.data.title;
  let cruz = document.createElement("img");
  cruz.src = "./assets/close.svg";
  descripcion.appendChild(cruz);
  descripcion.classList.add("p");
  box.appendChild(descripcion);

  let boton = document.createElement("button");
  boton.id = "giphys-sugeridos";
  box.appendChild(boton);
  boton.innerHTML = 'Ver Mas';
  boton.addEventListener('click', () =>{
      let titulo = random.data.title;
      getApi(
        "http://api.giphy.com/v1/gifs/search?q=" + titulo + "&api_key=" + apiKey
      ). then (busquedasEncontradas);
  });

  let imagen = document.createElement("img");
  imagen.src = random.data.images.downsized_large.url;
  imagen.classList.add("sugerencia");
  imagen.id = "giphy-sugerido";
  box.appendChild(imagen);

}

function sugerenciasPorCuatro() {
  for (i = 0; i < 3; i++) {
    mostrarSugerencias();
  }
}
function mostrarTendencias() {
  getApi(
    "https://api.giphy.com/v1/gifs/trending?api_key=JPycizfbKZivbIASGtZyMg6m60hPcOXk&limit=12&rating=G"
  ).then(tendencias);
}
function tendencias(datos) {
  for (i = 0; i < datos.data.length; i++) {
    let tendenciasContainer = document.getElementById("tendencias-container");
    let box = document.createElement("div");
    box.id = 'div-gif-tendencia';
    box.classList.add("tendencas");
    tendenciasContainer.appendChild(box);
    let imagen = document.createElement("img");
    imagen.src = datos.data[i].images.downsized_large.url;
    imagen.classList.add("tendencias");
    box.appendChild(imagen);
    let descripcion = document.createElement("p");
    descripcion.id = 'titulo-tendencia';
    descripcion.innerHTML = '#' + datos.data[i].title;

    imagen.addEventListener("mouseover",function(){
    box.appendChild(descripcion);
  });
  }
}

let busquedasPasadas = [];

function getSearchResults() {
  let search = document.getElementById("input-buscar").value;
  busquedasPasadas.push(search);
  localStorage.setItem("busquedasAnteriores", JSON.stringify(busquedasPasadas));
  getApi(
    "http://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=" + apiKey
  )
    .then(busquedasEncontradas)
    .then(mostrarUltimaBusqueda)
    .then(limpiarInput);
}
function mostrarUltimaBusqueda() {
  let historial = JSON.parse(localStorage.getItem("busquedasAnteriores"));
  let contenedorBotonesDeBusquedas = document.getElementById("contenedorBotonesDeBusquedas");
  let botonBusquedasRealizadas = document.createElement("div");
  botonBusquedasRealizadas.innerHTML = "#" + historial[historial.length - 1];
  botonBusquedasRealizadas.classList.add("boton-guardado");
  contenedorBotonesDeBusquedas.appendChild(botonBusquedasRealizadas);
}

function busquedasEncontradas(json) {
    let contenedorImagen = document.getElementById("contenedorDeBusqueda");
    let gifsEncontrados = document.createElement("div");
  gifsEncontrados.id = "contenedorDeBusqueda";

  for (i = 0; i < json.data.length; i++) {
    console.log(json.data[i].images.downsized_large.url);
    let imagen = document.createElement("img");
    imagen.src = json.data[i].images.downsized_large.url;
    gifsEncontrados.appendChild(imagen);
  }
  contenedorImagen.replaceWith(gifsEncontrados);
}
function limpiarInput() {
  let buscador = document.getElementById("input-buscar");
  buscador.value = "";
}

