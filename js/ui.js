chess = new Chess();
const canvas = $(".canvas");
let board = chess.board();

const pieceClass = (name, color) => `${name ? "piece " : ""}${name}${name ? " " + color : ""}`;

const clear = () => {
  canvas.empty();
}

const build = () => {
  board.forEach((b, r) => {
    let rank = '';
    b.forEach((j, f) => {
      const square = board[r][f];
      rank += `<div class="${square.color} square" data-rank="${square.rank}" data-file="${square.file}"><div class="${pieceClass(square.piece.name,square.piece.color)}" /></div>`;
    });
    canvas.append(`<div class="rank">${rank}</div>`);
  });
};

const refresh = () => {
  board.forEach((b, r) => {
    b.forEach((j, f) => {
      const square = board[r][f];
      const elem = $(`*.square[data-rank="${square.rank}"][data-file="${square.file}"]`);
      elem.empty().removeClass('checked');
      elem.append(`<div class="${pieceClass(square.piece.name, square.piece.color)}" /></div>`);
    });
  });
  chess.check({}).forEach(c => {
    $(`*.square[data-rank="${c.checked.rank}"][data-file="${c.checked.file}"]`).addClass('checked');
  });
}

let source = null;

let listen = (event, cb) => {
  switch (event) {
    case 'square-click':
      $(document).on('click', '.square', function() {
        const rank = $(this).data('rank');
        const file = $(this).data('file');
        const clicked = chess._get(rank,file);
        const available = chess._available(clicked);
        const elem = $(`*.square[data-rank="${rank}"][data-file="${file}"]`);
        const square = $('.square');
        square.removeClass('selected');
        if (source === null) {
          if (!clicked.piece.isSet())
            return;
          source = clicked;
          elem.addClass('selected');
          square.removeClass('available');
          available.forEach(a => $(`*.square[data-rank="${a.rank}"][data-file="${a.file}"]`).addClass('available') );
        } else {
          square.removeClass('available');
          const [from, to] = [`${source.file}${source.rank}`,`${clicked.file}${clicked.rank}`];
          cb({from, to, action: chess.move({from, to})});
          refresh();
          source = null;
        }
      });
      break;
    case 'side-selected':
      $(document).on('click', '.side', function(event) {
        if (event.target.dataset.side === 'black') {
          chess.my_color = 'black';
          board = chess.reverse();
        }
        $('.setup').remove();
        cb();
      });
      break;
  }
}
