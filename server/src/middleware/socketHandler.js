const roomControler = require("../controllers/room")
const terminalController = require("../controllers/terminal")
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        roomControler(io,socket);
        terminalController(io,socket);
        

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
};
