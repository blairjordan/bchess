const WIDTH = 8;
const HEIGHT = 8;

const [ROOK, KNIGHT, BISHOP, QUEEN, KING, PAWN] = ['R', 'N', 'B', 'Q', 'K', 'P'];
const PIECES = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const [WHITE, BLACK] = ['white', 'black'];
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
  MOVE: 'MOVE',
  PLAYER_CAPTURE: 'CAPTURE',
  PLAYER_CAPTURE_KING: 'PLAYER_CAPTURE_KING',
  OPPONENT_CAPTURE: 'OPPONENT_CAPTURE',
  OPPONENT_CAPTURE_KING: 'OPPONENT_CAPTURE_KING',
  CASTLE: 'CASTLE',
  EN_PASSANT: 'EN_PASSANT',
  INVALID_ACTION: 'INVALID_ACTION'
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

    // right side
    for (let i = f + 1; i < WIDTH - 1; i++) {
      if (this.chess._get(Chess.rankIdx(r), FILES[i]).piece.isSet())
        k = false;
    }
    // left side
    for (let i = f - 1; i > 0; i--) {
      if (this.chess._get(Chess.rankIdx(r), FILES[i]).piece.isSet())
        q = false;
    }

    // where the rooks should be
    let [rrook, lrook] =
      [
        this.chess._get(Chess.rankIdx(r), FILES[WIDTH - 1]),
        this.chess._get(Chess.rankIdx(r), FILES[0])
      ];

    // rooks moved?
    if ((rrook.piece.name !== ROOK) || (rrook.piece.hasMoved()))
      k = false;
    if ((lrook.piece.name !== ROOK) || (lrook.piece.hasMoved()))
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
  constructor(color) {
    this.Moves = new Move(this);
    [this.my_color, this.their_color] = (color === BLACK) ? [BLACK, WHITE] : [WHITE, BLACK];
    this.history = [];
    this.score = {me: [], them: []};
    this.init();
    this.fill();
  }

  init() {
    this.board = 
      new Array(HEIGHT).fill().map(
      () => new Array(WIDTH).fill().map(
        () => new (function () {
          this.piece = new Piece();
          this.rank = '';
          this.file = '';
        })()
      )
    );
  }

  piece(rankIdx, colIdx, color) {
    let name = '';
    if (((color === this.their_color) && rankIdx === 0) || (((color === this.my_color) && rankIdx === 7)))
      name = PIECES[colIdx];
    if (((color === this.their_color) && rankIdx === 1) || (((color === this.my_color) && rankIdx === 6)))
      name = PAWN;
    return name ? new Piece(name, color) : null;
  };

  fill() {
    this.board.forEach((b, r) => {
      b.forEach((j, f) => {
        const loc = this.board[r][f];
        loc.piece = this.piece(r, f, this.their_color) || this.piece(r, f, this.my_color) || new Piece();
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

  // return checked positions
  check(opts = {}) {
    let checked = [];
    this.find(opts).forEach(o => {
      this._available(o).forEach(m => {
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
        const name = (f.piece.color === this.their_color) ? check.toLowerCase() || f.piece.name.toLowerCase() : check || f.piece.name;
        prev += ` ${name || '.'} `;
      });
      prev += ' | \r\n';
      return prev;
    }, '');
    const files = `     ${FILES.join('  ')}`;
    return `${border}${board}${border}${files}`;
  }

  _log(opts) {
    const {source, target, action} = opts;
    const [from, to] = [{rank: source.rank, file: source.file},
                        {rank: target.rank, file: target.file}];
    const captured = ([actions.PLAYER_CAPTURE,
                       actions.PLAYER_CAPTURE_KING,
                       actions.OPPONENT_CAPTURE,
                       actions.OPPONENT_CAPTURE_KING]
      .includes(action)) ? target.piece : null;
    this.history.push({from, to, piece: source.piece, captured, action});
  }

  _score(opts) {
    if (opts.piece.color === this.their_color)
      this.score.me.push(opts.piece);
    else
      this.score.them.push(opts.piece);
  }

  _get(rank, file) { return this.board[Chess.rankIdx(rank)][Chess.fileIdx(file)]; }

  populated(s) { return (Chess.inbounds(s.r, s.f) && this._get(Chess.rankIdx(s.r), FILES[s.f]).piece.isSet()); }

  _available(square) {
    let piece = square.piece.name;
    let color = square.piece.color;
    let [r, f] = [Chess.rankIdx(square.rank), Chess.fileIdx(square.file)];

    let available = [];

    switch (piece) {
      case PAWN:
        available = this.Moves.pawn(r, f, ((color === this.my_color) ? 'n' : 's'));
        break;
      case ROOK:
        available = this.Moves.straight(r, f);
        break;
      case BISHOP:
        available = this.Moves.diag(r, f);
        break;
      case QUEEN:
        available = [...this.Moves.straight(r, f), ...this.Moves.diag(r, f)];
        break;
      case KING:
        available = [...this.Moves.box(r, f), ...this.Moves.castle(r, f)];
        break;
      case KNIGHT:
        available = this.Moves.L(r, f);
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
        if ((Chess.fileIdx(source.file) > Chess.fileIdx(target.file) && this.my_color === WHITE)) {
          // queen side
          modifiers.source.fileIdx = -2;
          modifiers.target.fileIdx = 3;
        } else {
          // king side
          modifiers.source.fileIdx = 2;
          modifiers.target.fileIdx = -2;
        }
      } else { 
        this._score({piece: target.piece});
        if (target.piece.color === this.their_color) {
          if (target.piece.name === KING)
            action = actions.PLAYER_CAPTURE_KING;
          else
            action = actions.PLAYER_CAPTURE;
        } else {
          if (target.piece.name === KING)
            action = actions.OPPONENT_CAPTURE_KING;
          else
            action = actions.OPPONENT_CAPTURE;
        }
      }
    }
    return { action, modifiers };
  }

  // move piece at source square to target square
  _move(source, target) {
    const available = this._available(source);
    if (available.find(a => (((a.rank) === target.rank) && ((a.file) === target.file)))) {
      const { action, modifiers } = this.actionInfo(source, target);
      this._log({source,target,action});
      if (action === actions.CASTLE) {
        // get new locations
        const kingSquare = this._get(source.rank + modifiers.source.rankIdx, FILES[Chess.fileIdx(source.file) + modifiers.source.fileIdx]);
        const rookSquare = this._get(target.rank + modifiers.target.rankIdx, FILES[Chess.fileIdx(target.file) + modifiers.target.fileIdx]);
        // assign pieces to squares
        kingSquare.piece = source.piece;
        rookSquare.piece = target.piece;
        kingSquare.piece.moves++;
        rookSquare.piece.moves++;
        target.piece = new Piece();
      } else {
        target.piece = source.piece;
        target.piece.moves++;
      }
      source.piece = new Piece();
      return action;

    } else {
      return actions.INVALID_ACTION;
    }
  }

  static _split(str) {
    const [file, rank] = str.split('');
    return {file, rank};
  }
  
  // display board when playing as black
  reverse() {
    let reversed = [...this.board].reverse();
    reversed.forEach((r,idx) => { 
      let rank = [...r].reverse(); 
      reversed[idx] = rank;
    });
    return reversed;
  };

  // move a piece from location to target
  move(opts) {
    const [from, to] = [Chess._split(opts.from), Chess._split(opts.to)];
    this._move(this._get(from.rank, from.file), this._get(to.rank, to.file));
  }

  // return location info
  get(opts) {
    const {rank,file} = Chess._split(opts.square)
    return this._get(rank,file);
  }

  // return available moves for a specified location
  available(opts) {
    const {rank,file} = Chess._split(opts.square);
    return this._available(this._get(rank, file));
  }

  // set a piece down at location
  set(opts) {
    const {rank,file} = Chess._split(opts.square);
    this._get(rank, file).piece = opts.piece;
  }
}

if (typeof module !== 'undefined') module.exports = {Chess, Piece};