const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = { x: canvas.width / 2 - 15, y: canvas.height - 20, width: 30, height: 10, speed: 5 };
const bullets = [];
const aliens = [];
let direction = 1;
let score = 0;

const scoreEl = document.getElementById('score');

function createAliens() {
    const rows = 3;
    const cols = 8;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            aliens.push({ x: 60 + c * 50, y: 40 + r * 40, width: 30, height: 20 });
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = '#0f0';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    ctx.fillStyle = '#ff0';
    bullets.forEach(b => ctx.fillRect(b.x, b.y, 2, 10));
}

function drawAliens() {
    ctx.fillStyle = '#f00';
    aliens.forEach(a => ctx.fillRect(a.x, a.y, a.width, a.height));
}

function updateBullets() {
    bullets.forEach((b, i) => {
        b.y -= 6;
        if (b.y < 0) bullets.splice(i, 1);
    });
}

function updateAliens() {
    let hitEdge = false;
    aliens.forEach(a => {
        a.x += direction * 1;
        if (a.x < 0 || a.x + a.width > canvas.width) hitEdge = true;
    });
    if (hitEdge) {
        direction *= -1;
        aliens.forEach(a => a.y += 20);
    }
}

function checkCollisions() {
    bullets.forEach((b, bi) => {
        aliens.forEach((a, ai) => {
            if (b.x < a.x + a.width && b.x + 2 > a.x && b.y < a.y + a.height && b.y + 10 > a.y) {
                bullets.splice(bi, 1);
                aliens.splice(ai, 1);
                score += 10;
                scoreEl.textContent = 'Score: ' + score;
            }
        });
    });
}

function movePlayer() {
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x + player.width < canvas.width) player.x += player.speed;
}

function shoot() {
    bullets.push({ x: player.x + player.width / 2 - 1, y: player.y });
}

const keys = {};
document.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'Space') shoot();
});

document.addEventListener('keyup', e => {
    keys[e.code] = false;
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    updateBullets();
    updateAliens();
    checkCollisions();
    drawPlayer();
    drawBullets();
    drawAliens();
    requestAnimationFrame(gameLoop);
}

createAliens();
scoreEl.textContent = 'Score: ' + score;
requestAnimationFrame(gameLoop);
