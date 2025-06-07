const canvas = document.getElementById('pong-canvas');
const ctx = canvas.getContext('2d');

function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function setCanvasSize() {
  if (isMobile() && window.innerHeight > window.innerWidth) {
    canvas.width = Math.min(window.innerWidth * 0.9, 400);
    canvas.height = Math.min(window.innerHeight * 0.7, 600);
  } else {
    canvas.width = 600;
    canvas.height = 400;
  }
}

setCanvasSize();
window.addEventListener('resize', setCanvasSize);

const paddleHeight = 80;
const paddleWidth = 10;
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = playerY;

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  dx: 4,
  dy: 4,
  radius: 8,
};

let playerScore = 0;
let aiScore = 0;

function drawRect(x, y, w, h) {
  ctx.fillStyle = '#fff';
  ctx.fillRect(x, y, w, h);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#0aa';
  ctx.fill();
  ctx.closePath();
}

function resetBall(direction) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = direction * 4;
  ball.dy = (Math.random() * 2 - 1) * 4;
}

function update() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // bounce top/bottom
  if (ball.y < ball.radius || ball.y > canvas.height - ball.radius) {
    ball.dy *= -1;
  }

  // player paddle
  if (
    ball.x - ball.radius < paddleWidth &&
    ball.y > playerY &&
    ball.y < playerY + paddleHeight
  ) {
    ball.dx *= -1;
    ball.x = paddleWidth + ball.radius;
  }

  // ai paddle
  if (
    ball.x + ball.radius > canvas.width - paddleWidth &&
    ball.y > aiY &&
    ball.y < aiY + paddleHeight
  ) {
    ball.dx *= -1;
    ball.x = canvas.width - paddleWidth - ball.radius;
  }

  // score
  if (ball.x < 0) {
    aiScore++;
    resetBall(1);
  } else if (ball.x > canvas.width) {
    playerScore++;
    resetBall(-1);
  }

  // ai movement
  const target = ball.y - paddleHeight / 2;
  aiY += (target - aiY) * 0.05;
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawRect(0, playerY, paddleWidth, paddleHeight);
  drawRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);
  drawBall();

  ctx.fillStyle = '#fff';
  ctx.font = '20px monospace';
  ctx.fillText(playerScore, canvas.width / 4, 30);
  ctx.fillText(aiScore, (canvas.width * 3) / 4, 30);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

let upPressed = false;
let downPressed = false;

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') upPressed = true;
  if (e.key === 'ArrowDown') downPressed = true;
});

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowUp') upPressed = false;
  if (e.key === 'ArrowDown') downPressed = false;
});

if (isMobile()) {
  const mobileControls = document.getElementById('mobile-controls');
  if (mobileControls) {
    mobileControls.style.display = 'flex';
  }
  const upBtn = document.getElementById('upBtn');
  const downBtn = document.getElementById('downBtn');
  if (upBtn && downBtn) {
    const pressUp = () => { upPressed = true; };
    const releaseUp = () => { upPressed = false; };
    const pressDown = () => { downPressed = true; };
    const releaseDown = () => { downPressed = false; };
    upBtn.addEventListener('touchstart', pressUp);
    upBtn.addEventListener('touchend', releaseUp);
    downBtn.addEventListener('touchstart', pressDown);
    downBtn.addEventListener('touchend', releaseDown);
  }

  canvas.addEventListener('touchmove', e => {
    const rect = canvas.getBoundingClientRect();
    const touchY = e.touches[0].clientY - rect.top;
    playerY = Math.min(Math.max(touchY - paddleHeight / 2, 0), canvas.height - paddleHeight);
    e.preventDefault();
  }, { passive: false });
  document.body.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
}

function movePlayer() {
  if (upPressed) playerY = Math.max(0, playerY - 6);
  if (downPressed) playerY = Math.min(canvas.height - paddleHeight, playerY + 6);
}

function start() {
  setInterval(movePlayer, 1000 / 60);
  loop();
}

document.addEventListener('DOMContentLoaded', start);
