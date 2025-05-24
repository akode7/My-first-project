const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const gameBoard = document.getElementById('gameBoard');
const statusText = document.getElementById('status');
const cells = document.querySelectorAll('.cell');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;

const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWin() {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      statusText.textContent = `${board[a]} wins!`;
      gameActive = false;
      return true;
    }
  }

  if (!board.includes('')) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return true;
  }

  return false;
}

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (board[index] !== '' || !gameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (!checkWin()) {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function startGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  gameBoard.style.visibility = 'visible';
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.addEventListener('click', handleCellClick);
  });
}

function restartGame() {
  startGame();
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
