let board = null;
let game = new Chess();
let playerElo = parseInt(localStorage.getItem('playerElo') || '1200', 10);

function updateEloDisplay() {
  document.getElementById('elo-display').textContent = `Your ELO: ${playerElo}`;
}

function getRandomMove() {
  const moves = game.moves();
  return moves[Math.floor(Math.random() * moves.length)];
}

function evaluateBoard(boardState) {
  const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  let value = 0;
  for (const row of boardState) {
    for (const piece of row) {
      if (!piece) continue;
      const val = values[piece.type] || 0;
      value += piece.color === 'w' ? val : -val;
    }
  }
  return value;
}

function minimax(depth, isMaximising) {
  if (depth === 0 || game.game_over()) {
    return evaluateBoard(game.board());
  }

  const moves = game.moves();
  let best = isMaximising ? -Infinity : Infinity;

  for (const move of moves) {
    game.move(move);
    const val = minimax(depth - 1, !isMaximising);
    game.undo();
    best = isMaximising ? Math.max(best, val) : Math.min(best, val);
  }

  return best;
}

function getBestMove(depth) {
  const moves = game.moves();
  let bestMove = moves[0];
  let bestValue = -Infinity;

  for (const move of moves) {
    game.move(move);
    const value = minimax(depth - 1, false);
    game.undo();
    if (value > bestValue) {
      bestValue = value;
      bestMove = move;
    }
  }

  return bestMove;
}

function updateElo(result, aiElo) {
  const k = 32;
  const expected = 1 / (1 + Math.pow(10, (aiElo - playerElo) / 400));
  const score = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;
  playerElo = Math.round(playerElo + k * (score - expected));
  localStorage.setItem('playerElo', playerElo);
  updateEloDisplay();
}

function checkGameOver(lastMover, aiElo) {
  if (!game.game_over()) return;
  let text;
  if (game.in_checkmate()) {
    if (lastMover === 'player') {
      text = 'You win!';
      updateElo('win', aiElo);
    } else {
      text = 'You lose!';
      updateElo('loss', aiElo);
    }
  } else {
    text = 'Draw!';
    updateElo('draw', aiElo);
  }
  document.getElementById('result').textContent = text;
}

function makeAIMove() {
  const aiElo = parseInt(document.getElementById('ai-elo').value, 10);
  if (game.game_over()) return;
  let move;
  if (aiElo <= 1000) {
    move = getRandomMove();
  } else if (aiElo <= 1200) {
    move = getBestMove(1);
  } else if (aiElo <= 1600) {
    move = getBestMove(2);
  } else {
    move = getBestMove(3);
  }
  game.move(move);
  board.position(game.fen());
  checkGameOver('ai', aiElo);
}

function onDragStart(source, piece) {
  if (game.game_over()) return false;
  if (piece.search(/^b/) !== -1) return false;
}

function onDrop(source, target) {
  const aiElo = parseInt(document.getElementById('ai-elo').value, 10);
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });
  if (move === null) return 'snapback';
  board.position(game.fen());
  if (game.game_over()) {
    checkGameOver('player', aiElo);
  } else {
    window.setTimeout(makeAIMove, 250);
  }
}

function onSnapEnd() {
  board.position(game.fen());
}

function restartGame() {
  game.reset();
  board.start();
  document.getElementById('result').textContent = '';
}

function init() {
  board = ChessBoard('board', {
    draggable: true,
    pieceTheme: 'img/chesspieces/wikipedia/{piece}.png',
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  });
  updateEloDisplay();
  document.getElementById('restart').addEventListener('click', restartGame);
  document.getElementById('ai-elo').addEventListener('change', restartGame);
}

document.addEventListener('DOMContentLoaded', init);
