const canvas = document.getElementById("tetrisCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 600;

const ROWS = 20;
const COLS = 10;
const TILE_SIZE = 30;

const tetrominoes = {
    I: [[1, 1, 1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]],
    J: [[1, 0, 0], [1, 1, 1]],
    L: [[0, 0, 1], [1, 1, 1]]
};

let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let score = 0;
let currentPiece, position;

function startGame() {
    currentPiece = createPiece();
    position = { x: 4, y: 0 };
    gameLoop();
}

document.getElementById("restartButton").addEventListener("click", resetGame);

function resetGame() {
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    score = 0;
    document.getElementById("score").innerText = score;
    position = { x: 4, y: 0 };
    currentPiece = createPiece();
}

document.getElementById("startButton").addEventListener("click", startGame);
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
    if (event.key === "ArrowDown") drop();
    if (event.key === "ArrowUp") rotate();
});

function createPiece() {
    const keys = Object.keys(tetrominoes);
    return tetrominoes[keys[Math.floor(Math.random() * keys.length)]];
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (grid[row][col]) {
                ctx.fillStyle = "blue";
                ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
    drawPiece();
}

function drawPiece() {
    ctx.fillStyle = "red";
    currentPiece.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                ctx.fillRect((position.x + x) * TILE_SIZE, (position.y + y) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                ctx.strokeRect((position.x + x) * TILE_SIZE, (position.y + y) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        });
    });
}

function move(dir) {
    if (position.x + dir >= 0 && position.x + dir + currentPiece[0].length <= COLS) {
        position.x += dir;
    }
    drawGrid();
}

function drop() {
    position.y++;
    if (collision()) {
        position.y--;
        merge();
        checkRows();
        position = { x: 4, y: 0 };
        currentPiece = createPiece();

        if (collision()) {
            alert("Game Over!");
            resetGame();
        }
    }
    drawGrid();
}

function rotate() {
    currentPiece = currentPiece[0].map((_, i) => currentPiece.map(row => row[i])).reverse();
    drawGrid();
}

function collision() {
    return currentPiece.some((row, y) =>
        row.some((cell, x) => cell && (grid[position.y + y] && grid[position.y + y][position.x + x]) !== 0)
    );
}

function merge() {
    currentPiece.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) grid[position.y + y][position.x + x] = 1;
        });
    });
}

function checkRows() {
    for (let row = ROWS - 1; row >= 0; row--) {
        console.log(`Checking row ${row}:`, grid[row]); // Debugging: Print row data

        let filledCount = grid[row].filter(cell => cell === 1).length; // Count filled cells
        console.log(`Filled count in row ${row}: ${filledCount}`);

        if (filledCount >= 5) { // Award points only if 5 or more blocks are filled
            console.log(`Row ${row} cleared with ${filledCount} blocks!`);
            grid.splice(row, 1); // Remove full row
            grid.unshift(Array(COLS).fill(0)); // Insert empty row at the top

            score += 10; // Increase score when 5+ blocks align
            console.log("Score updated:", score); // Debugging: Log new score

            const scoreElement = document.getElementById("score");
            if (scoreElement) {
                scoreElement.innerText = `${score}`;
            } else {
                console.error("Score element not found!");
            }
        }
    }
}

function gameLoop() {
    console.log("Calling checkRows..."); // Debugging: Ensure function runs
    drop();
    drawGrid();
    setTimeout(gameLoop, 300);
}