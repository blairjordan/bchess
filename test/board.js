const assert = require("assert");
const { Chess, Piece, Action } = require("../src/js/bchess");

describe("Board tests", () => {

  it("Set a square", (done) => {
    try {
      const chess = new Chess();
      chess.set({square: "b5", piece: new Piece("Q","white")});
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Get a square", (done) => {
    try {
      const chess = new Chess();
      chess.set({square: "b5", piece: new Piece("Q","white")});
      const square = chess.get({square: "b5"});
      assert(square.piece.name === "Q" && square.piece.color === "white");
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Validates bounds correctly", (done) => {
    try {
      const chess = new Chess();
      assert(
          chess.inbounds({square: "a1"})
        && chess.inbounds({square: "a8"})
        && chess.inbounds({square: "h1"})
        && chess.inbounds({square: "h8"})
        && !chess.inbounds({square: "b9"})
        && !chess.inbounds({square: "i5"})
      );
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Board white view", (done) => {
    try {
      const chess = new Chess();
      const whiteRank = "RNBQKBNR";
      assert(chess.ascii({border:false, unicode:false, rank:false, file: false}).trim().split("\n").pop().replace(/\s/g,"") === whiteRank);
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Board black view", (done) => {
    try {
      const chess = new Chess({color:"black"});
      const whiteRank = "RNBKQBNR";
      assert(chess.ascii({border:false, unicode:false, rank:false, file: false})
        .split("\n").shift().replace(/\s/g,"") === whiteRank);
      done();
    } catch (e) {
      done(e);
    }
  });

  it ("Board deep copy", (done) => {
    try {
      const chess = new Chess();
      let boardCopy = chess.copy();
      boardCopy[0][0].piece = new Piece("K","white");
      let before = chess._board[0][0].piece.name !== "K";
      chess._board = boardCopy;
      let after = chess._board[0][0].piece.name === "K";
      assert(before && after);
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Board perspective", (done) => {
    try {
      let chess = new Chess();
      let white = (chess.board()[0][0].piece.color === "black" && chess.board()[7][7].piece.color === "white");
      chess = new Chess({color:"black"});
      let black = (chess.board()[0][0].piece.color === "white" && chess.board()[7][7].piece.color === "black");
      assert(white && black);
      done();
    } catch (e) {
      done(e);
    }
  });

});