/*
Copyright (c) 2019, B. Jordan <blair.j.jordan@gmail.com>

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
*/

const WIDTH = 8;
const HEIGHT = 8;

const [ROOK, KNIGHT, BISHOP, QUEEN, KING, PAWN] = ['R', 'N', 'B', 'Q', 'K', 'P'];
const FIRST_RANK = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];
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
  MOVE: 1,
  PLAYER_CAPTURE: 2,
  PLAYER_CAPTURE_KING: 4,
  OPPONENT_CAPTURE: 8,
  OPPONENT_CAPTURE_KING: 16,
  CASTLE: 32,
  EN_PASSANT: 64,
  PROMOTE: 128,
  INVALID_ACTION: 256
}
const UNICODE =
{
  P: { black: String.fromCodePoint(0x265F), white: String.fromCodePoint(0x2659) },
  R: { black: String.fromCodePoint(0x265C), white: String.fromCodePoint(0x2656) }, 
  N: { black: String.fromCodePoint(0x265E), white: String.fromCodePoint(0x2658) }, 
  B: { black: String.fromCodePoint(0x265D), white: String.fromCodePoint(0x2657) }, 
  Q: { black: String.fromCodePoint(0x265B), white: String.fromCodePoint(0x2655) },  
  K: { black: String.fromCodePoint(0x265A), white: String.fromCodePoint(0x2654) }
};

