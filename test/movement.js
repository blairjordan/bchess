const assert = require("assert");
const { Chess, Piece, Action } = require("../js/chess");

describe("Movement tests", () => {

  it("Move a piece", (done) => {
    try {
      const chess = new Chess({});
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
      let chess = new Chess({});
      chess.set({square:"b1",piece: new Piece()});
      chess.set({square:"c1",piece: new Piece()});
      chess.set({square:"d1",piece: new Piece()});
      chess.get({square:"a1"}).piece.moves = 1;
      action = chess.move({from:"e1",to:"a1"});
      whiteQueensideRook = (action === Action.INVALID_ACTION);
      
      // castle king side white with moved rook
      chess = new Chess({});
      chess.set({square:"f1",piece: new Piece()});
      chess.set({square:"g1",piece: new Piece()});
      chess.get({square:"h1"}).piece.moves = 1;
      action = chess.move({from:"e1",to:"h1"});
      whiteKingsideRook = (action === Action.INVALID_ACTION);
      
      // castle queen side black with moved rook
      chess = new Chess({});
      chess.set({square:"b8",piece: new Piece()});
      chess.set({square:"c8",piece: new Piece()});
      chess.set({square:"d8",piece: new Piece()});
      chess.get({square:"a8"}).piece.moves = 1;
      action = chess.move({from:"e8",to:"a8"});
      blackQueensideRook = (action === Action.INVALID_ACTION);
      
      // castle king side black with moved rook
      chess = new Chess({});
      chess.set({square:"f8",piece: new Piece()});
      chess.set({square:"g8",piece: new Piece()});
      chess.get({square:"h8"}).piece.moves = 1;
      action = chess.move({from:"e8",to:"h8"});
      blackKingsideRook = (action === Action.INVALID_ACTION);

      // castle king side white with moved king
      chess = new Chess({});
      chess.set({square:"f1",piece: new Piece()});
      chess.set({square:"g1",piece: new Piece()});
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
      const chess = new Chess({});
      assert(["b3", "b4"].join() === chess.available({square:"b2"}).map(s => `${s.file}${s.rank}`).join());
      done();
    } catch (e) {
      done(e);
    }
  });
});
