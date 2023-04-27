const cellSize = 40;
const pieceSize = 79;
const groundPieceSizeRatio = 0.4;

var puzzlePieces = document.querySelectorAll('.puzzle-piece');
var puzzleCells = document.querySelectorAll('.puzzle-cell:not(.null)');

var board = document.querySelector('.board');

var activePiece = null;
var dx = 0; // piece の左上を原点とした, クリック位置
var dy = 0;
var isClick = false;

var initialState;

function onTouchStart(event) {
  if (event.target.parentElement.classList.contains('puzzle-piece')) {
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
    activePiece.style.zIndex = 0;
    var bounds = board.getBoundingClientRect();
    // タッチイベントとマウスイベントを区別する
    const touch = event.type === 'touchend' ? event.changedTouches[0] : event;
    if (isClick) {
      // シングルクリック -> 回転・反転
      var currentReverse = parseInt(activePiece.getAttribute("data-reverse") || "1");
      var currentRotation = parseInt(activePiece.getAttribute("data-rotation") || "0");

      if ((currentRotation == 270 && currentReverse == 1) ||
          (currentRotation == 0 && currentReverse == -1)) {
        // 左右反転する
        var newRotation = currentRotation;
        var newReverse = currentReverse * -1;
        activePiece.setAttribute("data-reverse", newReverse);
      } else {
        // 角度を90度回転させる
        var newRotation = (currentRotation + 90 * currentReverse);
        var newReverse = currentReverse;
        activePiece.setAttribute("data-rotation", newRotation);
      }
      activePiece.setAttribute("data-state", (newRotation * newReverse / 90) + (1 - newReverse) * 3.5);


    } else {
      // ドラッグ -> 移動
      if (bounds.left < touch.pageX &&
          bounds.right > touch.pageX &&
          bounds.top < touch.pageY &&
          bounds.bottom > touch.pageY) {

        var currentRotation = parseInt(activePiece.getAttribute("data-rotation") || "0");
        // 2x3 のpieceでは回転時に半マスずれるため、offsetを設定する
        var posOffset = 0;
        if (["piece6", "piece7", "piece8"].includes(activePiece.id) &&
            currentRotation % 180 == 90) {
          posOffset = cellSize / 2;
        }
        var j = Math.floor((touch.pageX - dx - bounds.left + (cellSize / 2) + posOffset) / cellSize);
        var i = Math.floor((touch.pageY - dy - bounds.top + (cellSize / 2) - posOffset) / cellSize);
        activePiece.style.left = j * cellSize + bounds.left - posOffset + 1 + 'px'; // 1px はborderの分
        activePiece.style.top = i * cellSize + bounds.top + posOffset + 1 + 'px';
        activePiece.setAttribute("data-pos", (i+1)*8 + (j+1));
        activePiece.setAttribute("data-scale", 1);
      } else {
        activePiece.style.left = '';
        activePiece.style.top = '';
        activePiece.setAttribute("data-pos", 0);
        activePiece.setAttribute("data-scale", groundPieceSizeRatio);
      }
    }
    setStyle(activePiece);
    activePiece = null;
    dx = 0;
    dy = 0;

    if (isClear()) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.7 }
      });
    }
  }
}


function init() {
  const today = new Date();
  const m = today.getMonth()+1;
  const d = today.getDate();

  document.querySelector('#m' + m).classList.add("today");
  document.querySelector('#d' + d).classList.add("today");

  initialState = 72340172846498303n + (1n << BigInt(m + Math.floor((m-1)/6) * 2 + 8)) + (1n << BigInt(d + Math.floor((d-1)/7) + 24));
}

function resetPuzzlePiece() {
  for (var i = 0; i < puzzlePieces.length; i++) {
    puzzlePieces[i].style.left = '';
    puzzlePieces[i].style.top = '';
    puzzlePieces[i].setAttribute("data-scale", groundPieceSizeRatio);
    puzzlePieces[i].setAttribute("data-rotation", 0);
    puzzlePieces[i].setAttribute("data-reverse", 1);
    puzzlePieces[i].setAttribute("data-state", 0);
    puzzlePieces[i].setAttribute("data-pos", 0);
    setStyle(puzzlePieces[i]);
  }
}

function setStyle(element) {
  var scale = parseFloat(element.getAttribute("data-scale") || "0.5");
  var reverse = parseInt(element.getAttribute("data-reverse") || "1");
  var rotation = parseInt(element.getAttribute("data-rotation") || "0");

  element.style.transform = "scale(" + (scale * reverse) + ", " + scale + ") rotate(" + rotation + "deg)";
}

const pieceInfo = [
  [8623621632n,135200768n,25837175808n,251723776n,252182528n,25803489792n,17760256n,17247241728n],
  [8623882752n,68091904n,17280795648n,251789312n,251920384n,8690729472n,34537472n,17247372288n],
  [17247371776n,118226944n,17280664064n,51249152n,201785344n,8690861056n,235077632n,8623883264n],
  [33689088n,134745600n,235407360n,235012608n,235407360n,235012608n,33689088n,134745600n],
  [201590272n,34473984n,201590272n,34473984n,135135744n,100928512n,135135744n,100928512n],
  [920064n,100795904n,658944n,100926976n,100795904n,658944n,100926976n,920064n],
  [790016n,101057536n,919040n,33949184n,67503616n,920576n,101057024n,396800n],
  [921088n,101058048n,921088n,101058048n,101058048n,921088n,101058048n,921088n],
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
