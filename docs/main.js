const cellSize = 40;
const pieceSize = 79;
const groundPieceSizeRatio = 0.4;

var puzzlePieces = document.querySelectorAll('.puzzle-piece');
var puzzleCells = document.querySelectorAll('.puzzle-cell:not(.null)');

var board = document.querySelector('#board');

var activePiece = null;
var dx = 0; // piece の左上を原点とした, クリック位置
var dy = 0;
var isClick = false;

var initialState;

function onTouchStart(event) {
  if (event.target.parentElement.classList.contains('puzzle-piece')) {
    if (event.target.parentElement.classList.contains("hint")) return;

    event.preventDefault();
    activePiece = event.target.parentElement;
    activePiece.style.zIndex = 1000;
    // タッチイベントとマウスイベントを区別する
    const touch = event.type === 'touchstart' ? event.touches[0] : event;
    dx = touch.pageX - activePiece.offsetLeft;
    dy = touch.pageY - activePiece.offsetTop;
    isClick = true;
  }
}

function onTouchMove(event) {
  if (activePiece) {
    // タッチイベントとマウスイベントを区別する
    const touch = event.type === 'touchmove' ? event.touches[0] : event;
    activePiece.style.left = touch.pageX - dx + 'px';
    activePiece.style.top = touch.pageY - dy + 'px';
    activePiece.setAttribute("data-scale", 1);
    setStyle(activePiece);
    isClick = false;
  }
}

function onTouchEnd(event) {
  if (activePiece) {
    event.preventDefault();
    // タッチイベントとマウスイベントを区別する
    const touch = event.type === 'touchend' ? event.changedTouches[0] : event;

    // シングルクリック -> 回転・反転
    if (isClick)
      rotateReverseActivePiece();
    // ドラッグ -> 移動
    else
      placeActivePiece(touch);

    // 終了処理
    setStyle(activePiece);
    activePiece.style.zIndex = 0;
    activePiece = null;
    dx = 0;
    dy = 0;

    // クリア時処理
    if (isClear()) {
      setClearRecord();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.7 }
      });
    }
  }
}

function rotateReverseActivePiece() {
  var state = parseInt(activePiece.getAttribute("data-state") || "0");
  var newState = (state + 1) % 8;

  // state = {0, 1, 2, 3}
  if (["piece4", "piece6"].includes(activePiece.id)) {
    newState %= 4;
  }
  // state = {0, 1, 6, 7}
  else if (activePiece.id == "piece5") {
    if (newState == 2) newState += 4;
  }
  // state = {0, 1}
  else if (activePiece.id == "piece8") {
    newState %= 2;
  }

  activePiece.setAttribute("data-state", newState);
}

function placeActivePiece(touch) {
  var bounds = board.getBoundingClientRect();
  var pos;
  if (bounds.left < touch.pageX &&
    bounds.right > touch.pageX &&
    bounds.top < touch.pageY &&
    bounds.bottom > touch.pageY) {

    var state = parseInt(activePiece.getAttribute("data-state") || "0");
    // 2x3 のpieceでは回転時に半マスずれるため、offsetを設定する
    var posOffset = 0;
    if (["piece6", "piece7", "piece8"].includes(activePiece.id) && (state % 2 == 1)) {
      posOffset = cellSize / 2;
    }
    var j = Math.floor((touch.pageX - dx - bounds.left + (cellSize / 2) + posOffset) / cellSize);
    var i = Math.floor((touch.pageY - dy - bounds.top + (cellSize / 2) - posOffset) / cellSize);
    pos = (i+1)*8 + (j+1);
  } else {
    pos = 0;
  }
  setPosition(activePiece, pos);
}


/*** record ***/
const pieceInfo = [
  [8623621632n,135200768n,25837175808n,251723776n,17247241728n,252182528n,25803489792n,17760256n,],
  [8623882752n,68091904n,17280795648n,251789312n,17247372288n,251920384n,8690729472n,34537472n,],
  [17247371776n,118226944n,17280664064n,51249152n,8623883264n,201785344n,8690861056n,235077632n,],
  [33689088n,134745600n,235407360n,235012608n,0n,0n,0n,0n,],
  [201590272n,34473984n,0n,0n,0n,0n,100928512n,135135744n,],
  [920064n,100795904n,658944n,100926976n,0n,0n,0n,0n,],
  [790016n,101057536n,919040n,33949184n,396800n,67503616n,920576n,101057024n,],
  [921088n,101058048n,0n,0n,0n,0n,0n,0n,],
]

function isClear() {
  var boardState = initialState;
  for (var i = 0; i < puzzlePieces.length; i++) {
    var state = parseInt(puzzlePieces[i].getAttribute("data-state") || "0");
    var pos = BigInt(parseInt(puzzlePieces[i].getAttribute("data-pos") || "0"));
    if (pos == 0) return false;

    boardState |= (pieceInfo[i][state] << (pos - 9n));
  }
  return boardState == (1n << 60n) - 1n;
}

