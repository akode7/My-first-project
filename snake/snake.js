const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

canvas.width = 400;
canvas.height = 400;

const box = 20;
let snake, food, dx, dy, score, gameRunning;
let gameInterval;

document.addEventListener("keydown", changeDirection);
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

function initializeGame() {
    snake = [{ x: 200, y: 200 }];
    food = { x: Math.floor(Math.random() * canvas.width / box) * box,
             y: Math.floor(Math.random() * canvas.height / box) * box };
    dx = box;
    dy = 0;
    score = 0;
    gameRunning = false;
}

function startGame() {
    initializeGame();
    startBtn.style.display = "none";
    restartBtn.style.display = "block";
    canvas.style.display = "block";
    gameRunning = true;
    gameInterval = setInterval(draw, 100);
}

function restartGame() {
    clearInterval(gameInterval);
    initializeGame();
    gameRunning = true;
    gameInterval = setInterval(draw, 100);
}

function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && dx === 0) { dx = -box; dy = 0; }
    else if (key === 38 && dy === 0) { dx = 0; dy = -box; }
    else if (key === 39 && dx === 0) { dx = box; dy = 0; }
    else if (key === 40 && dy === 0) { dx = 0; dy = box; }
}

function draw() {
    if (!gameRunning) return;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "yellow" : "orange";
        ctx.strokeStyle = "black";
        ctx.fillRect(segment.x, segment.y, box, box);
        ctx.strokeRect(segment.x, segment.y, box, box);
    });

    let head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x >= canvas.width || head.y >= canvas.height || head.x < 0 || head.y < 0 ||
        snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        alert("Game Over! Score: " + score);
        gameRunning = false;
        clearInterval(gameInterval);
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = { x: Math.floor(Math.random() * canvas.width / box) * box,
                 y: Math.floor(Math.random() * canvas.height / box) * box };
    } else {
        snake.pop();
    }
}