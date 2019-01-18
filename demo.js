const { Chess, Piece } = require("./js/chess");

const chess = new Chess({});

// make a bunch of moves
chess.move({from:"g2",to:"g4"});
chess.move({from:"f1",to:"h3"});
chess.move({from:"g1",to:"f3"});
chess.move({from:"e1",to:"h1"}); // castle

console.log(chess.ascii({unicode:true})); // ascii board