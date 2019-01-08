const assert = require('assert');
const { Chess, Piece, Action } = require('../js/chess');

describe('Item model tests', () => {

  const chess = new Chess();

	it('Move a piece', (done) => {
      try {
        const action = chess.move({from:'g2',to:'g4'});
        assert(action === Action.MOVE);
        done();
      } catch (e) {
				done(e);
      }
  });

  it('Set a square', (done) => {
    try {
      chess.set({square: 'b5', piece: new Piece('Q','white')});
      done();
    } catch (e) {
      done(e);
    }
  });

  it('Get a square', (done) => {
    try {
      const square = chess.get({square: 'b5'});
      assert(square.piece.name === 'Q' && square.piece.color === 'white');
      done();
    } catch (e) {
      done(e);
    }
  });

  it('Get number of moves', (done) => {
    try {
      assert(chess.moves === 1);
      done();
    } catch (e) {
      done(e);
    }
  });
  
  it('Get FEN notation', (done) => {
    try {
      assert(chess.fen() === 'rnbqkbnr/pppppppp/8/1Q6/6P1/8/PPPPPP1P/RNBQKBNR');
      done();
    } catch (e) {
      done(e);
    }
  });

  // TODO:
  // Add tests for:
  // Castling (black/white queen/king side)
  // En passant
  // Scoring
  // Board output
  // History
  
  
});