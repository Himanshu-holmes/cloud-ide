const express = require('express');



const http = require('http')
const {Server} = require('socket.io');
const socketHandler = require('./src/middleware/socketHandler');
const app = require('./src/app');


const server = http.createServer(app);
const io = new Server(server,{cors:"*"});

socketHandler(io);


server.listen(3000, () => {
    console.log('listening on *:3000');
});
