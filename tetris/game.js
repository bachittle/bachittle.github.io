const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

// Mobile detection used throughout the project
const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const grid = 20;
const cols = 10;
const rows = 20;
// Explicitly size the canvas so the pieces scale consistently across browsers
canvas.width = cols * grid;
canvas.height = rows * grid;

const colors = [
    null,
    '#FFEB3B', // T
    '#FFC107', // O
    '#FF9800', // L
    '#2196F3', // J
    '#00BCD4', // I
    '#8BC34A', // S
    '#F44336'  // Z
];

let score = 0;
const scoreEl = document.getElementById('score');
const difficultySelect = document.getElementById('difficulty');
let dropInterval = parseInt(difficultySelect.value);
difficultySelect.addEventListener('change', () => {
    dropInterval = parseInt(difficultySelect.value);
});

function updateScore() {
    scoreEl.textContent = 'Score: ' + score;
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    switch (type) {
        case 'T':
            return [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ];
        case 'O':
            return [
                [2, 2],
                [2, 2]
            ];
        case 'L':
            return [
                [0, 3, 0],
                [0, 3, 0],
                [0, 3, 3]
            ];
        case 'J':
            return [
                [0, 4, 0],
                [0, 4, 0],
                [4, 4, 0]
            ];
        case 'I':
            return [
                [0, 0, 0, 0],
                [5, 5, 5, 5],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
        case 'S':
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0]
            ];
        case 'Z':
            return [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0]
            ];
    }
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect((x + offset.x) * grid, (y + offset.y) * grid, grid, grid);
                context.strokeStyle = '#222';
                context.strokeRect((x + offset.x) * grid, (y + offset.y) * grid, grid, grid);
            }
        });
    });
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        score += rowCount * 10;
        rowCount *= 2;
    }
    updateScore();
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function playerReset() {
    const pieces = 'TJLOSZI';
    player.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
    player.pos.y = 0;
    player.pos.x = ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        score = 0;
        updateScore();
    }
}

let dropCounter = 0;
let lastTime = 0;

function update(time = 0) {
    const delta = time - lastTime;
    lastTime = time;
    dropCounter += delta;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        playerMove(-1);
    } else if (event.key === 'ArrowRight') {
        playerMove(1);
    } else if (event.key === 'ArrowDown') {
        playerDrop();
    } else if (event.key === 'q') {
        playerRotate(-1);
    } else if (event.key === 'w') {
        playerRotate(1);
    }
});

// Touch controls for mobile devices
let touchStartX = null;
let touchStartY = null;

function handleTouchStart(e) {
    if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
    if (e.preventDefault) e.preventDefault();
}

function handleTouchEnd(e) {
    if (touchStartX === null || touchStartY === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (Math.max(absX, absY) > 30) {
        if (absX > absY) {
            if (dx > 0) {
                playerMove(1);
            } else {
                playerMove(-1);
            }
        } else {
            if (dy > 0) {
                playerDrop();
            } else {
                playerRotate(1);
            }
        }
    }
    touchStartX = touchStartY = null;
    if (e.preventDefault) e.preventDefault();
}

if (isMobile) {
    document.body.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
}

const arena = createMatrix(cols, rows);
const player = {
    pos: { x: 0, y: 0 },
    matrix: null
};

playerReset();
updateScore();
update();