var displayMonth = 0;
const monthlyEmoji = ["🎍","🍫","🎎", "🌸","🎏","💠", "🎋","🎆","🎑", "🎃","🍁","🎄",]
function getRecordTable(month=0) {
  if (month == 0) {
    month = displayMonth;
  }
  displayMonth = month;

  // 月の表示
  for (var m=1; m<=12; m++) {
    const cell = document.querySelector('#rcd-m' + m);
    if (m == month) {
      cell.classList.add("today");
    } else {
      cell.classList.remove("today");
    }
  }

  // 日の表示
  var record = getLocalStorageRecord(month);
  for (var d=1; d<=31; d++) {
    const cell = document.querySelector('#rcd-d' + d);
    if ((record >> BigInt(d-1)) & 1n) {
      cell.textContent = monthlyEmoji[month-1];
      cell.classList.add("clear");
    } else {
      cell.textContent = d;
      cell.classList.remove("clear");
    }
    // 小月
    if ((d == 30 && month == 2) || (d == 31 && [2,4,6,9,11].includes(month))) {
      cell.textContent = "";
      cell.classList.add("null");
    } else {
      cell.classList.remove("null");
    }
  }
}

function setClearRecord() {
  const today = new Date();
  const m = today.getMonth()+1;
  const d = today.getDate();

  var record = getLocalStorageRecord(m);
  var newRecord = record | (1n << BigInt(d-1));
  setLocalStorageRecord(m, newRecord);

  getRecordTable(m);
}

function getLocalStorageRecord(month) {
  return BigInt(localStorage.getItem('apad-rcd-m'+month) || 0);
}

function setLocalStorageRecord(month, value) {
  localStorage.setItem('apad-rcd-m'+month, value.toString());
}

/*** import/export record ***/
const sep = '&';
const storedRecordArea = document.querySelector('#stored-record');

function importRecord() {
  const storedRecordStr = storedRecordArea.value;
  if (storedRecordStr == "") return;

  const storedRecord = storedRecordStr.split(sep);
  if (storedRecord.length != 12) return;

  for (var m=1; m<=12; m++) {
    const record = getLocalStorageRecord(m);
    const newRecord = decodeBI(storedRecord[m-1]);
    if (newRecord == record) continue;

    setLocalStorageRecord(m, newRecord);
    // console.log('#' + m + ": " + record);
  }
  getRecordTable(displayMonth);
}

function exportRecord() {
  const storedRecord = [];
  for (var m=1; m<=12; m++) {
    const record = getLocalStorageRecord(m);
    storedRecord.push(encodeBI(record));
  }
  storedRecordArea.value = storedRecord.join(sep);
  // console.log(storedRecord.join(sep));
}

const radix = 36;
function encodeBI(value) {
  return value.toString(radix);
}

function decodeBI(value) {
  return BigInt(parseInt(value, radix));
}

/*** initialize ***/
function init() {
  const today = new Date();
  const m = today.getMonth()+1;
  const d = today.getDate();

  document.querySelector('#m' + m).classList.add("today");
  document.querySelector('#d' + d).classList.add("today");

  // 0,1,2,3,4,5,6,7,8,15,16,23,24,32,40,48,56
  initialState = 72340172846498303n + (1n << BigInt(m + Math.floor((m-1)/6) * 2 + 8)) + (1n << BigInt(d + Math.floor((d-1)/7) + 24));

  getRecordTable(m);
}

function resetPuzzlePiece() {
  for (var i = 0; i < puzzlePieces.length; i++) {
    puzzlePieces[i].style.left = '';
    puzzlePieces[i].style.top = '';
    puzzlePieces[i].setAttribute("data-scale", groundPieceSizeRatio);
    puzzlePieces[i].setAttribute("data-state", 0);
    puzzlePieces[i].setAttribute("data-pos", 0);
    puzzlePieces[i].classList.remove("hint");
    setStyle(puzzlePieces[i]);
  }
  resetHint();
}

function setStyle(element) {
  var scale = parseFloat(element.getAttribute("data-scale") || "0.5");
  var state = parseInt(element.getAttribute("data-state") || "0");

  var rotation = state * 90;
  var reverse = 1;
  if (state >= 4) {
    rotation = (8 - state) * 90;
    reverse = -1;
  }

  element.style.transform = "scale(" + (scale * reverse) + ", " + scale + ") rotate(" + rotation + "deg)";
}

function setPosition(element, pos) {
  var bounds = board.getBoundingClientRect();
  var state = parseInt(element.getAttribute("data-state") || "0");
  // var pos = parseInt(element.getAttribute("data-pos") || "0");

  if (pos > 0) {
    // 2x3 のpieceでは回転時に半マスずれるため、offsetを設定する
    var posOffset = 0;
    if (["piece6", "piece7", "piece8"].includes(element.id) && (state % 2 == 1)) {
      posOffset = cellSize / 2;
    }
    var i = Math.floor(pos / 8) - 1;
    var j = pos % 8 - 1;
    element.style.left = j * cellSize + bounds.left - posOffset + 1 + 'px'; // 1px はborderの分
    element.style.top = i * cellSize + bounds.top + posOffset + 1 + 'px';
    element.setAttribute("data-scale", 1);

  } else {
    element.style.left = '';
    element.style.top = '';
    element.setAttribute("data-scale", groundPieceSizeRatio);
  }
  element.setAttribute("data-pos", pos);
}

/*** event listener ***/
for (var i = 0; i < puzzleCells.length; i++) {
  puzzleCells[i].addEventListener('touchstart', onTouchStart, false);
  puzzleCells[i].addEventListener('mousedown', onTouchStart, false);
}

document.addEventListener('touchmove', onTouchMove, false);
document.addEventListener('mousemove', onTouchMove, false);

document.addEventListener('touchend', onTouchEnd, false);
document.addEventListener('mouseup', onTouchEnd, false);

/*** initialize ***/
init();
resetPuzzlePiece();
