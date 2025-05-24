const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const winnerMessage = document.getElementById("winnerMessage");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.6;

const paddleWidth = 10, paddleHeight = 80;
const ballSize = 10;
let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 5, ballSpeedY = 5; // Default ball speed
let playerScore = 0, aiScore = 0;
let gameRunning = false;
const scoreLimit = 10;

let upPressed = false, downPressed = false; // Player movement flags

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Player: ${playerScore}`, canvas.width - 120, 30);
    ctx.fillText(`AI: ${aiScore}`, 30, 30);
}

function checkWin() {
    if (playerScore >= scoreLimit) {
        winnerMessage.innerText = "🏆 You Win!";
        endGame();
    } else if (aiScore >= scoreLimit) {
        winnerMessage.innerText = "🤖 AI Wins!";
        endGame();
    }
}

function endGame() {
    gameRunning = false;
    winnerMessage.style.display = "block";
    restartButton.style.display = "block";
}

function updateGame() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRect(10, leftPaddleY, paddleWidth, paddleHeight, "white"); // AI Paddle
    drawRect(canvas.width - 20, rightPaddleY, paddleWidth, paddleHeight, "white"); // Player Paddle
    drawBall(ballX, ballY, ballSize, "white");
    drawScore();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY >= canvas.height) ballSpeedY *= -1;

    if ((ballX <= 20 && ballY >= leftPaddleY && ballY <= leftPaddleY + paddleHeight) ||
        (ballX >= canvas.width - 20 && ballY >= rightPaddleY && ballY <= rightPaddleY + paddleHeight)) {
        ballSpeedX *= -1;
    }

    if (ballX <= 0) {
        playerScore++;
        resetBall();
    } else if (ballX >= canvas.width) {
        aiScore++;
        resetBall();
    }

    // **AI Movement (Stays Inside Box)**
    let aiSpeed = 6.5;
    let predictedBallY = ballY + ballSpeedY * 30;

    if (ballX < canvas.width / 2) {
        if (predictedBallY > leftPaddleY + paddleHeight / 2 && leftPaddleY < canvas.height - paddleHeight) {
            leftPaddleY += aiSpeed;
        } else if (predictedBallY < leftPaddleY + paddleHeight / 2 && leftPaddleY > 0) {
            leftPaddleY -= aiSpeed;
        }
    }

    // **Player Movement**
    if (upPressed && rightPaddleY > 0) rightPaddleY -= 10;
    if (downPressed && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += 10;

    checkWin();
    requestAnimationFrame(updateGame);
}


// Touch controls for mobile
canvas.addEventListener("touchmove", (event) => {
    let touch = event.touches[0];
    rightPaddleY = touch.clientY - paddleHeight / 2;
});

// Keyboard controls for desktop
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") upPressed = true;
    if (event.key === "ArrowDown") downPressed = true;
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowUp") upPressed = false;
    if (event.key === "ArrowDown") downPressed = false;
});

// **Fix Ball Speed Increasing Issue**
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5; // Always reset ball speed
    ballSpeedY = 5; // Always reset ball speed
    ballSpeedX *= Math.random() > 0.5 ? 1 : -1; // Randomize direction
}

// **Start game properly when button is clicked**
startButton.addEventListener("click", () => {
    if (!gameRunning) {
        gameRunning = true;
        winnerMessage.style.display = "none";
        restartButton.style.display = "inline-block";
        playerScore = 0;
        aiScore = 0;
        leftPaddleY = (canvas.height - paddleHeight) / 2;
        rightPaddleY = (canvas.height - paddleHeight) / 2;
        resetBall(); // Ensure ball speed resets correctly
        updateGame();
    }
});

// **Restart button allows unlimited resets without increasing ball speed**
restartButton.addEventListener("click", () => {
    gameRunning = false; // Stop the game completely
    cancelAnimationFrame(updateGame); // Prevent old game loops from stacking
    winnerMessage.style.display = "none";
    restartButton.style.display = "inline-block";
    playerScore = 0;
    aiScore = 0;
    leftPaddleY = (canvas.height - paddleHeight) / 2;
    rightPaddleY = (canvas.height - paddleHeight) / 2;
    resetBall(); // Ensures ball speed doesn't keep increasing
    setTimeout(() => { // Add slight delay to prevent overlapping animations
        gameRunning = true; // Restart game smoothly
        updateGame();
    }, 100);
});

