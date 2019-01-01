const socket = io.connect('http://127.0.0.1:3001');

socket.on('connect', function() {
        build();
        listenSquareClick((action) => {

            socket.emit('move', function (data) {
                //
            });
        });

      socket.on('move', function (data) {
            chess.move(data);
            refresh();
        });
});

// socket.emit('move',{message:'test asdasdas'});
