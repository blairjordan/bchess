const { Chess } = require("./src/js/bchess");

//const chess = new Chess({fen:"4k3/pppppppp/5r2/8/8/R7/PPPPP1PP/R3K2R"});


const chess = new Chess({fen:"4k3/pppppppp/3r4/8/8/R7/PPP1PPPP/R3K2R"});
console.log(chess.ascii());
//chess.move({from:"e1",to:"h1"});
let available = !chess.available({square:"e1"}).map(s => `${s.file}${s.rank}`).includes("a1");

// need to do check() check on regular king moves

//chess.available({square:"e8"});
console.log(available);

