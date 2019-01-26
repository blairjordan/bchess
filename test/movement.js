const assert = require("assert");
const { Chess, Piece, Action } = require("../js/chess");

describe("Movement tests", () => {

  it("Move a piece", (done) => {
    try {
      const chess = new Chess();
      const action = chess.move({from:"g2",to:"g4"});
      assert(action === Action.MOVE);
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Castle", (done) => {
    try {
      let [whiteQueen, whiteKing, blackQueen, blackKing] = Array(4).fill(false);
      let action = null;
      
      // castle queen side white
      let chess = new Chess({fen:"r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R"});
      action = chess.move({from:"e1",to:"a1"});
      whiteQueen = chess.get({square: "c1"}).piece.name === "K" && chess.get({square: "d1"}).piece.name === "R" && action === Action.CASTLE_QUEEN;

      // castle king side white
      chess = new Chess({fen:"r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R"});
      action = chess.move({from:"e1",to:"h1"});
      whiteKing = chess.get({square: "g1"}).piece.name === "K" && chess.get({square: "f1"}).piece.name === "R" && action === Action.CASTLE_KING;

      // castle queen side black
      chess = new Chess({fen:"r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R"});
      action = chess.move({from:"e8",to:"a8"});
      blackQueen = chess.get({square: "c8"}).piece.name === "K" && chess.get({square: "d8"}).piece.name === "R" && action === Action.CASTLE_QUEEN;
      
      // castle king side black
      chess = new Chess({fen:"r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R"});
      action = chess.move({from:"e8",to:"h8"});
      blackKing = chess.get({square: "g8"}).piece.name === "K" && chess.get({square: "f8"}).piece.name === "R" && action === Action.CASTLE_KING;

      assert(whiteQueen && whiteKing && blackQueen && blackKing);

      done();
    } catch (e) {
      done(e);
    }
  });

  it("Attempt invalid castling", (done) => {
    try {
      let [whiteQueensideRook, whiteKingsideRook, blackQueensideRook, blackKingsideRook, whiteKingsideKing] = Array(5).fill(false);
      let action = null;
      
      // castle queen side white with moved rook
      let chess = new Chess({fen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/R3KBNR"});
      chess.get({square:"a1"}).piece.moves = 1;
      action = chess.move({from:"e1",to:"a1"});
      whiteQueensideRook = (action === Action.INVALID_ACTION);
      
      // castle king side white with moved rook
      chess = new Chess({fen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNQK2R"});
      chess.get({square:"h1"}).piece.moves = 1;
      action = chess.move({from:"e1",to:"h1"});
      whiteKingsideRook = (action === Action.INVALID_ACTION);
      
      // castle queen side black with moved rook
      chess = new Chess({fen:"r3kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"});
      chess.get({square:"a8"}).piece.moves = 1;
      action = chess.move({from:"e8",to:"a8"});
      blackQueensideRook = (action === Action.INVALID_ACTION);
      
      // castle king side black with moved rook
      chess = new Chess({fen:"rnbqk2r/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"});
      chess.get({square:"h8"}).piece.moves = 1;
      action = chess.move({from:"e8",to:"h8"});
      blackKingsideRook = (action === Action.INVALID_ACTION);

      // castle king side white with moved king
      chess = new Chess({fen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQK2R"});
      chess.get({square:"e1"}).piece.moves = 1;
      action = chess.move({from:"e1",to:"h1"});
      whiteKingsideKing = (action === Action.INVALID_ACTION);

      assert(whiteQueensideRook && whiteKingsideRook && blackQueensideRook && blackKingsideRook && whiteKingsideKing);
      
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Available moves", (done) => {
    try {
      const chess = new Chess();
      assert(["b3", "b4"].join() === chess.available({square:"b2"}).map(s => `${s.file}${s.rank}`).join());
      done();
    } catch (e) {
      done(e);
    }
  });
  
  it("Promotes pawn", (done) => {
    try {
      const chess = new Chess();
      chess.set({square:"b1",piece: new Piece()});
      chess.set({square:"b8",piece: new Piece()});
      
      chess.set({square:"b7",piece: new Piece("P","white")});
      chess.set({square:"b2",piece: new Piece("P","black")});

      chess.move({from:"b7",to:"b8",promote:"B"});
      chess.move({from:"b2",to:"b1",promote:"R"});

      assert (chess.get({square: "b8"}).piece.name === "B"
           && chess.get({square: "b1"}).piece.name === "R");

      done();
    } catch (e) {
      done(e);
    }
  });

  it("SAN notation for move", (done) => {
    try {

      // TODO: Add ambiguous moves (different levels)
      // TODO: Add pawn movement and pawn captures
      
      let chess = new Chess({fen: "7k/p3rP1B/8/3q4/5B2/2p1K1PQ/P6P/5r2"});
      let checkmatePrior = chess.checkmate().black && !chess.checkmate().white;
      let checkmate = !checkmatePrior && chess.moveToSAN({from:"d5",to:"d2"}) == "Qd2#";

      chess = new Chess({fen:"7k/p1r2P1B/8/8/5B2/2p1K1PQ/P6P/q4r2"});
      let checkPrior = chess.check().length > 0;
      let check = !checkPrior && chess.moveToSAN({from:"c7",to:"e7"}) == "Re7+";

      chess = new Chess({fen:"r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R"});
      let castleBlackQueen = chess.moveToSAN({from:"e8",to:"a8"}) === "0-0-0";

      chess = new Chess({fen:"r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R"});
      let castleWhiteKing = chess.moveToSAN({from:"e1",to:"h1"}) === "0-0";

      chess = new Chess({fen:"8/4P3/8/8/8/8/8/8"});
      let promote  = chess.moveToSAN({from:"e7",to:"h8",promote:"Q"}) === "h8=Q";

      chess = new Chess({fen: "rnbqkbnr/pppppppp/8/4P3/8/8/PPPP1PPP/RNBQKBNR"});
      chess.move({from:"d7",to:"d5"})
      let enPassant = chess.moveToSAN({from:'e5',to:'d6'}) === "exd6";

      chess = new Chess({fen:"rnbqkbnr/pp1pp1pp/5p2/2p5/3PP1P1/8/PPP2P1P/RNBQKBNR"});
      let pawnCapture = chess.moveToSAN({from:"c5",to:"d4"}) === "cxd4"

      chess = new Chess({fen:"k7/8/3R4/8/8/8/3R4/7K"});
      let ambiguousFile = chess.moveToSAN({from:"d2",to:"d4"}) === "R2d4";

      chess = new Chess({fen:"k7/8/8/1R4R1/8/8/8/7K"});
      let ambiguousRank = chess.moveToSAN({from:"b5",to:"e5"}) === "Rbe5";

      chess = new Chess({fen:"k7/8/8/2Q2Q2/8/8/2Q5/7K"});
      let ambiguousFileRank = chess.moveToSAN({from:"c5",to:"f2"}) === "Qc5f2"

      chess = new Chess();
      let invalidMove = chess.moveToSAN({from:"c2",to:"c5"}) === "";

      assert (checkmate && check && castleBlackQueen && castleWhiteKing && promote && enPassant
        && pawnCapture && ambiguousFile && ambiguousRank && ambiguousFileRank && invalidMove);

      done();
    } catch (e) {
      done(e);
    }
  });
});
