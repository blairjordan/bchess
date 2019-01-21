const assert = require("assert");
const { Chess, Piece, Action } = require("../js/chess");

describe("Game tests", () => {

  it("Get total number of moves", (done) => {
    try {
      const chess = new Chess({});
      chess.move({from:"g2",to:"g4"});
      chess.move({from:"g4",to:"g5"});
      chess.move({from:"g1",to:"f3"});
      assert(chess.moves === 3);
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Get FEN notation", (done) => {
    try {
      const chess = new Chess({});
      chess.move({from:"g2",to:"g4"});
      chess.move({from:"g7",to:"g5"});
      chess.move({from:"g1",to:"f3"});
      chess.move({from:"f7",to:"f5"});
      chess.move({from:"f1",to:"h3"});
      chess.move({from:"b8",to:"c6"});
      assert(chess.fen() === "r1bqkbnr/ppppp2p/2n5/5pp1/6P1/5N1B/PPPPPP1P/RNBQK2R");
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Returns game history", (done) => {
    try {
      const chess = new Chess({});
      chess.move({from:"f2",to:"f4"});
      chess.move({from:"a7",to:"a5"});
      chess.move({from:"b2",to:"b4"});
      chess.move({from:"h7",to:"h5"});
      chess.move({from:"b1",to:"a3"});
      chess.move({from:"g8",to:"h6"});
      assert(
        (chess.history.filter(h => h.piece.color === "white").length === 3)
        && (chess.history.filter(h => h.piece.color === "black").length === 3)
      );
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Detects check", (done) => {
    try {
      let chess = new Chess({fen:"rnb1kbnr/ppp2ppp/8/3pP3/5P1q/8/PPP1P1PP/RNBQKBNR"});
      const checkWhite = chess.check().pop().checked.piece.color === "white";
      chess = new Chess({fen:"rnbqkbnr/ppppp1pp/8/5p1Q/4P3/8/PPPP1PPP/RNB1KBNR"});
      const checkBlack = chess.check().pop().checked.piece.color === "black";
      assert(checkWhite && checkBlack);
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Detects checkmate", (done) => {
    try {
      let chess = new Chess({fen: "4k3/4P3/3PK3/8/8/8/8/8"});
      let check1 = chess.checkmate().black && !chess.checkmate().white;
      
      chess = new Chess({fen: "R5k1/5ppp/8/8/8/8/8/R3K3"});
      let check2 = chess.checkmate().black && !chess.checkmate().white;

      chess = new Chess({fen: "r4r2/ppp1Nppk/8/7R/8/1P6/P4PPP/6K1"});
      let check3 = chess.checkmate().black && !chess.checkmate().white;

      chess = new Chess({fen: "7k/p6p/1p6/8/8/8/BB3K2/8"});
      let check4 = chess.checkmate().black && !chess.checkmate().white;

      // TODO: Add in white checkmates

      assert (check1 && check2 && check3 && check4);

      done();
    } catch (e) {
      done(e);
    }
  });
});