const express = require('express');

const app = express();

const http = require('http')
const {Server} = require('socket.io');
const { ACTIONS } = require('./src/constant');


const server = http.createServer(app);
const io = new Server(server);

function getAllConnectedClients(roomId){
   return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
         return {
              socketId,
              username: userSocketMap[socketId]
         }
   })
}

const userSocketMap = {}
io.on('connection', (socket) => {
console.log('a user connected', socket.id);
socket.on(ACTIONS.JOIN, ({roomId, username})=>{
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    console.log("clients",clients);
    clients.forEach(({socketId})=>{
        io.to(socketId).emit(ACTIONS.JOINED,{
            clients,
            username,
            socketId:socket.id
        })
    })
})
socket.on(ACTIONS.CODE_CHANGE,({roomId,codes,changes})=>{
    console.log("code change",codes);
    console.log("change event in roomId",roomId);
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{codes,changes});


})
socket.on(ACTIONS.SYNC_CODE,({socketId,codes})=>{
    io.to(socketId).emit(ACTIONS.CODE_CHANGE,{codes})
})
socket.on("disconnecting",()=>{
    const rooms = [...socket.rooms];

    rooms.forEach((roomId)=>{
        socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
            socketId:socket.id,
            username:userSocketMap[socket.id]
        })
    })
    delete userSocketMap[socket.id];
    socket.leave();
})
});



server.listen(3000, () => {
    console.log('listening on *:3000');
});
