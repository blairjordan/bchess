const { Chess } = require('./js/chess');

let chess = new Chess();
chess.init();
console.log(chess.ascii());
chess.move('b2','b4');