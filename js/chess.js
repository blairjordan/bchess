let WIDTH = 8;
let HEIGHT = 8;

const [ROOK, KNIGHT, BISHOP, QUEEN, KING, PAWN] = ['R', 'N', 'B', 'Q', 'K', 'P'];
const PIECES = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const [WHITE, BLACK] = ['white', 'black'];
const [PLAYER_COLOR, OPPONENT_COLOR] = [WHITE, BLACK]
const directions = {
  CASTLE_KING: 'CASTLE_KING',
  CASTLE_QUEEN: 'CASTLE_QUEEN',
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  UP_LEFT: 'UP_LEFT',
  UP_RIGHT: 'UPRIGHT',
  DOWN_LEFT: 'DOWN_LEFT',
  DOWN_RIGHT: 'DOWN_RIGHT',
  L: 'L'
}
const actions = {
  MOVE: 1,
  PLAYER_CAPTURE: 2,
  PLAYER_CAPTURE_KING: 4,
  OPPONENT_CAPTURE: 8,
  CASTLE: 16,
  EN_PASSANT: 32
}

class Piece {
  constructor(name, color, moves) {
    this.name = name || '';
    this.color = color || '';
    this.moves = moves || 0;
  }

  isSet() {
    return this.name !== '';
  }

  hasMoved() {
    return this.moves !== 0;
  }

  getClass() {
    return `${(this.name) ? 'piece ' : ''}${this.name}${this.name ? ' ' + this.color : ''}`;
  }
}

class Move {
  constructor(parent) {
    this.chess = parent;
  }

  castle(r, f) {
    let moves = [];
    let [q, k] = [true, true];

    // king has moved?
    if (this.chess._get(Chess.rankIdx(r), FILES[f]).piece.hasMoved())
      [q, k] = [false, false];

    // king side
    for (let i = f + 1; i < WIDTH - 1; i++) {
      if (this.chess._get(Chess.rankIdx(r), FILES[i]).piece.isSet())
        k = false;
    }
    // queen side
    for (let i = f - 1; i > 0; i--) {
      if (this.chess._get(Chess.rankIdx(r), FILES[i]).piece.isSet())
        q = false;
    }

    // where the rooks should be
    let [krook, qrook] =
      [
        this.chess._get(Chess.rankIdx(r), FILES[WIDTH - 1]),
        this.chess._get(Chess.rankIdx(r), FILES[0])
      ];

    // rooks moved?
    if ((krook.piece.name !== ROOK) || (krook.piece.hasMoved()))
      k = false;
    if ((qrook.piece.name !== ROOK) || (qrook.piece.hasMoved()))
      q = false;

    if (k)
      Chess.add(moves, { r, f: WIDTH - 1, p: directions.CASTLE_KING });
    if (q)
      Chess.add(moves, { r, f: 0, p: directions.CASTLE_QUEEN });

    return moves;
  }

  pawn(r, f, d) {
    let moves = [];
    const op = (d === 'n') ? '-' : '+';
    const first = ((d === 'n' && r === HEIGHT - 2) || (d === 's' && r === 1));

    const left = { r: eval(`r${op}1`), f: f - 1, p: directions.LEFT };
    const right = { r: eval(`r${op}1`), f: f + 1, p: directions.RIGHT };
    const front1 = { r: eval(`r${op}1`), f: f, p: `${directions.UP}1` };
    const front2 = { r: eval(`r${op}2`), f: f, p: `${directions.UP}2` };

    if (this.chess.populated(left)) { Chess.add(moves, left); }
    if (this.chess.populated(right)) { Chess.add(moves, right); }
    if (!this.chess.populated(front1)) {
      Chess.add(moves, front1);
      if (first && !this.chess.populated(front2))
        Chess.add(moves, front2);
    }
    return moves;
  }

