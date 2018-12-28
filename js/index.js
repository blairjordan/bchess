let WIDTH = 8;
let HEIGHT = 8;

const [ROOK, KNIGHT, BISHOP, QUEEN, KING, PAWN] = ['R','N','B','Q','K','P'];
const PIECES = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];
const FILES = ['a','b','c','d','e','f','g','h'];
const [WHITE, BLACK] = ['white','black'];
const [PLAYER_COLOR, OPPONENT_COLOR] = [WHITE, BLACK]
const sounds = 
  {
    MOVE: new Audio('https://res.cloudinary.com/dlfyrrh6y/video/upload/v1545568251/chessmove.wav'),
    CAPTURE1: new Audio('https://res.cloudinary.com/dlfyrrh6y/video/upload/v1545637823/capture1.wav'),
    CAPTURE2: new Audio('https://res.cloudinary.com/dlfyrrh6y/video/upload/v1545637823/capture2.wav'),
    NEW_GAME: new Audio('https://res.cloudinary.com/dlfyrrh6y/video/upload/v1545655985/newgame.wav'),
    CHECK: new Audio('https://res.cloudinary.com/dlfyrrh6y/video/upload/v1545740686/check.wav'),
    WIN: new Audio('https://res.cloudinary.com/dlfyrrh6y/video/upload/v1545740684/success.wav')
  };
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
let moveCount = 0;

const inbounds = (r, f) => ( ( (r >= 0) && (r < HEIGHT) ) && ( (f >= 0) && (f < WIDTH) ) );

const add = (moves, m) => {
	if (inbounds(m.r, m.f))
    moves.push(m);
  return moves;
}

const rankIdx = rank => ((rank)-HEIGHT)*-1;
const fileIdx = file => FILES.indexOf(file);
const getPiece = (rank, file) => board[rankIdx(rank)][fileIdx(file)];

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
};

const populated = s => (inbounds(s.r, s.f) && getPiece(rankIdx(s.r), FILES[s.f]).piece.isSet());

class Move {
  static castle(r, f) {
    let moves = [];
    let [q,k] = [true,true];

    // king has moved?
    if (getPiece(rankIdx(r), FILES[f]).piece.hasMoved())
      [q,k] = [false,false];
    
    // king side
    for (let i = f+1; i < WIDTH-1; i++) {
      if (getPiece(rankIdx(r), FILES[i]).piece.isSet())
        k = false;
    }
    // queen side
    for (let i = f-1; i > 0; i--) {
      if (getPiece(rankIdx(r), FILES[i]).piece.isSet())
        q = false;
    }
  
    // where the rooks should be
    let [krook,qrook] = 
      [
        getPiece(rankIdx(r), FILES[WIDTH-1]),
        getPiece(rankIdx(r), FILES[0])
      ];
    
    // rooks moved?
    if ((krook.piece.name !== ROOK) || (krook.piece.hasMoved()))
      k = false;
    if ((qrook.piece.name !== ROOK) || (qrook.piece.hasMoved()))
      q = false;

    if (k)
      add(moves, {r,f:WIDTH-1, p:directions.CASTLE_KING});
    if (q)
      add(moves, {r,f:0, p:directions.CASTLE_QUEEN});

    return moves;
  }

  static pawn(r, f, d) {
    let moves = [];
    const op = (d === 'n') ? '-' : '+';
    const first = ((d === 'n' && r === HEIGHT-2) || (d === 's' && r === 1));
    
    const left = {r:eval(`r${op}1`),f:f-1,p:directions.LEFT};
    const right = {r:eval(`r${op}1`),f:f+1,p:directions.RIGHT};
    const front1 = {r:eval(`r${op}1`),f:f,p:`${directions.UP}1`};
    const front2 = {r:eval(`r${op}2`),f:f,p:`${directions.UP}2`};
    
    if (populated(left)) { add(moves,left); }
    if (populated(right)) { add(moves,right); }
    if (!populated(front1)) {
      add(moves,front1);
      if (first && !populated(front2))
        add(moves,front2);
    }
    return moves;
  }

