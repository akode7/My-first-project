const board = document.getElementById("game-board");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

// Restart game instantly
restartBtn.addEventListener("click", () => {
    createBoard();
});

const statusText = document.getElementById("status");
let cells = [];
let currentPlayer = "X";

// Winning combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize game board
function createBoard() {
    board.innerHTML = "";
    cells = [];
    for (let i = 0; i < 9; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", () => makeMove(i));
        board.appendChild(cell);
        cells.push(cell);
    }
    statusText.textContent = "Your turn!";
    currentPlayer = "X";
}

// Make move
function makeMove(index) {
    if (cells[index].innerHTML === "") {
        cells[index].innerHTML = currentPlayer;
        if (checkWinner()) {
            statusText.textContent = `${currentPlayer} Wins!`;
            disableBoard();
            return;
        }
        if (checkTie()) {
            statusText.textContent = "It's a Tie!";
            return;
        }
        currentPlayer = "O";
        statusText.textContent = "AI's turn...";
        setTimeout(aiMove, 500);
    }
}

// AI move (Minimax)
function aiMove() {
    let emptyCells = cells.filter(cell => cell.innerHTML === "");
    if (emptyCells.length > 0) {
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        randomCell.innerHTML = "O";

        if (checkWinner()) {
            statusText.textContent = "AI Wins!";
            disableBoard();
            return;
        }
        if (checkTie()) {
            statusText.textContent = "It's a Tie!";
            return;
        }
        currentPlayer = "X";
        statusText.textContent = "Your turn!";
    }
}

// Check winner
function checkWinner() {
    return winPatterns.some(pattern =>
        pattern.every(index => cells[index].innerHTML === currentPlayer)
    );
}

// Check tie
function checkTie() {
    return cells.every(cell => cell.innerHTML !== "");
}

// Disable board after game ends
function disableBoard() {
    cells.forEach(cell => cell.style.pointerEvents = "none");
}

// Minimax Algorithm for AI
function minimax(boardState, player) {
    const availableMoves = boardState.map((v, i) => v === "" ? i : null).filter(v => v !== null);

    if (winPatterns.some(pattern => pattern.every(index => boardState[index] === "X"))) {
        return { score: -10 };
    }
    if (winPatterns.some(pattern => pattern.every(index => boardState[index] === "O"))) {
        return { score: 10 };
    }
    if (availableMoves.length === 0) {
        return { score: 0 };
    }

    let moves = [];
    for (let move of availableMoves) {
        let newBoard = [...boardState];
        newBoard[move] = player;
        let result = minimax(newBoard, player === "O" ? "X" : "O");
        moves.push({ index: move, score: result.score });
    }

    return player === "O" ? moves.reduce((best, move) => move.score > best.score ? move : best) :
                            moves.reduce((best, move) => move.score < best.score ? move : best);
}

// Reset game
startBtn.addEventListener("click", createBoard);

// Start the game on first load
createBoard();