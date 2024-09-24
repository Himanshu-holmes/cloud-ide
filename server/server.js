const express = require('express');

const app = express();

const http = require('http')
const {Server} = require('socket.io');


const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
console.log('a user connected', socket.id);
});



server.listen(3000, () => {
    console.log('listening on *:3000');
});
