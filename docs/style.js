const infoWindow = document.getElementById("overlay-info");

/*** Set event listener ***/
infoWindow.addEventListener("click", function (e) {
  infoWindow.classList.remove("is-open");
});

function openInfo() {
  infoWindow.classList.add("is-open");
}
