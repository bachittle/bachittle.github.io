const board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let singlePlayer = false;
const humanPlayer = 'X';
const aiPlayer = 'O';

function renderBoard() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    board.forEach((mark, i) => {
        const square = document.createElement('div');
        square.classList.add('square');
        square.textContent = mark || '';
        square.addEventListener('click', () => makeMove(i));
        boardEl.appendChild(square);
    });
}

function makeMove(index) {
    if (gameOver || board[index]) return;
    if (singlePlayer && currentPlayer === aiPlayer) return;

    board[index] = currentPlayer;
    renderBoard();

    if (checkWin()) {
        setMessage(`Player ${currentPlayer} wins!`);
        gameOver = true;
        return;
    }

    if (board.every(Boolean)) {
        setMessage('It\'s a draw!');
        gameOver = true;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setMessage(`Player ${currentPlayer}'s turn`);

    if (singlePlayer && currentPlayer === aiPlayer && !gameOver) {
        setTimeout(aiMove, 300);
    }
}

function checkWin() {
    const combos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return combos.some(([a, b, c]) =>
        board[a] && board[a] === board[b] && board[a] === board[c]
    );
}

function setMessage(msg) {
    document.getElementById('message').textContent = msg;
}

function resetGame() {
    for (let i = 0; i < board.length; i++) {
        board[i] = null;
    }
    currentPlayer = 'X';
    gameOver = false;
    setMessage(`Player ${currentPlayer}'s turn`);
    renderBoard();
    if (singlePlayer && currentPlayer === aiPlayer) {
        setTimeout(aiMove, 300);
    }
}

function aiMove() {
    if (gameOver) return;
    const index = getBestMove();
    if (index === -1) return;
    board[index] = currentPlayer;
    renderBoard();
    if (checkWin()) {
        setMessage(`Player ${currentPlayer} wins!`);
        gameOver = true;
    } else if (board.every(Boolean)) {
        setMessage('It\'s a draw!');
        gameOver = true;
    } else {
        currentPlayer = humanPlayer;
        setMessage(`Player ${currentPlayer}'s turn`);
    }
}

function getBestMove() {
    // winning move
    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = aiPlayer;
            const win = checkWin();
            board[i] = null;
            if (win) return i;
        }
    }
    // block human
    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = humanPlayer;
            const win = checkWin();
            board[i] = null;
            if (win) return i;
        }
    }
    // center
    if (!board[4]) return 4;
    // corners
    const corners = [0, 2, 6, 8].filter(i => !board[i]);
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
    // sides
    const sides = [1, 3, 5, 7].filter(i => !board[i]);
    if (sides.length) return sides[Math.floor(Math.random() * sides.length)];
    return -1;
}

document.getElementById('reset').addEventListener('click', resetGame);
document.getElementById('mode').addEventListener('click', () => {
    singlePlayer = !singlePlayer;
    const modeBtn = document.getElementById('mode');
    modeBtn.textContent = singlePlayer ? 'Switch to 2 Player' : 'Switch to 1 Player';
    resetGame();
});

// Initialize
resetGame();
