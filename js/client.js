const id = Math.floor(100000 + Math.random() * 900000);
const socket = io.connect('http://127.0.0.1:3001');

socket.on('connect', function() {
    toggleStatus();
    toggleSetup();

    listen('side-selected', () => {
        clear();
        build();
        
        socket.on('move', function (data) {
            const {from, to} = data.move;
            chess.move({from, to});
            refresh();
            myturn = true;
        });

        listen('square-click', (res) => {
            const {from, to} = res;
            socket.emit('move', {id, move: {from, to}});
        });
    });
});
