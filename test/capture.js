const assert = require("assert");
const { Chess, Piece, Action } = require("../js/chess");

describe("Capture tests", () => {

    it("En passant", (done) => {
        try {
          const chess = new Chess();
          let [whiteLeft, whiteRight, blackLeft, blackRight] = Array(4).fill(false);
          let move = null;
    
          // white en passant to left
          chess.move({from:"f2",to:"f4"});
          chess.move({from:"f4",to:"f5"});
          chess.move({from:"e7",to:"e5"});
          move = chess.move({from:"f5",to:"e6"});
          whiteLeft = chess.score.black.pop().name === "P" && move === Action.EN_PASSANT;
    
          // white en passant to right
          chess.move({from:"b2",to:"b4"});
          chess.move({from:"b4",to:"b5"});
          chess.move({from:"c7",to:"c5"});
          move = chess.move({from:"b5",to:"c6"});
          whiteRight = chess.score.black.pop().name === "P" && move === Action.EN_PASSANT;
    
          // black en passant to left
          chess.move({from:"b7",to:"b5"});
          chess.move({from:"b5",to:"b4"});
          chess.move({from:"a2",to:"a4"});
          move = chess.move({from:"b4",to:"a3"});
          blackLeft = chess.score.white.pop().name === "P" && move === Action.EN_PASSANT;
    
          // black en passant to right
          chess.move({from:"g7",to:"g5"});
          chess.move({from:"g5",to:"g4"});
          chess.move({from:"h2",to:"h4"});
          move = chess.move({from:"g4",to:"h3"});
          blackRight = chess.score.white.pop().name === "P" && move === Action.EN_PASSANT;
    
          assert(whiteLeft && whiteRight && blackLeft && blackRight);
          done();
        } catch (e) {
          done(e);
        }
    });  

    it("You capture", (done) => {
        try {
            const chess = new Chess();
            chess.set({square: "b6", piece: new Piece("R","white")});
            let move = chess.move({from: "b6", to: "b7"});
            assert(move === Action.PLAYER_CAPTURE);
            done();
          } catch (e) {
            done(e);
          }
    });

    it("Opponent captures", (done) => {
        try {
            const chess = new Chess();
            chess.set({square: "f2", piece: new Piece("B","black")});
            let move = chess.move({from: "f2", to: "g1"});
            assert(move === Action.OPPONENT_CAPTURE);
            done();
          } catch (e) {
            done(e);
          }
    });

    it("You capture king", (done) => {
        try {
            const chess = new Chess();
            chess.set({square: "e7", piece: new Piece("R","white")});
            let move = chess.move({from: "e7", to: "e8"});
            assert(move === Action.PLAYER_CAPTURE_KING);
            done();
          } catch (e) {
            done(e);
          }
    });

    it("Opponent captures king", (done) => {
        try {
            const chess = new Chess();
            chess.set({square: "d3", piece: new Piece("N","black")});
            let move = chess.move({from: "d3", to: "e1"});
            assert(move === Action.OPPONENT_CAPTURE_KING);
            done();
          } catch (e) {
            done(e);
          }
    });
});