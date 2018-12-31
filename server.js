const io = require('socket.io')(3001);
const { Chess, Piece } = require('./js/chess');
const chess = new Chess();

io.on('connect', function(socket){
    console.log('a user connected');
    socket.emit('move', {from: 'a2', to: 'a4'});
    socket.on('move', function(move){
        chess.move(move);
      });
});
  