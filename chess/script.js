let board = null;
let game = new Chess();

function onDragStart(source, piece) {
  if (game.game_over()) return false;
  if (piece.search(/^b/) !== -1) return false;
}

function makeRandomMove() {
  const possibleMoves = game.moves();
  if (possibleMoves.length === 0) return;
  const randomIdx = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIdx]);
  board.position(game.fen());
}

function onDrop(source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });
  if (move === null) return 'snapback';
  window.setTimeout(makeRandomMove, 250);
}

function onSnapEnd() {
  board.position(game.fen());
}

function init() {
  board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  });
}

document.addEventListener('DOMContentLoaded', init);
