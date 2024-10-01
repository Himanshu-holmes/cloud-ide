const express = require('express');

const app = express();

const http = require('http')
const {Server} = require('socket.io');
const socketHandler = require('./src/middleware/socketHandler');



const server = http.createServer(app);
const io = new Server(server);

socketHandler(io)


server.listen(3000, () => {
    console.log('listening on *:3000');
});