  diag(r, f) {
    let moves = [];
    for (let i = 1; i <= HEIGHT - 1; i++) {
      Chess.add(moves, { r: r - i, f: f - i, p: directions.UP_LEFT });
      Chess.add(moves, { r: r - i, f: f + i, p: directions.UP_RIGHT });
      Chess.add(moves, { r: r + i, f: f + i, p: directions.DOWN_RIGHT });
      Chess.add(moves, { r: r + i, f: f - i, p: directions.DOWN_LEFT });
    }
    return moves;
  }

  straight(r, f) {
    let moves = [];
    for (let i = 0; i <= Math.floor((f / WIDTH) * WIDTH) - 1; i++) {
      Chess.add(moves, { r, f: i, p: directions.LEFT });
    }
    for (let i = WIDTH - 1; i > f; i--) {
      Chess.add(moves, { r, f: i, p: directions.RIGHT });
    }
    for (let i = 0; i <= Math.floor((r / HEIGHT) * HEIGHT) - 1; i++) {
      Chess.add(moves, { r: i, f, p: directions.UP });
    }
    for (let i = HEIGHT - 1; i > r; i--) {
      Chess.add(moves, { r: i, f, p: directions.DOWN });
    }
    return moves;
  }

  box(r, f) {
    let moves = [];
    Chess.add(moves, { r: r - 1, f, p: directions.UP });
    Chess.add(moves, { r: r + 1, f, p: directions.DOWN });
    Chess.add(moves, { r, f: f - 1, p: directions.LEFT });
    Chess.add(moves, { r, f: f + 1, p: directions.RIGHT });
    Chess.add(moves, { r: r - 1, f: f - 1, p: directions.UP_LEFT });
    Chess.add(moves, { r: r - 1, f: f + 1, p: directions.UP_RIGHT });
    Chess.add(moves, { r: r + 1, f: f - 1, p: directions.DOWN_LEFT });
    Chess.add(moves, { r: r + 1, f: f + 1, p: directions.DOWN_RIGHT });
    return moves;
  }

  L(r, f) {
    let moves = [],
      l = 0;
    Chess.add(moves, { r: r - 2, f: f - 1, p: `${directions.L}${++l}` });
    Chess.add(moves, { r: r - 2, f: f + 1, p: `${directions.L}${++l}` });
    Chess.add(moves, { r: r + 2, f: f - 1, p: `${directions.L}${++l}` });
    Chess.add(moves, { r: r + 2, f: f + 1, p: `${directions.L}${++l}` });
    Chess.add(moves, { r: r - 1, f: f - 2, p: `${directions.L}${++l}` });
    Chess.add(moves, { r: r - 1, f: f + 2, p: `${directions.L}${++l}` });
    Chess.add(moves, { r: r + 1, f: f - 2, p: `${directions.L}${++l}` });
    Chess.add(moves, { r: r + 1, f: f + 2, p: `${directions.L}${++l}` });
    return moves;
  }
}

class Chess {
  constructor() {
    this.moveCount = 0;
    this.board = new Array(HEIGHT).fill().map(
      () => new Array(WIDTH).fill().map(
        () => new (function () {
          this.piece = new Piece();
          this.rank = '';
          this.file = '';
        })()
      )
    );
    this.Move = new Move(this);
  }

  piece(rankIdx, colIdx, player, color) {
    let name = '';
    if (((player === 'opponent') && rankIdx === 0) || ((player === 'me' && rankIdx === 7)))
      name = PIECES[colIdx];
    if (((player === 'opponent') && rankIdx === 1) || ((player === 'me' && rankIdx === 6)))
      name = PAWN;
    return name ? new Piece(name, color) : null;
  };

  init() {
    this.board.forEach((b, r) => {
      b.forEach((j, f) => {
        const loc = this.board[r][f];
        loc.piece = this.piece(r, f, 'opponent', OPPONENT_COLOR) || this.piece(r, f, 'me', PLAYER_COLOR) || new Piece();
        loc.color = (r % 2 === f % 2) ? WHITE : BLACK;
        loc.rank = (r - HEIGHT) * -1;
        loc.file = FILES[f];
      });
    });
  }


