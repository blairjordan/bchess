const { Chess, Piece } = require('./js/chess');

const chess = new Chess();

// make a bunch of moves
chess.move({from:'c2',to:'c4'});
chess.move({from:'b2',to:'b4'});
chess.move({from:'c1',to:'a3'});
chess.move({from:'b1',to:'c3'});
chess.move({from:'d1',to:'a4'});
chess.move({from:'e1',to:'a1'}); // castle
chess.move({from:'a4',to:'a7'});
chess.move({from:'a7',to:'b8'});
chess.move({from:'a8',to:'b8'});
chess.set({square: 'h4', piece: new Piece('Q')}); // set down a new piece
console.log(chess.history); // history
console.log(chess.ascii()); // ascii board
console.log(chess.score);   // game score
console.log(chess.get({square:'g8'})); // get square
console.log(chess.fen()); // fen output