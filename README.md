# bchess

[![Build Status](https://travis-ci.com/blairjordan/bchess.svg?branch=master)](https://travis-ci.com/blairjordan/bchess) [![License](https://img.shields.io/github/license/blairjordan/bchess.svg)](https://opensource.org/licenses/MIT) [![Codecov Badge](https://codecov.io/gh/blairjordan/bchess/branch/master/graph/badge.svg)](https://codecov.io/gh/blairjordan/bchess) [![jsDelivr badge](https://data.jsdelivr.com/v1/package/npm/bchess/badge?style=rounded)](https://www.jsdelivr.com/package/npm/bchess) [![Heroku Badge](https://img.shields.io/badge/heroku-deployed-brightgreen.svg)](https://bchess.herokuapp.com/) [![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/blairjordan/bchess) [![Try bchess on RunKit](https://badge.runkitcdn.com/bchess.svg)](https://npm.runkit.com/bchess)

![](img/bchess-logo.png?raw=true)

A chess engine written in modern javascript with a minimal codebase.

## Getting Started

### Node

    npm i bchess

### CDN

    <script src="https://cdn.jsdelivr.net/npm/bchess@1/dist/bchess.min.js"></script>

## Usage

Simply include the library to start using it:

    const { Chess, Action, Piece } = require("bchess");
    const chess = new Chess({color: "white"});

You can also initialise a new game using FEN notation:

    const chess = new Chess({fen:"kb5Q/p7/Pp6/1P6/4p3/4R3/4P1p1/6K1"});

## API

### move
Carry out the specified move

    chess.move({from:"c2",to:"c4"});

A third option is available to specify the piece used for promotion (if available):

    chess.move({from:"c2",to:"c4",promote:"Q"});

#### Returns

One or more **Action** flags.

The following is a list of possible flags:
 - MOVE
 - PLAYER_CAPTURE
 - OPPONENT_CAPTURE
 - CASTLE_KING
 - CASTLE_QUEEN
 - EN_PASSANT
 - PROMOTE
 - INVALID_ACTION

### set
Set a piece down anywhere on the board:

    chess.set({square: "h4", piece: new Piece("Q","white")});

### available
Return an array of available moves a piece can make

    chess.available({square:"e2"})

### history

Get the current game history

    chess.history
    
### ascii

Returns an ascii string representing the current board

    chess.ascii()

Example output:

      +--------------------------+
    8 |  r  n  b  q  k  b  n  r  |
    7 |  p  p  p  p  p  .  p  p  |
    6 |  .  .  .  .  .  P  .  .  |
    5 |  .  .  .  .  .  .  .  .  |
    4 |  .  .  .  .  .  .  .  .  |
    3 |  .  .  .  .  .  N  .  B  |
    2 |  P  P  P  P  P  P  .  P  |
    1 |  R  N  B  Q  .  R  K  .  |
      +--------------------------+
         a  b  c  d  e  f  g  h

*The perspective of the board returned depends on the Chess `myColor` property.*

#### Options

|Property|Description|Values|Default|
|--|--|--|--|
|border|Toggle border display|true / false|true|
|file|Toggle file display|true / false|true|
|rank|Toggle rank display|true / false|true|
|unicode|Display [unicode characters](https://en.wikipedia.org/wiki/Chess_symbols_in_Unicode) for pieces instead of FEN notation|true / false|false|

### score

Get the current game score

    chess.score()

### get

Fetch the information at a current square

    chess.get({square:"g8"})

### fen

Returns the current game state in [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) notation.

    chess.fen()

Example output:

    rnbqkbnr/ppppp1pp/5P2/1Q6/8/5N1B/PPPPPP1P/RNBQ1RK1

### moves

Return the total move count (completed turns)

    chess.moves

### undo

Undo the most recent move

    chess.undo();

### turn

Whose turn is it?

    chess.turn()

### check

Returns pieces in check (and pieces checking them)

    chess.check()

### checkmate

Returns checkmate status for both sides

    chess.checkmate()

### stalemate

Returns stalemate status for both sides

    chess.stalemate()

### moveToSAN

Return the [SAN](https://en.wikipedia.org/wiki/Algebraic_notation_(chess)) notation of a move

    chess.moveToSAN({from:"f2",to:"f4"})