  static diag(r, f) {
    let moves = [];
    for (let i = 1; i <= HEIGHT-1; i++) {
      add(moves,{r:r-i,f:f-i,p:directions.UP_LEFT});
      add(moves,{r:r-i,f:f+i,p:directions.UP_RIGHT});
      add(moves,{r:r+i,f:f+i,p:directions.DOWN_RIGHT});
      add(moves,{r:r+i,f:f-i,p:directions.DOWN_LEFT});
    }
    return moves;
  }

  static straight(r, f) {
    let moves = [];
    for (let i = 0; i <= Math.floor((f/WIDTH)*WIDTH)-1; i++) {
      add(moves,{r,f:i,p:directions.LEFT}); 
    }
    for (let i = WIDTH-1; i > f; i--) {
      add(moves,{r,f:i,p:directions.RIGHT}); 
    }
    for (let i = 0; i <= Math.floor((r/HEIGHT)*HEIGHT)-1; i++) {
      add(moves,{r:i,f,p:directions.UP});
    }
    for (let i = HEIGHT-1; i > r; i--) {
      add(moves,{r:i,f,p:directions.DOWN});
    }
    return moves;
  }

	static box(r, f) {
    let moves = [];
    add(moves,{r:r-1,f,p:directions.UP});
    add(moves,{r:r+1,f,p:directions.DOWN});
    add(moves,{r,f:f-1,p:directions.LEFT});
    add(moves,{r,f:f+1,p:directions.RIGHT});
    add(moves,{r:r-1,f:f-1,p:directions.UP_LEFT});
    add(moves,{r:r-1,f:f+1,p:directions.UP_RIGHT});
    add(moves,{r:r+1,f:f-1,p:directions.DOWN_LEFT});
    add(moves,{r:r+1,f:f+1,p:directions.DOWN_RIGHT});
    return moves;
	}

	static L(r, f) {
    let moves = [],
        l = 0;
    add(moves,{r:r-2,f:f-1,p:`${directions.L}${++l}`});
    add(moves,{r:r-2,f:f+1,p:`${directions.L}${++l}`});
    add(moves,{r:r+2,f:f-1,p:`${directions.L}${++l}`});
    add(moves,{r:r+2,f:f+1,p:`${directions.L}${++l}`});
    add(moves,{r:r-1,f:f-2,p:`${directions.L}${++l}`});
    add(moves,{r:r-1,f:f+2,p:`${directions.L}${++l}`});
    add(moves,{r:r+1,f:f-2,p:`${directions.L}${++l}`});
    add(moves,{r:r+1,f:f+2,p:`${directions.L}${++l}`});
    return moves;
	}
}

const board = new Array(HEIGHT).fill().map(
  () => new Array(WIDTH).fill().map(
    () => new (function(){ 
      this.piece = new Piece();
      this.rank = '';
      this.file = '';
    })()
  )
);

const piece = (rankIdx, colIdx, player, color) => {
    let name = '';
    if (((player === 'opponent') && rankIdx === 0) || ((player === 'me' && rankIdx === 7)))
      name = PIECES[colIdx];
    if (((player === 'opponent') && rankIdx === 1) || ((player === 'me' && rankIdx === 6)))
      name = PAWN;
    return name ? new Piece(name, color) : null;
};

const init = () => {
  board.forEach((b,r) => {
    let rank = '';
    b.forEach((j,f)=> {
      const loc = board[r][f];
      loc.piece = piece(r,f,'opponent', OPPONENT_COLOR) || piece(r,f,'me', PLAYER_COLOR) || new Piece();
      loc.color = (r%2===f%2) ? WHITE : BLACK;
      loc.rank = (r-HEIGHT)*-1;
      loc.file = FILES[f];
      rank += `<div class="${loc.color} square" data-rank="${loc.rank}" data-file="${loc.file}"><div class="${loc.piece.getClass()}" /></div>`;
    });
    canvas.append(`<div class="rank">${rank}</div>`);
  });
}