  static rankIdx(rank) { return ((rank) - HEIGHT) * -1; }
  static fileIdx(file) { return FILES.indexOf(file); }
  static inbounds(r, f) { return (((r >= 0) && (r < HEIGHT)) && ((f >= 0) && (f < WIDTH))); }

  // compare the position of two pieces
  static compare(a, b) {
    if ((a.r * 10) + a.f < (b.r * 10) + b.f) return -1;
    if ((a.r * 10) + a.f > (b.r * 10) + b.f) return 1;
    return 0;
  };

  // return all pieces in a flat array
  flatten() {
    return this.board.reduce((prev, curr) => {
      curr.forEach(f => {
        prev.push(f);
      });
      return prev;
    }, []);
  }

  // find pieces using search criteria
  find(opts) {
    const { name, color } = opts;
    return this.flatten().filter(f => (
      ((typeof (name) === 'undefined') || (f.piece.name === name))
      &&
      ((typeof (color) === 'undefined') || (f.piece.color === color))
      &&
      (f.piece.isSet())
    ));
  }

  static add(moves, m) {
    if (Chess.inbounds(m.r, m.f))
      moves.push(m);
    return moves;
  }

  // mark return checked positions
  check() {
    let checked = [];
    this.find({}).forEach(o => {
      this.getAvailableMoves(o).forEach(m => {
        if (m.piece.name === KING)
          checked.push({checked:m,by:o});
      });
    });
    return checked;
  }

  ascii() {
    const border = '  +--------------------------+\r\n';
    const board = this.board.reduce((prev, curr, idx) => {
      prev += `${Chess.rankIdx(idx)} | `;
      curr.forEach(f => {
        const check = ((f.piece.name === KING) && (this.check().filter(c => (c.checked.rank === f.rank && c.checked.file === f.file)).length > 0)) ? 'X' : '';
        const name = (f.piece.color === OPPONENT_COLOR) ? check.toLowerCase() || f.piece.name.toLowerCase() : check || f.piece.name;
        prev += ` ${name || '.'} `;
      });
      prev += ' | \r\n';
      return prev;
    }, '');
    const files = `     ${FILES.join('  ')}`;
    return `${border}${board}${border}${files}`;
  }

  _get(rank, file) { return this.board[Chess.rankIdx(rank)][Chess.fileIdx(file)]; }

  populated(s) { return (Chess.inbounds(s.r, s.f) && this._get(Chess.rankIdx(s.r), FILES[s.f]).piece.isSet()); }

  getAvailableMoves(square) {
    let piece = square.piece.name;
    let color = square.piece.color;
    let [r, f] = [Chess.rankIdx(square.rank), Chess.fileIdx(square.file)];

    let available = [];

    switch (piece) {
      case PAWN:
        available = this.Move.pawn(r, f, ((color === PLAYER_COLOR) ? 'n' : 's'));
        break;
      case ROOK:
        available = this.Move.straight(r, f);
        break;
      case BISHOP:
        available = this.Move.diag(r, f);
        break;
      case QUEEN:
        available = [...this.Move.straight(r, f), ...this.Move.diag(r, f)];
        break;
      case KING:
        available = [...this.Move.box(r, f), ...this.Move.castle(r, f)];
        break;
      case KNIGHT:
        available = this.Move.L(r, f);
        break;
    }

    let group = available
      // group moves by type
      .reduce((prev, curr) => {
        if (!curr.p) { curr.p = 0; }
        if (!prev[curr.p]) {
          prev[curr.p] = { p: curr.p, m: [] };
        }
        prev[curr.p].m.push({ r: curr.r, f: curr.f });
        return prev;
      }, []);

    available = Object.keys(group).reduce((prev, curr) => {
      // order moves counting away from source
      group[curr].m.sort(Chess.compare);
      for (let m of group[curr].m) {
        if (Chess.compare(m, { r, f }) === -1) {
          group[curr].m.reverse();
          break;
        }
      }
      // add available moves until piece encountered
      for (let m of group[curr].m) {
        let [rank, file] = [Chess.rankIdx(m.r), FILES[m.f]];
        let target = this._get(rank, file);
        // dont add the piece if same color as the source
        if ((color !== target.piece.color) || ([directions.CASTLE_KING, directions.CASTLE_QUEEN].includes(curr)))
          prev.push(target);
        if (target.piece.isSet())
          break;
      }
      return prev;
    }, []);
    return available;
  }

