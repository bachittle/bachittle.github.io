const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const mobileControls = document.getElementById('mobile-controls');

const keys = {};

if (isMobile) {
    document.body.classList.add('mobile');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    if (mobileControls) {
        mobileControls.style.display = 'flex';
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');
        const shootBtn = document.getElementById('shootBtn');
        const pressLeft = () => { keys['ArrowLeft'] = true; };
        const releaseLeft = () => { keys['ArrowLeft'] = false; };
        const pressRight = () => { keys['ArrowRight'] = true; };
        const releaseRight = () => { keys['ArrowRight'] = false; };
        leftBtn && leftBtn.addEventListener('touchstart', pressLeft);
        leftBtn && leftBtn.addEventListener('touchend', releaseLeft);
        rightBtn && rightBtn.addEventListener('touchstart', pressRight);
        rightBtn && rightBtn.addEventListener('touchend', releaseRight);
        shootBtn && shootBtn.addEventListener('touchstart', shoot);
    }
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

const player = { x: canvas.width / 2 - 15, y: canvas.height - 20, width: 30, height: 10, speed: 5 };
const bullets = [];
const enemyBullets = [];
const aliens = [];
let direction = 1;
let score = 0;
let level = 1;
let alienSpeed = 1;
let enemyBulletSpeed = 3;
let shootChance = 0.003;

const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');

function createAliens() {
    aliens.length = 0;
    const rows = Math.min(1 + level, 5); // start easy and add rows
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

function drawEnemyBullets() {
    ctx.fillStyle = '#0af';
    enemyBullets.forEach(b => ctx.fillRect(b.x, b.y, 2, 10));
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

function updateEnemyBullets() {
    enemyBullets.forEach((b, i) => {
        b.y += enemyBulletSpeed;
        if (b.y > canvas.height) enemyBullets.splice(i, 1);
    });
}

function updateAliens() {
    let hitEdge = false;
    aliens.forEach(a => {
        a.x += direction * alienSpeed;
        if (a.x < 0 || a.x + a.width > canvas.width) hitEdge = true;
    });
    if (hitEdge) {
        direction *= -1;
        aliens.forEach(a => a.y += 20);
    }
    aliens.forEach(a => {
        if (a.y + a.height >= player.y) gameOver();
    });
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

    enemyBullets.forEach((b, bi) => {
        if (b.x < player.x + player.width && b.x + 2 > player.x && b.y < player.y + player.height && b.y + 10 > player.y) {
            gameOver();
        }
    });

    if (aliens.length === 0) {
        level++;
        levelEl.textContent = 'Level: ' + level;
        alienSpeed += 0.2;
        enemyBulletSpeed += 0.3;
        shootChance += 0.001;
        createAliens();
    }
}

function movePlayer() {
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x + player.width < canvas.width) player.x += player.speed;
}

function shoot() {
    bullets.push({ x: player.x + player.width / 2 - 1, y: player.y });
}

function alienShoot() {
    if (aliens.length && Math.random() < shootChance) {
        const a = aliens[Math.floor(Math.random() * aliens.length)];
        enemyBullets.push({ x: a.x + a.width / 2 - 1, y: a.y + a.height });
    }
}

function gameOver() {
    alert('Game Over! Score: ' + score);
    document.location.reload();
}
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
    updateEnemyBullets();
    updateAliens();
    alienShoot();
    checkCollisions();
    drawPlayer();
    drawBullets();
    drawEnemyBullets();
    drawAliens();
    requestAnimationFrame(gameLoop);
}

createAliens();
scoreEl.textContent = 'Score: ' + score;
levelEl.textContent = 'Level: ' + level;
requestAnimationFrame(gameLoop);
