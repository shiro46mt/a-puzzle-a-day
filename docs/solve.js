class unionFind {
  constructor(n) {
    this.a = Array(n).fill(-1);
  }
  root(i) {
    return this.a[i] < 0 ? i : (this.a[i] = this.root(this.a[i]));
  }
  same(x, y) {
    return this.root(x) === this.root(y);
  }
  unite(x, y) {
    const a = this.a;
    (x = this.root(x)), (y = this.root(y));
    if (x === y) return false;
    if (a[y] < a[x]) (a[y] += a[x]), (a[x] = y);
    else (a[x] += a[y]), (a[y] = x);
    return true;
  }
  size(i) {
    return -this.a[this.root(i)];
  }
}

const makeComb = function (...array) {
  // 2つの配列の組み合わせを作る関数
  const make = (arr1, arr2) => {
    // 組み合わせ作成時の例外処理
    if (arr1.length === 0) {
      return arr2;
    }
    // 組み合わせの作成
    return arr1.reduce((arr, v1) => {
      arr2.forEach((v2) => {
        if (v2 != 0n) {
          // すべての位置を列挙
          for (var pos = 2; pos <= 50; pos++) {
            // 枠外に出ない場合、リストに追加
            statePos = v2 << BigInt(pos - 9);
            if (isPossible(v1, statePos)) {
              // concatで結合
              const group = [].concat(v1, statePos);
              arr.push(group);
            }
          }
        }
      });
      return arr;
    }, []);
  };

  // 繰り返し処理
  return array.reduce(make, []);
};

function isPossible(v1, statePos) {
  // ピースが枠内かつ重なっていないかを判定する
  var boardState = statePos;
  if (typeof v1 == "bigint") {
    if ((v1 & boardState) > 0) return false;
    boardState |= v1;
  } else {
    for (i = 0; i < v1.length; i++) {
      if ((v1[i] & boardState) > 0) return false;
      boardState |= v1[i];
    }
  }

  // 空きマスの連結成分のサイズが5の倍数かを判定する
  const board = bigint2array7(boardState);
  const n = 49;
  var uf = new unionFind(n);
  for (var i = 0; i < 7; i++) {
    for (var j = 0; j < 7; j++) {
      var x = i*7 + j;
      if (x == n-1) continue;
      // 空きマス以外は uf.a[48] に連結させる
      if (board[i][j] == 1) {
        uf.unite(n-1, x);
        continue;
      }
      // 隣接する空きマスを連結させる
      if (j+1 < 7 && board[i][j+1] == 0) uf.unite(x, x+1);
      if (i+1 < 7 && board[i+1][j] == 0) uf.unite(x, x+7);
    }
  }
  for (var i = 0; i < n-1; i++) {
    if ((uf.a[i] < 0) && (uf.a[i] % 5 != 0)) return false;
  }
  return true;
}

function bigint2array7(boardState) {
  var board = [[], [], [], [], [], [], []];
  for (var i = 0; i < 7; i++) {
    for (var j = 0; j < 7; j++) {
      board[i].push(parseInt((boardState >> BigInt(i*8 + j + 9)) & 1n));
    }
  }
  return board;
}

// for debugging
// const m=5;
// const d=6;
// const boundState = 72340172846498303n +
//   (1n << BigInt(m + Math.floor((m-1)/6) * 2 + 8)) +
//   (1n << BigInt(d + Math.floor((d-1)/7) + 24)) +
//   (1n << 68n) - (1n << 60n);

var arr;
var hint;
var hintCount = 0;
const hintLimit = 3;
function openHint() {
  hintWindow.classList.add("is-open");

  // ヒントの作成
  const boundState = initialState + (1n << 68n) - (1n << 60n);

  setTimeout(() => {
    // 非同期処理
    if (!arr) {
      const t0 = Date.now();
      arr = makeComb([boundState], ...pieceInfo.reverse());
      const t1 = Date.now();
      pieceInfo.reverse();
      hint = arr[randInt(arr.length)];

      console.log(arr.length);
      console.log((t1 - t0) / 1000 + ' s');
    }
    document.getElementById("btn-hint").classList.remove("inactive");
    document.querySelector(".loading-icon").classList.remove("is-open");
  }, 100);
}

function showHint() {
  if (hintCount >= hintLimit) return false;

  var i = randInt(8);
  var trgPiece = puzzlePieces[i];
  for (j = 0; j < 8; j++) {
    if (trgPiece.classList.contains("hint")) {
      i = (i + 1) % 8;
      trgPiece = puzzlePieces[i];
    }
  }
  if (trgPiece.classList.contains("hint")) {
    return false;
  }

  const statePos = hint[8-i];
  var pos;
  for (pos = 2; pos <= 50; pos++) {
    var stateBigInt = statePos >> BigInt(pos - 9);
    var state = pieceInfo[i].indexOf(stateBigInt)
    if (state >= 0) {
      trgPiece.setAttribute("data-state", state);
      break;
    }
  }

  hintCount += 1;
  hintWindow.classList.remove("is-open");
  trgPiece.classList.add("hint");
  setPosition(trgPiece, pos);
  setStyle(trgPiece);
}

function randInt(n) {
  // [0, n) の整数を返す
  return Math.floor(Math.random() * n);
}
