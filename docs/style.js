const infoWindow = document.getElementById("overlay-info");

/*** Set event listener ***/
infoWindow.addEventListener("click", function (e) {
  infoWindow.classList.remove("is-open");
});

function openInfo() {
  infoWindow.classList.add("is-open");
}

const checkToggle = document.getElementById('js_mode_toggle');
const isLight = window.matchMedia('(prefers-color-scheme: light)').matches;
const keyLocalStorage = 'apad';
const localTheme = localStorage.getItem(keyLocalStorage);
if (localTheme === 'light') {
  changeMode('light');
} else if (localTheme === 'dark') {
  changeMode('dark');
} else if (isLight) {
  changeMode('light');
}
checkToggle.addEventListener('change', function (e) {
  if (e.target.checked) {
    changeMode('light');
    localStorage.setItem(keyLocalStorage, 'light');
  } else {
    changeMode('dark');
    localStorage.setItem(keyLocalStorage, 'dark');
  }
});

function changeMode(mode) {
  if (mode === 'light') {
    document.documentElement.setAttribute('data-theme-mode', 'light')
    checkToggle.checked = true;
  } else if (mode === 'dark') {
    document.documentElement.setAttribute('data-theme-mode', 'dark')
    checkToggle.checked = false;
  }
}

