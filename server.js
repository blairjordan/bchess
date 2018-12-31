const io = require('socket.io')(3001);

io.on('connect', function(socket){
    console.log('a user connected');
    socket.emit('ping', { message: 'Hello from server ' + Date.now() });
    socket.on('move', function(msg){
        console.log(msg);
      });
});
  