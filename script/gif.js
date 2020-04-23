const apiKey = "JPycizfbKZivbIASGtZyMg6m60hPcOXk";
let gifs = JSON.parse(localStorage.getItem("url")) || [];
gifs.forEach(misGuifos);

function misGuifos(mostrar) {
  let contenedorGeneral = document.getElementById("contenedorGuifos");
  let miGif = document.createElement("img");
  miGif.classList.add("miGif");
  miGif.src = mostrar;
  console.log(mostrar);
  contenedorGeneral.appendChild(miGif);
}
