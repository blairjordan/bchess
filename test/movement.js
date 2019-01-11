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

  it("Castles king/queenside", (done) => {
    try {
      let [whiteQueen, whiteKing, blackQueen, blackKing] = Array(4).fill(false);
      let action = null;
      
      // castle queen side white
      let chess = new Chess();
      chess.set({square:"b1",piece: new Piece()});
      chess.set({square:"c1",piece: new Piece()});
      chess.set({square:"d1",piece: new Piece()});
      action = chess.move({from:"e1",to:"a1"});
      whiteQueen = chess.get({square: "c1"}).piece.name === "K" && chess.get({square: "d1"}).piece.name === "R" && action === Action.CASTLE;

      // castle king side white
      chess = new Chess();
      chess.set({square:"f1",piece: new Piece()});
      chess.set({square:"g1",piece: new Piece()});
      action = chess.move({from:"e1",to:"h1"});
      whiteKing = chess.get({square: "g1"}).piece.name === "K" && chess.get({square: "f1"}).piece.name === "R" && action === Action.CASTLE;

      // castle queen side black
      chess = new Chess();
      chess.set({square:"b8",piece: new Piece()});
      chess.set({square:"c8",piece: new Piece()});
      chess.set({square:"d8",piece: new Piece()});
      action = chess.move({from:"e8",to:"a8"});
      blackQueen = chess.get({square: "c8"}).piece.name === "K" && chess.get({square: "d8"}).piece.name === "R" && action === Action.CASTLE;
      
      // castle king side black
      chess = new Chess();
      chess.set({square:"f8",piece: new Piece()});
      chess.set({square:"g8",piece: new Piece()});
      action = chess.move({from:"e8",to:"h8"});
      blackKing = chess.get({square: "g8"}).piece.name === "K" && chess.get({square: "f8"}).piece.name === "R" && action === Action.CASTLE;

      assert(whiteQueen && whiteKing && blackQueen && blackKing);

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
});