class Piece {
  constructor(name, color, moves) {
    this.name = name || '';
    this.color = color || '';
    this.moves = moves || 0;
    this.isPromoted = false;
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

  pawn(r, f, c) {
    let moves = [];
    const op = (c === WHITE) ? '-' : '+';
    const first = ((c === WHITE && r === HEIGHT - 2) || (c === BLACK && r === 1));

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

  en_passant(r, f, c) {
    let moves = [];
    const op = (c === WHITE) ? '-' : '+';

    if (this.chess.history.length === 0)
      return [];

    // check current rank
    if (!((c === WHITE && r === 3) || (c === BLACK && r === HEIGHT-4)))
      return [];

    const left = { r, f: f - 1, p: directions.LEFT };
    const right = { r, f: f + 1, p: directions.RIGHT };
    const upLeft = { r: eval(`r${op}1`), f: f - 1, p: directions.UP_LEFT };
    const upLight = { r: eval(`r${op}1`), f: f + 1, p: directions.UP_RIGHT };
    const latestMove = this.chess.history[this.chess.history.length - 1];

    // latest move was opponent moving a pawn
    if (latestMove.piece.name !== PAWN || latestMove.piece.color === c)
      return [];

    const [latestMoveFromRankIdx, latestMoveFromFileIdx] = [Chess.rankIdx(latestMove.from.rank), FILES.indexOf(latestMove.from.file)];
    const [latestMoveToRankIdx, latestMoveToFileIdx] = [Chess.rankIdx(latestMove.to.rank), FILES.indexOf(latestMove.to.file)];

    if ((latestMoveFromFileIdx !== latestMoveToFileIdx) // moved straight ahead
      || (latestMoveFromRankIdx !== eval(`latestMoveToRankIdx${op}2`))) // moved two squares
      return [];

    if (latestMoveToFileIdx === left.f)
      Chess.add(moves, upLeft);
    if (latestMoveToFileIdx === right.f)
      Chess.add(moves, upLight);
    
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
    for (let i = f - 1; i >= 0 ; i--) {
      Chess.add(moves, { r, f: i, p: directions.LEFT });
    }
    for (let i = f+1; i <= WIDTH - 1; i++) {
      Chess.add(moves, { r, f: i, p: directions.RIGHT });
    }
    for (let i = r-1; i >= 0; i--) {
      Chess.add(moves, { r: i, f, p: directions.UP });
    }
    for (let i = r+1; i <= HEIGHT-1; i++) {
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
    this.score = {white: [], black: []};
    this.init();
    this.fill();
    this.moves = 0;
  }

  board() {
    return (this.my_color === BLACK) ? this.reverse() : this._board
  }

  init() {
    this._board = 
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
    if (((color === BLACK) && rankIdx === 0) || (((color === WHITE) && rankIdx === 7)))
      name = FIRST_RANK[colIdx];
    if (((color === BLACK) && rankIdx === 1) || (((color === WHITE) && rankIdx === 6)))
      name = PAWN;
    return name ? new Piece(name, color) : null;
  };

  fill() {
    this._board.forEach((b, r) => {
      b.forEach((j, f) => {
        const loc = this._board[r][f];
        loc.piece = this.piece(r, f, WHITE) || this.piece(r, f, BLACK) || new Piece();
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
    return this._board.reduce((prev, curr) => {
      curr.forEach(f => {
        prev.push(f);
      });
      return prev;
    }, []);
  }

  // find pieces using search criteria or all pieces
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

  fen() {
    return this.board().reduce((prev, curr, idx) => {
      let rank = '';
      let blanks = 0;
      curr.forEach((f,i) => {
        if (!f.piece.isSet())
          blanks++;
        else
          blanks = 0;
        rank += `${(blanks && ((i === WIDTH-1) || curr[i+1].piece.isSet())) ? blanks : ''}${(f.piece.color === BLACK) ? f.piece.name.toLowerCase() : f.piece.name}`;
      });
      prev.push(rank);
      return prev;
    }, [])
    .join('/');
  }

  ascii(opts) {
    const { unicode } = opts;
    const border = '  +--------------------------+\r\n';
    const files = `     ${(this.my_color === WHITE) ? FILES.join('  ') : FILES.slice().reverse().join('  ')}`;
    const board = this.board().reduce((prev, curr, idx) => {
      prev += `${(this.my_color === WHITE) ? Chess.rankIdx(idx) : idx+1 } | `;
      curr.forEach(f => {
        const symbol = (unicode && f.piece.isSet()) ? `${UNICODE[f.piece.name][f.piece.color]}` : f.piece.name;
        prev += ` ${(f.piece.color === BLACK) ? symbol.toLowerCase() : symbol || '.'} `;
      });
      return prev += ' | \r\n';
    }, '');
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
    this.score[opts.piece.color].push(opts.piece);
  }

  _get(rank, file) { return this._board[Chess.rankIdx(rank)][Chess.fileIdx(file)]; }

  populated(s) { return (Chess.inbounds(s.r, s.f) && this._get(Chess.rankIdx(s.r), FILES[s.f]).piece.isSet()); }

  _available(square) {
    let piece = square.piece.name;
    let color = square.piece.color;
    let [r, f] = [Chess.rankIdx(square.rank), Chess.fileIdx(square.file)];

    let available = [];

    switch (piece) {
      case PAWN:
        available = [...this.Moves.pawn(r, f, color), ...this.Moves.en_passant(r, f, color)];
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
  _action(source, target) {
    let action = actions.MOVE;
    let modifiers = {
      source: { rankIdx: 0, fileIdx: 0 },
      target: { rankIdx: 0, fileIdx: 0 }
    };
    let capture = null;
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
    } else if (source.piece.name === PAWN && Chess.fileIdx(source.file) !== Chess.fileIdx(target.file)) {
      // moved diagonal into an empty square, en passant
      action = actions.EN_PASSANT;
      const c = this._get(target.rank+((source.piece.color === WHITE) ? -1 : 1), target.file);
      this._score({piece: c.piece});
      capture = c;
    }

    // check pawn promotion
    if ( source.piece.name === PAWN &&  
          (target.rank === 8 && source.piece.color === WHITE)
        || (target.rank === 1 && source.piece.color === BLACK) )
      action |= actions.PROMOTE;
    return { action, modifiers, capture };
  }

  // move piece at source square to target square
  _move(source, target, promote = null) {
    const available = this._available(source);
    if (available.find(a => (((a.rank) === target.rank) && ((a.file) === target.file)))) {
      const { action, modifiers, capture } = this._action(source, target);
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
        if (action === actions.EN_PASSANT) {
          capture.piece = new Piece();
        }
        if ((action & actions.PROMOTE) === actions.PROMOTE) {
          source.piece.name = ([QUEEN,KNIGHT,ROOK,BISHOP].includes(promote)) ? promote : QUEEN;
          source.piece.isPromoted = true;
        }
        target.piece = source.piece;
        target.piece.moves++;
      }
      source.piece = new Piece();
      this.moves++;
      return action;
    } else {
      return actions.INVALID_ACTION;
    }
  }

  static _split(str) {
    const [file, rank] = str.split('');
    return {file, rank};
  }
  
  // display board from black perspective
  reverse() {
    let reversed = [...this._board].reverse();
    reversed.forEach((r,idx) => { 
      let rank = [...r].reverse(); 
      reversed[idx] = rank;
    });
    return reversed;
  };

  // move a piece from location to target
  move(opts) {
    const [from, to] = [Chess._split(opts.from), Chess._split(opts.to)];
    return this._move(this._get(from.rank, from.file), this._get(to.rank, to.file), opts.promote);
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