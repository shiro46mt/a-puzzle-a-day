const infoWindow = document.getElementById("overlay-info");
const recordWindow = document.getElementById("overlay-record");
const hintWindow = document.getElementById("overlay-hint");
const closeIcons = document.querySelectorAll('.close-icon');

/*** Set event listener ***/
infoWindow.addEventListener("click", function (e) {
  if (e.target == infoWindow)
    infoWindow.classList.remove("is-open");
});

recordWindow.addEventListener("click", function (e) {
  if (e.target == recordWindow)
    recordWindow.classList.remove("is-open");
});

hintWindow.addEventListener("click", function (e) {
  if (e.target == hintWindow)
  hintWindow.classList.remove("is-open");
});

for (var i = 0; i < closeIcons.length; i++) {
  closeIcons[i].addEventListener('click', function (e) {
    infoWindow.classList.remove("is-open");
    recordWindow.classList.remove("is-open");
    hintWindow.classList.remove("is-open");
  });
}

function openInfo() {
  infoWindow.classList.add("is-open");
}

function openRecord() {
  recordWindow.classList.add("is-open");
}

const detailsElement = document.getElementById("export-record");
const recordElement = document.getElementById("stored-record");
detailsElement.addEventListener("toggle", function() {
  if (this.open) {
    exportRecord();
    recordWindow.classList.add("details-open");
    recordElement.select();
  } else {
    recordWindow.classList.remove("details-open");
  }
});

/*** dark mode ***/
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

