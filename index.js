const { Chess, Piece } = require('./js/chess');

const chess = new Chess();
chess.init();
chess.move({from:'f2',to:'f4'});
chess.move({from:'c7',to:'c5'});
console.log(chess.ascii());
console.log(chess.get({piece:'d1'}));
chess.set({square:'a6', piece: new Piece('K','white')});
console.log(chess.ascii());
console.log(chess.check());