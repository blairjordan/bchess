const assert = require("assert");
const { Chess, Piece, Action } = require("../js/chess");

describe("Chess tests", () => {

  it("Set a square", (done) => {
    try {
      const chess = new Chess({});
      chess.set({square: "b5", piece: new Piece("Q","white")});
      done();
    } catch (e) {
      done(e);
    }
  });

  it("Get a square", (done) => {
    try {
      const chess = new Chess({});
      chess.set({square: "b5", piece: new Piece("Q","white")});
      const square = chess.get({square: "b5"});
      assert(square.piece.name === "Q" && square.piece.color === "white");
      done();
    } catch (e) {
      done(e);
    }
  });

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

  it("Validates bounds correctly", (done) => {
    try {
      const chess = new Chess({});
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

  it("Promotes pawn", (done) => {
    try {
      const chess = new Chess({});
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
  
  it("Board white view", (done) => {
    try {
      const chess = new Chess({});
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
      const chess = new Chess({});
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
});