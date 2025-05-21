const board = document.getElementById("bingo-board");
const aiBoard = document.getElementById("ai-board");
const message = document.getElementById("message");
const numberDraw = document.getElementById("number-draw");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

let gameStarted = false;
let drawnNumbers = [];
let playerCard = [];
let aiCard = [];

const createBingoCard = () => {
  const numbers = generateBingoNumbers();
  playerCard = numbers.slice();
  aiCard = numbers.slice();
  drawnNumbers = [];

  board.innerHTML = "";
  aiBoard.innerHTML = "";
  message.textContent = "";
  numberDraw.textContent = "Next Number: ";

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    if (i === 12) {
      cell.textContent = "FREE";
      cell.classList.add("marked", "free");
    } else {
      cell.textContent = numbers[i];
      cell.addEventListener("click", () => {
        if (!gameStarted) return;
        cell.classList.toggle("marked");
        if (checkBingo(playerCard)) {
          message.textContent = "🎉 You Win! 🎉";
        }
      });
    }

    board.appendChild(cell);

    const aiCell = document.createElement("div");
    aiCell.classList.add("cell");
    aiCell.textContent = numbers[i];
    aiBoard.appendChild(aiCell);
  }
};

const generateBingoNumbers = () => {
  const nums = [];
  while (nums.length < 24) {
    const num = Math.floor(Math.random() * 75) + 1;
    if (!nums.includes(num)) nums.push(num);
  }
  nums.splice(12, 0, "FREE");
  return nums;
};

const drawNumber = () => {
  if (drawnNumbers.length === 75) {
    message.textContent = "Game Over!";
    return;
  }

  let num;
  do {
    num = Math.floor(Math.random() * 75) + 1;
  } while (drawnNumbers.includes(num));

  drawnNumbers.push(num);
  numberDraw.textContent = `Next Number: ${num}`;

  markNumberOnCard(num, playerCard);
  markNumberOnCard(num, aiCard);

  if (checkBingo(aiCard)) {
    message.textContent = "🤖 AI Wins! 🤖";
  }
};

const markNumberOnCard = (num, card) => {
  const index = card.indexOf(num);
  if (index !== -1) {
    card[index] = null;
  }
};

const checkBingo = (card) => {
  const lines = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10,]
::contentReference[oaicite:1]{index=1}
}