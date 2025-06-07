const board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;

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
    board[index] = currentPlayer;
    if (checkWin()) {
        setMessage(`Player ${currentPlayer} wins!`);
        gameOver = true;
    } else if (board.every(Boolean)) {
        setMessage('It\'s a draw!');
        gameOver = true;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        setMessage(`Player ${currentPlayer}\'s turn`);
    }
    renderBoard();
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
}

document.getElementById('reset').addEventListener('click', resetGame);

// Initialize
resetGame();
