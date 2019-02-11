const { Chess } = require("./src/js/bchess");

//const chess = new Chess({fen:"4k3/pppppppp/5r2/8/8/R7/PPPPP1PP/R3K2R"});


//let chess = new Chess({fen:"r3k2r/ppppp1pp/8/8/8/5R2/PPPPPPPP/4K3"});
//console.log(chess.available({square:"e8"}).map(s => `${s.file}${s.rank}`));
//available = !chess.available({square:"e8"}).map(s => `${s.file}${s.rank}`).includes("h8");
//const blackOut = !available.includes("a8") && !available.includes("h8");

//console.log(available);

// INTO
chess = new Chess({fen:"k7/8/8/3r4/4K3/8/8/8"});
console.log(chess.ascii());
let available = chess.available({square:"e4"}).map(s => `${s.file}${s.rank}`);
console.log(available);
//chess.move({from:"e1",to:"h1"});
//console.log(chess.available({square:"e8"}).map(s => `${s.file}${s.rank}`));
//let available = !chess.available({square:"e8"}).map(s => `${s.file}${s.rank}`).includes("a1");

// need to do check() check on regular king moves

//chess.available({square:"e8"});
//console.log(available);

