const socketIo = require('socket.io');

function setupSockets(server) {
    const io = socketIo(server, {
        cors: {
            origin: "http://localhost:4200",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('newMessage', (msg) => {
            io.emit('broadcastMessage', msg); // Broadcast the message to all connected clients
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
}

module.exports = {
    setupSockets
};
