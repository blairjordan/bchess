const assert = require("assert");
const { Chess, Piece, Action } = require("../js/chess");

describe("Game tests", () => {

  it("Get total number of moves", (done) => {
    try {
      const chess = new Chess();
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
      const chess = new Chess();
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
      const chess = new Chess();
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

  it("Detects stalemate", (done) => {
    try {
      let chess = new Chess({fen:"4k3/4P3/3PK3/8/8/8/8/8"});
      const checkmate1 = chess.checkmate().black || chess.checkmate().white;
      const black1 = !checkmate1 && chess.stalemate().black && !chess.stalemate().white;
  
      chess = new Chess({fen:"5bnr/4p1pq/4Qpkr/7p/7P/4P3/PPPP1PP1/RNB1KBNR"});
      const checkmate2 = chess.checkmate().black || chess.checkmate().white;
      const black2 = !checkmate2 && chess.stalemate().black && !chess.stalemate().white;
      
      chess = new Chess({fen:"8/8/8/8/8/7k/7p/7K"});
      const checkmate3 = chess.checkmate().black || chess.checkmate().white;
      const white1 = !checkmate3 && !chess.stalemate().black && chess.stalemate().white;

      chess = new Chess({fen:"7k/p3rP1B/8/8/5B2/2p1K1PQ/P2q3P/5r2"});
      const none = !chess.stalemate().white && !chess.stalemate().black;

      assert (black1 && black2 && white1 && none);

      done();
    } catch (e) {
      done(e);
    }
  });


  it("Detects checkmate", (done) => {
    try {
      let chess = new Chess({fen: "R5k1/5ppp/8/8/8/8/8/R3K3"});
      const black1 = chess.checkmate().black && !chess.checkmate().white;

      chess = new Chess({fen: "r4r2/ppp1Nppk/8/7R/8/1P6/P4PPP/6K1"});
      const black2 = chess.checkmate().black && !chess.checkmate().white;

      chess = new Chess({fen: "7k/p6p/1p6/8/8/8/BB3K2/8"});
      const black3 = chess.checkmate().black && !chess.checkmate().white;

      chess = new Chess({fen:"r4rk1/1Q1b1pp1/2B2n2/7p/8/bRpP2P1/P1P1Pp1P/2qK3R"});
      const white1 = chess.checkmate().white && !chess.checkmate().black;

      chess = new Chess({fen:"rnb1kbnr/pppp1ppp/8/4p3/6Pq/5p2/PPPPP2P/RNBQKBNR"});
      const white2 = chess.checkmate().white && !chess.checkmate().black;

      chess = new Chess({fen:"7k/p3rP1B/8/8/5B2/2p1K1PQ/P2q3P/5r2"});
      const white3 = chess.checkmate().white && !chess.checkmate().black;

      assert (black1 && black2 && black3 && white1 && white2 && white3);

      done();
    } catch (e) {
      done(e);
    }
  });

  it("Scores", (done) => {
    try {
      let chess = new Chess({fen:"1k6/5pk1/2p3p1/1p2N2p/1b5P/1bn5/2r3P1/2K5"});
      let score1 = chess.score().white.toString() === "R,B,Q,B,N,R,P,P,P,P,P,P" && chess.score().black.toString() === "Q,N,R,P,P,P";

      chess = new Chess({fen:"5rk1/pp2p3/3p2pb/2pP4/2q5/3b1B1P/PPn2Q2/R1NK2R1"});
      let score2 = chess.score().white.toString() === "B,N,P,P,P,P" && chess.score().black.toString() === "N,R,P,P";

      chess = new Chess({fen:"8/4P3/8/8/8/8/8/8"});
      chess.move({from: "e7", to: "e8", promote: "Q"});
      let score3 = chess.score().white.toString() === "R,N,B,Q,K,B,N,R,P,P,P,P,P,P,P";

      assert(score1 && score2 && score3);
      
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Undo moves", (done) => {
    try {
      let chess = new Chess();
      chess.undo();
      let start = chess.fen() === "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

      chess = new Chess({fen: "rnbqkbnr/pppppppp/8/3P4/8/8/PPP1PPPP/RNBQKBNR"});
      chess.move({from:"c7", to: "c5"});
      chess.move({from:"d5", to: "c6"});
      chess.undo();
      let enPassant = chess.fen() === "rnbqkbnr/pp1ppppp/8/2pP4/8/8/PPP1PPPP/RNBQKBNR";
      chess.undo();
      let twoMoves = chess.fen() === "rnbqkbnr/pppppppp/8/3P4/8/8/PPP1PPPP/RNBQKBNR";
      
      chess = new Chess({fen:"r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R"});
      chess.move({from:"e1", to: "a1"});
      chess.undo();
      let whiteCastleQueen = chess.fen() === "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R";

      chess = new Chess({fen:"r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R"});
      chess.move({from:"e1", to: "h1"});
      chess.undo();
      let whiteCastleKing = chess.fen() === "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R";
      
      chess = new Chess({fen:"r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R"});
      chess.move({from:"e8", to: "a8"});
      chess.undo();
      let blackCastleQueen = chess.fen() === "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R";

      chess = new Chess({fen:"r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R"});
      chess.move({from:"e8", to: "h8"});
      chess.undo();
      let blackCastleKing = chess.fen() === "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R";
      
      assert (start && enPassant && twoMoves && whiteCastleQueen && whiteCastleKing && blackCastleQueen && blackCastleKing);

      done();
    } catch (e) {
      done(e);
    }
  });

  it("Undo moves", (done) => {
    try {
      const chess = new Chess();
      let start = chess.turn() === "white";
      chess.move({from:"e2", to: "e4"});
      let whiteMoved = chess.turn() === "black";
      chess.move({from:"b7", to: "b5"});
      let blackMoved = chess.turn() === "white";
      chess.undo();
      let blackUndo = chess.turn() === "black";
      chess.undo();
      let whiteUndo = chess.turn() === "white";
  
      assert(start && whiteMoved && blackMoved && blackUndo && whiteUndo);
      done();
    } catch (e) {
      done(e);
    }
  });
});