let canvas = $('.canvas');
init();
let source = null;

const compare = (a,b) => {
  if ((a.r*10)+a.f < (b.r*10)+b.f) return -1;
  if ((a.r*10)+a.f > (b.r*10)+b.f) return 1;
  return 0;
};

const getAvailableMoves = square => {
  let piece = square.piece.name;
  let color = square.piece.color;
  let [r,f] = [rankIdx(square.rank), fileIdx(square.file)];
  
  let available = [];
  
  switch (piece) {
    case PAWN:
      available = Move.pawn(r, f, ((color === PLAYER_COLOR) ? 'n' : 's'));
      break;
    case ROOK:
      available = Move.straight(r, f);
      break;
    case BISHOP:
      available = Move.diag(r,f);
      break;
    case QUEEN:
      available = [...Move.straight(r, f), ...Move.diag(r,f)];
      break;
    case KING:
      available = [...Move.box(r,f), ...Move.castle(r,f)];
      break;
    case KNIGHT:
      available = Move.L(r,f);
      break;
  }
  
  let group = available
  // group moves by type
  .reduce((prev, curr) => {
    if (!curr.p) { curr.p = 0; }
    if (!prev[curr.p]) {
      prev[curr.p] = {p: curr.p, m: []};
    }
    prev[curr.p].m.push({r: curr.r, f: curr.f});
    return prev;
  }, []);
  
  available = Object.keys(group).reduce((prev, curr) => {
    // order groups counting away from source
    group[curr].m.sort(compare);
    for (let m of group[curr].m) {
      if (compare(m,{r,f}) === -1) {
        group[curr].m.reverse();
        break;
      }
    }
    // add available moves until piece encountered
    for (let m of group[curr].m) {
      let [rank, file] = [rankIdx(m.r), FILES[m.f]];
      let target = getPiece(rank, file);
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

// return all pieces in an array
const flatten = () => 
  board.reduce((prev, curr) => {
    curr.forEach(f => {
      prev.push(f);
    });
    return prev;
  }, []);

// find pieces using search criteria
const find = opts => {
  const { name, color } = opts;
  return flatten().filter(f => 
    (
      ((typeof(name) === 'undefined') || (f.piece.name === name))
      &&
      ((typeof(color) === 'undefined') || (f.piece.color === color))
      &&
      (f.piece.isSet())
    )
  );
}

// mark checked kings
const check = () => {
  $('.square').removeClass('checked');
  find({}).forEach(o => {
    getAvailableMoves(o).forEach(m => {
      if (m.piece.name === KING)
        $(`*.square[data-rank="${m.rank}"][data-file="${m.file}"]`).addClass('checked');
    })
  });
};

// return action type and position modifiers
const actionInfo = (source, target) => {
  let action = actions.MOVE;
  let modifiers = {source: {rankIdx:0, fileIdx:0}, 
                   target: {rankIdx:0, fileIdx:0}};
  if (target.piece.isSet()) {
    if ((source.piece.color === target.piece.color) 
     && (source.piece.name === KING) && (target.piece.name === ROOK)) { 
      action = actions.CASTLE;
        if (fileIdx(source.file) > fileIdx(target.file)) {
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
  return {action, modifiers};
}

const movePiece = (source, target) => {
  const available = getAvailableMoves(source);
  
  if (available.find(a => (((a.rank) === target.rank) && ((a.file) === target.file)))) {
    const {action, modifiers} = actionInfo(source,target);
    switch (action) {
      case actions.MOVE:        
        sounds.MOVE.play();
        break;
      case actions.CASTLE:
        break;
      case actions.PLAYER_CAPTURE_KING:
        sounds.WIN.play();
        $('.score .player').append(`<div class="${target.piece.getClass()}" />`);
        break;
      case actions.PLAYER_CAPTURE:
        sounds.CAPTURE1.play();
        $('.score .player').append(`<div class="${target.piece.getClass()}" />`);
        break;
      case actions.OPPONENT_CAPTURE:
        $('.score .opponent').append(`<div class="${target.piece.getClass()}" />`);
        sounds.CAPTURE2.play();
        break;
    }
    // todo: move scoring above somewhere else
      
    if ((action === actions.MOVE)
     || (action === actions.PLAYER_CAPTURE) 
     || (action === actions.OPPONENT_CAPTURE) 
     || (action === actions.PLAYER_CAPTURE_KING))
      record(source, target);
      
    // empty source/ target
    const sourceElem = $(`*.square[data-rank="${source.rank}"][data-file="${source.file}"]`);
    const targetElem = $(`*.square[data-rank="${target.rank}"][data-file="${target.file}"]`);
    sourceElem.empty();
    targetElem.empty();
    
    if (action === actions.CASTLE) {
      // get new locations
      const kingSquare = getPiece(source.rank+modifiers.source.rankIdx, FILES[fileIdx(source.file)+modifiers.source.fileIdx]);
      const rookSquare = getPiece(target.rank+modifiers.target.rankIdx, FILES[fileIdx(target.file)+modifiers.target.fileIdx]);
      // assign pieces to squares
      kingSquare.piece = getPiece(source.rank, source.file).piece;
      rookSquare.piece = getPiece(target.rank, target.file).piece;
      // add piece markup to new location
      $(`*.square[data-rank="${kingSquare.rank}"][data-file="${kingSquare.file}"]`).append(`<div class="${kingSquare.piece.getClass()}" /></div>`);
      $(`*.square[data-rank="${rookSquare.rank}"][data-file="${rookSquare.file}"]`).append(`<div class="${rookSquare.piece.getClass()}" /></div>`);
      kingSquare.piece.moves++;
      rookSquare.piece.moves++;
      target.piece = new Piece();
      source.piece = new Piece();
    } else {
      targetElem.append(`<div class="${source.piece.getClass()}" /></div>`);
      target.piece = source.piece;
      target.piece.moves++;
      source.piece = new Piece();
    }
    check();
  }
};

// very simplified, might expand into SAN eventually
const record = (source, destination) => {
  const [name, color] = [source.piece.name, source.piece.color];
  const countDisplay = (color === PLAYER_COLOR) ? `${++moveCount}. ` : '';
  let sourceNotation = (name !== PAWN || (source.file !== destination.file)) ? `${name}${source.file}${source.rank}` : '';
  $(`.record.${color}`).append(`<div>${countDisplay}${sourceNotation}${destination.file}${destination.rank}</div>`);
}

$('#reset').on('click', function() {
  $('.canvas').empty();
  $('.record').empty();
  $('.score .opponent, .score .player').empty();
  init();
  moveCount = 0;
  sounds.NEW_GAME.play();
});
                
$(document).on('click', '.square', function() {
  const rank = $(this).data('rank');
  const file = $(this).data('file');
  const clicked = getPiece(rank,file);
  const available = getAvailableMoves(clicked);
  const elem = $(`*.square[data-rank="${rank}"][data-file="${file}"]`);
  
  $('.square').removeClass('selected');
  if (source === null) {
	  if (!clicked.piece.isSet())
		  return;
    source = clicked;
    elem.addClass('selected');
    $('.square').removeClass('available');
    available.forEach(a => $(`*.square[data-rank="${a.rank}"][data-file="${a.file}"]`).addClass('available') );
  } else {
    let destination = clicked;
    $('.square').removeClass('available');
    
    if ((source.rank === destination.rank) && (source.file === destination.file)) {
      source = null;
      return;
    }
    movePiece(source, destination);
    source = null;
  }
});