  // return action type and position modifiers
  actionInfo(source, target) {
    let action = actions.MOVE;
    let modifiers = {
      source: { rankIdx: 0, fileIdx: 0 },
      target: { rankIdx: 0, fileIdx: 0 }
    };
    if (target.piece.isSet()) {
      if ((source.piece.color === target.piece.color)
        && (source.piece.name === KING)
        && (target.piece.name === ROOK)) {
        action = actions.CASTLE;
        if (Chess.fileIdx(source.file) > Chess.fileIdx(target.file)) {
          // queen side
          modifiers.source.fileIdx = -2;
          modifiers.target.fileIdx = 3;
        } else {
          // king side
          modifiers.source.fileIdx = 2;
          modifiers.target.fileIdx = -2;
        }
      } else if (target.piece.color === OPPONENT_COLOR) {
        if (target.piece.name === KING)
          action = actions.PLAYER_CAPTURE_KING;
        else
          action = actions.PLAYER_CAPTURE;
      } else {
        action = actions.OPPONENT_CAPTURE;
      }
    }
    return { action, modifiers };
  }

  // move piece at source square to target square
  _move(source, target) {
    const available = this.getAvailableMoves(source);

    if (available.find(a => (((a.rank) === target.rank) && ((a.file) === target.file)))) {
      const { action, modifiers } = this.actionInfo(source, target);
      switch (action) {
        case actions.MOVE:
          break;
        case actions.CASTLE:
          break;
        case actions.PLAYER_CAPTURE_KING:
          break;
        case actions.PLAYER_CAPTURE:
          break;
        case actions.OPPONENT_CAPTURE:
          break;
      }

      if (action === actions.CASTLE) {
        // get new locations
        const kingSquare = this._get(source.rank + modifiers.source.rankIdx, FILES[Chess.fileIdx(source.file) + modifiers.source.fileIdx]);
        const rookSquare = this._get(target.rank + modifiers.target.rankIdx, FILES[Chess.fileIdx(target.file) + modifiers.target.fileIdx]);
        // assign pieces to squares
        kingSquare.piece = this._get(source.rank, source.file).piece;
        rookSquare.piece = this._get(target.rank, target.file).piece;
        kingSquare.piece.moves++;
        rookSquare.piece.moves++;
        target.piece = new Piece();
        source.piece = new Piece();
      } else {
        target.piece = source.piece;
        target.piece.moves++;
        source.piece = new Piece();
      }
    } else {
      throw 'Invalid move';
    }
  }

  static _split(str) {
    const [file, rank] = str.split('');
    return {file, rank};
  }

  // move a piece from location to target
  move(opts) {
    const [from, to] = [Chess._split(opts.from), Chess._split(opts.to)];
    this._move(this._get(from.rank, from.file), this._get(to.rank, to.file));
  }

  // return location info
  get(opts) {
    const {rank,file} = Chess._split(opts.piece)
    return this._get(rank,file);
  }

  // set a piece down at location
  set(opts) {
    const {rank,file} = Chess._split(opts.square);
    this._get(rank, file).piece = opts.piece;
  }
}

if (typeof module !== 'undefined') module.exports = {Chess, Piece};