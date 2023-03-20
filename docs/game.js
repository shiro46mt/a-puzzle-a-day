const cellSize = 40;
const pieceSize = 79;

var puzzlePieces = document.querySelectorAll('.puzzle-piece');
var puzzleCells = document.querySelectorAll('.puzzle-cell:not(.null)');

var board = document.querySelector('.board');

var activePiece = null;
var dx = 0;
var dy = 0;
var isClick = false;

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
    event.preventDefault();
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

      // 角度を90度回転させる
      // 角度が0度になった場合、左右反転する
      var newRotation = (currentRotation + 90) % 360;
      var newReverse = currentReverse;
      if (newRotation == 0) newReverse *= -1;

      activePiece.setAttribute("data-rotation", newRotation);
      activePiece.setAttribute("data-reverse", newReverse);
    } else {
      // ドラッグ -> 移動
      if (bounds.left < touch.pageX &&
          bounds.right > touch.pageX &&
          bounds.top < touch.pageY &&
          bounds.bottom > touch.pageY) {

        var rotateOffset = 0;
        if (["piece6", "piece7", "piece8"].includes(activePiece.id) &&
            ["90", "270"].includes(activePiece.getAttribute("data-rotation"))) {
          rotateOffset = 25;
        }
        activePiece.style.left = floor(touch.pageX - dx, bounds.left) + rotateOffset + 'px';
        activePiece.style.top = floor(touch.pageY - dy, bounds.top) + rotateOffset + 'px';
        activePiece.setAttribute("data-scale", 1);
      } else {
        activePiece.style.left = '';
        activePiece.style.top = '';
        activePiece.setAttribute("data-scale", 0.5);
      }
    }
    setStyle(activePiece);
    activePiece = null;
    dx = 0;
    dy = 0;
  }
}


function init() {
  const today = new Date();
  const m = today.getMonth()+1;
  const d = today.getDate();

  document.querySelector('#m' + m).classList.add("today");
  document.querySelector('#d' + d).classList.add("today");
}

function resetPuzzlePiece() {
  for (var i = 0; i < puzzlePieces.length; i++) {
    puzzlePieces[i].style.left = '';
    puzzlePieces[i].style.top = '';
    puzzlePieces[i].setAttribute("data-scale", 0.5);
    puzzlePieces[i].setAttribute("data-rotation", 0);
    puzzlePieces[i].setAttribute("data-reverse", 1);
    setStyle(puzzlePieces[i]);
  }
}

function setStyle(element) {
  var scale = parseFloat(element.getAttribute("data-scale") || "0.5");
  var reverse = parseInt(element.getAttribute("data-reverse") || "1");
  var rotation = parseInt(element.getAttribute("data-rotation") || "0");

  element.style.transform = "scale(" + (scale * reverse) + ", " + scale + ") rotate(" + rotation + "deg)";
}

function floor(x, origin) {
  return Math.floor((x - origin + cellSize / 2) / cellSize) * cellSize + origin - 8;
}

for (var i = 0; i < puzzleCells.length; i++) {
  puzzleCells[i].addEventListener('touchstart', onTouchStart, false);
  puzzleCells[i].addEventListener('mousedown', onTouchStart, false);
}

document.addEventListener('touchmove', onTouchMove, false);
document.addEventListener('mousemove', onTouchMove, false);

document.addEventListener('touchend', onTouchEnd, false);
document.addEventListener('mouseup', onTouchEnd, false);

init();
resetPuzzlePiece();
