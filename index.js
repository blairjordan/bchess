const { Chess, Piece } = require('./js/chess');

const chess = new Chess();
chess.move({from:'c2',to:'c4'});
chess.move({from:'b2',to:'b4'});
chess.move({from:'c1',to:'a3'});
chess.move({from:'b1',to:'c3'});
chess.move({from:'d1',to:'a4'});
chess.move({from:'e1',to:'a1'}); // castle
console.log(chess.ascii());