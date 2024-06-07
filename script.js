const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const result = document.getElementById('result');
const resetButton = document.getElementById('reset');

let currentPlayer = '〇';
let gameActive = true;
let moves = 0;
let boardState = ['', '', '', '', '', '', '', '', ''];
const maxMovesPerPlayer = 3;
const playerMoves = { '〇': [], '×': [] };

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const checkWinner = () => {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      gameActive = false;
      result.textContent = `${currentPlayer}の勝利！`;
      addStrikeThrough(condition); // 勝利した際のラインを描画
      return;
    }
  }
};

const handleClick = (index) => {
  if (!gameActive) return;

  if (boardState[index] !== '') {
    return; // 既にマークがある場所には置けない
  }

  if (playerMoves[currentPlayer].length >= maxMovesPerPlayer) {
    const oldestMoveIndex = playerMoves[currentPlayer].shift(); // 最も古い移動を削除
    const oldestMoveCell = cells[oldestMoveIndex];
    oldestMoveCell.textContent = ''; // 一番古いマークを消去
    boardState[oldestMoveIndex] = ''; // マークがあった場所の状態を更新
  }

  boardState[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
  playerMoves[currentPlayer].push(index); // 現在の移動を追加
  moves++;
  checkWinner();

  currentPlayer = currentPlayer === '〇' ? '×' : '〇';
};

const resetGame = () => {
  currentPlayer = '〇';
  gameActive = true;
  moves = 0;
  boardState = ['', '', '', '', '', '', '', '', ''];
  playerMoves['〇'] = [];
  playerMoves['×'] = [];
  cells.forEach(cell => {
    cell.textContent = '';
  });
  result.textContent = '';
  // SVGラインを削除
  const lines = document.querySelectorAll('.line');
  lines.forEach(line => line.remove());
};

const addStrikeThrough = (condition) => {
  const [a, b, c] = condition;
  const firstCell = cells[a].getBoundingClientRect();
  const lastCell = cells[c].getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();
  
  const startX = firstCell.left + firstCell.width / 2 - boardRect.left;
  const startY = firstCell.top + firstCell.height / 2 - boardRect.top;
  const endX = lastCell.left + lastCell.width / 2 - boardRect.left;
  const endY = lastCell.top + lastCell.height / 2 - boardRect.top;

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', startX);
  line.setAttribute('y1', startY);
  line.setAttribute('x2', endX);
  line.setAttribute('y2', endY);
  line.setAttribute('stroke', 'black');
  line.setAttribute('stroke-width', '5');
  line.classList.add('line');

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', boardRect.width);
  svg.setAttribute('height', boardRect.height);
  svg.classList.add('line');
  svg.appendChild(line);
  board.appendChild(svg);
};

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => handleClick(index));
});

resetButton.addEventListener('click', resetGame);
