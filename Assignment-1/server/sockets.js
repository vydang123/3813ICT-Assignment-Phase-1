const socketIo = require('socket.io');
const cors = require('cors');

function setupSockets(server) {
    const io = socketIo(server, {
        cors: {
            origin: "http://localhost:4200",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('message', (msg) => {
            io.emit('message', msg);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
}

module.exports = {
    setupSockets
};
