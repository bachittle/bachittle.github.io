const size = 4;
const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let board = [];
let score = 0;

function init() {
    board = Array.from({ length: size }, () => Array(size).fill(0));
    score = 0;
    addRandomTile();
    addRandomTile();
    draw();
    document.addEventListener('keydown', handleKey);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    if (isMobile) {
        document.body.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }
}

function handleKey(e) {
    let moved = false;
    switch (e.key) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
    }
    if (moved) {
        addRandomTile();
        draw();
        if (isGameOver()) {
            setTimeout(() => alert('Game Over!'), 100);
        }
    }
    if (e.preventDefault) e.preventDefault();
}

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
            handleKey({ key: dx > 0 ? 'ArrowRight' : 'ArrowLeft', preventDefault(){} });
        } else {
            handleKey({ key: dy > 0 ? 'ArrowDown' : 'ArrowUp', preventDefault(){} });
        }
    }
    touchStartX = touchStartY = null;
    if (e.preventDefault) e.preventDefault();
}

function addRandomTile() {
    const empty = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] === 0) empty.push({ r, c });
        }
    }
    if (empty.length === 0) return;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function slide(row) {
    const arr = row.filter(v => v !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            score += arr[i];
            arr.splice(i + 1, 1);
        }
    }
    while (arr.length < size) arr.push(0);
    return arr;
}

function rotateClockwise(mat) {
    const res = Array.from({ length: size }, () => Array(size).fill(0));
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            res[c][size - 1 - r] = mat[r][c];
        }
    }
    return res;
}

function moveLeft() {
    let moved = false;
    for (let r = 0; r < size; r++) {
        const newRow = slide(board[r]);
        if (!arraysEqual(newRow, board[r])) moved = true;
        board[r] = newRow;
    }
    return moved;
}

function moveRight() {
    board = board.map(row => row.reverse());
    const moved = moveLeft();
    board = board.map(row => row.reverse());
    return moved;
}

function moveUp() {
    board = rotateClockwise(board);
    const moved = moveLeft();
    board = rotateClockwise(rotateClockwise(rotateClockwise(board)));
    return moved;
}

function moveDown() {
    board = rotateClockwise(rotateClockwise(rotateClockwise(board)));
    const moved = moveLeft();
    board = rotateClockwise(board);
    return moved;
}

function arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
}

function draw() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    board.forEach(row => {
        row.forEach(value => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (value) tile.classList.add('tile-' + value);
            tile.textContent = value ? value : '';
            boardEl.appendChild(tile);
        });
    });
    document.getElementById('score-value').textContent = score;
}

function isGameOver() {
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] === 0) return false;
            if (c < size - 1 && board[r][c] === board[r][c + 1]) return false;
            if (r < size - 1 && board[r][c] === board[r + 1][c]) return false;
        }
    }
    return true;
}

init();
