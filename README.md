# chess.js
[![Build Status](https://travis-ci.com/blairjordan/chess.js.svg?branch=master)](https://travis-ci.com/blairjordan/chess.js) [![License](https://img.shields.io/badge/license-BSD-lightgrey.svg)](https://opensource.org/licenses/BSD-2-Clause)

Yet another chess engine.

This originally started off as a Codepen and grew into a more complete chess engine as I got a little carried away.

![](img/screenshot1.png?raw=true)

Simply include the library to start using it:

    const { Chess } = require('./js/chess');
    const chess = new Chess();

## API

### move
Carry out the specified move.

    chess.move({from:'c2',to:'c4'});

A third option is available to specify a the piece used for promotion (if available):

    chess.move({from:'c2',to:'c4',promote:'Q});

### set
Arbitrarily set a piece down on the board:

    chess.set({square: 'h4', piece: new Piece('Q','white')});

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

    chess.get({square:'g8'});

### get

Fetch the information at a current square

    chess.get({square:'g8'});

### fen

Returns the board in [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) notation.

    chess.fen()

Example output:

    rnbqkbnr/ppppp1pp/5P2/1Q6/8/5N1B/PPPPPP1P/RNBQ1RK1

### moves

Return the total move counts (completed turns)

    chess.moves

TODO:

*(in the order I feel like doing them?)*

- [ ] turn tracking (easy)
- [ ] finish castling rules (prevent castling out of, through, and into check) (medium)
- [ ] improved algebraic notation (hard)
- [ ] threefold repetition finish (medium)
- [ ] stalemate (easy)
- [ ] insufficient material (easy)
- [ ] 50 move rule
