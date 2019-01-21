# chess.js

[![Build Status](https://travis-ci.com/blairjordan/chess.js.svg?branch=master)](https://travis-ci.com/blairjordan/chess.js) [![License](https://img.shields.io/badge/license-BSD-lightgrey.svg)](https://opensource.org/licenses/BSD-2-Clause) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/1c77ee10589f47ccbc33c82db9b903ea)](https://www.codacy.com/app/blairjordan/chess.js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=blairjordan/chess.js&amp;utm_campaign=Badge_Grade) [![Codecov Badge](https://codecov.io/gh/blairjordan/chess.js/branch/master/graph/badge.svg)](https://codecov.io/gh/blairjordan/chess.js)

Yet another chess engine.

![](img/screenshot1.png?raw=true)

Simply include the library to start using it:

    const { Chess } = require("./js/chess");
    const chess = new Chess();

## API

### move
Carry out the specified move.

    chess.move({from:"c2",to:"c4"});

A third option is available to specify a the piece used for promotion (if available):

    chess.move({from:"c2",to:"c4",promote:"Q});

### set
Arbitrarily set a piece down on the board:

    chess.set({square: "h4", piece: new Piece("Q","white")});

### history

Get the current game history.

    chess.history
    
### ascii

Returns an ascii string of the board.

    chess.ascii({})

Example output:

      +--------------------------+
    8 |  r  n  b  q  k  b  n  r  |
    7 |  p  p  p  p  p  .  p  p  |
    6 |  .  .  .  .  .  P  .  .  |
    5 |  .  Q  .  .  .  .  .  .  |
    4 |  .  .  .  .  .  .  .  .  |
    3 |  .  .  .  .  .  N  .  B  |
    2 |  P  P  P  P  P  P  .  P  |
    1 |  R  N  B  Q  .  R  K  .  |
      +--------------------------+
         a  b  c  d  e  f  g  h
         
Pass the `unicode` option to replace characters with unicode chess symbols:

    chess.ascii({ unicode:true })

♟  ♜  ♞  ♝  ♛  ♚  ♝  ♞  ♜  ♙  ♖  ♘  ♗  ♕  ♔  ♗  ♘  ♖ 

### score

Get the current game score.

    chess.score

### get

Fetch the information at a current square

    chess.get({square:"g8"});

### fen

Returns the current game state in [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) notation.

    chess.fen()

Example output:

    rnbqkbnr/ppppp1pp/5P2/1Q6/8/5N1B/PPPPPP1P/RNBQ1RK1

You can also initialise a new game using FEN notation:

    const chess = new Chess({fen:"kb5Q/p7/Pp6/1P6/4p3/4R3/4P1p1/6K1"});

### moves

Return the total move count (completed turns)

    chess.moves

### undo

Undo the most recent move

    chess.undo()
