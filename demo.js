const { Chess, Piece } = require('./js/chess');

const chess = new Chess();

// make a bunch of moves
chess.move({from:'g2',to:'g4'});
chess.move({from:'g4',to:'g5'});
chess.move({from:'g1',to:'f3'});
chess.move({from:'f1',to:'h3'});
chess.move({from:'e1',to:'h1'}); // castle
chess.move({from:'f7',to:'f5'});
chess.move({from:'g5',to:'f6'}); // en passant
chess.set({square: 'b5', piece: new Piece('Q','white')}); // set down a new piece
console.log(chess.history); // history
console.log(chess.ascii({unicode:true})); // ascii board
console.log(chess.score);   // game score
console.log(chess.get({square:'g8'})); // get square
console.log(chess.fen()); // fen output
console.log(chess.moves); // total number of moves