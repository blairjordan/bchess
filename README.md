# chess.js

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

### set
Arbitrarily set a piece down on the board:

    chess.set({square: 'h4', piece: new Piece('Q')});

### history

Get the current game history.

    chess.history
    
### ascii()

Returns an ascii string of the board.

    chess.ascii()

Example output:

      +--------------------------+
    8 |  .  r  b  q  k  b  n  r  |
    7 |  .  p  p  p  p  p  p  p  |
    6 |  .  .  .  .  .  .  .  .  |
    5 |  .  .  .  .  .  .  .  .  |
    4 |  .  P  P  .  .  .  .  Q  |
    3 |  B  .  N  .  .  .  .  .  |
    2 |  P  .  .  P  P  P  P  P  |
    1 |  .  .  K  R  .  B  N  R  |
      +--------------------------+
         a  b  c  d  e  f  g  h

### score

Get the current game score.
         
    chess.score

### score

Fetch the information at a current square
        
    chess.get({square:'g8'});

TODO:

*(in the order I feel like doing them?)*

- [ ] promote pawn (easy)
- [ ] finish castling rules (prevent castling out of, through, and into check) (medium)
- [ ] en passant (easy-medium)
- [ ] improved algebraic notation (hard)
- [ ] threefold repetition finish (easy)
- [ ] stalemate (easy)
- [ ] insufficient material (easy)
