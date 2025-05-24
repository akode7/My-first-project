const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player
const player = {
  x: 370,
  y: 520,
  width: 60,
  height: 20,
  speed: 7,
  color: 'lime'
};

// Bullet
const bullet = {
  x: 0,
  y: 0,
  width: 4,
  height: 10,
  speed: 10,
  active: false,
  color: 'red'
};

// Enemy
let enemy = {
  x: Math.random() * 740,
  y: 50,
  width: 60,
  height: 20,
  speed: 2,
  direction: 1,
  color: 'orange'
};

let score = 0;
let keys = {};

document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function drawRect(obj) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function resetBullet() {
  bullet.active = false;
  bullet.y = player.y;
}

function fireBullet() {
  if (!bullet.active) {
    bullet.x = player.x + player.width / 2 - bullet.width / 2;
    bullet.y = player.y;
    bullet.active = true;
  }
}

function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function update() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player movement
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['ArrowRight']) player.x += player.speed;
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  // Bullet
  if (keys[' ']) fireBullet();
  if (bullet.active) {
    bullet.y -= bullet.speed;
    if (bullet.y < 0) resetBullet();
  }

  // Enemy movement
  enemy.x += enemy.speed * enemy.direction;
  if (enemy.x <= 0 || enemy.x >= canvas.width - enemy.width) {
    enemy.direction *= -1;
    enemy.y += 40;
  }

  // Collision detection
  if (bullet.active && checkCollision(bullet, enemy)) {
    score++;
    resetBullet();
    enemy = {
      ...enemy,
      x: Math.random() * (canvas.width - enemy.width),
      y: 50,
    };
  }

  // Draw everything
  drawRect(player);
  drawRect(enemy);
  if (bullet.active) drawRect(bullet);
  drawScore();

  requestAnimationFrame(update);
}

update();
