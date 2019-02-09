const { Chess } = require("./src/js/bchess");

//const chess = new Chess({fen:"4k3/pppppppp/5r2/8/8/R7/PPPPP1PP/R3K2R"});
const chess = new Chess({fen:"4k3/pppppppp/6r1/8/8/R7/PPPPPP1P/R3K2R"});
console.log(chess.ascii());
//chess.move({from:"e1",to:"h1"});
chess.available({square:"e1"});
//chess.available({square:"e8"});
console.log(chess.ascii());