let calledNumbers = [];
let interval;
let numbersPool = [];
let cardNumbers = [];

function generateBingoCard() {
  const card = document.getElementById("bingo-card");
  card.innerHTML = "";
  cardNumbers = [];

  let used = new Set();

  while (cardNumbers.length < 25) {
    let num = Math.floor(Math.random() * 75) + 1;
    if (!used.has(num)) {
      used.add(num);
      cardNumbers.push(num);
    }
  }

  cardNumbers[12] = "FREE"; // Center of card
  cardNumbers.forEach((num, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.id = `cell-${index}`;
    cell.textContent = num;
    card.appendChild(cell);
  });

  document.getElementById("cell-12").classList.add("marked"); // Mark center as FREE
}

function startGame() {
  if (interval) return;

  numbersPool = Array.from({ length: 75 }, (_, i) => i + 1)
    .filter(n => !calledNumbers.includes(n));
  shuffle(numbersPool);

  interval = setInterval(callNextNumber, 2000);
}

function callNextNumber() {
  if (numbersPool.length === 0) {
    clearInterval(interval);
    alert("All numbers called!");
    return;
  }

  const number = numbersPool.pop();
  calledNumbers.push(number);
  document.getElementById("called-number").textContent = `Called Number: ${number}`;
  markNumberOnCard(number);
}

function markNumberOnCard(number) {
  cardNumbers.forEach((num, index) => {
    if (num === number) {
      document.getElementById(`cell-${index}`).classList.add("marked");
    }
  });
}

function restartGame() {
  clearInterval(interval);
  interval = null;
  calledNumbers = [];
  document.getElementById("called-number").textContent = "Called Number: -";
  generateBingoCard();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

window.onload = generateBingoCard;
