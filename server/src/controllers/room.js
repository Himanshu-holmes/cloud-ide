const { ACTIONS } = require("../constant");
const userSocketMap = {};
const roomCodeMap = {}; // Store current code state for each room
const roomLocks = {}; // Store locks for each room

module.exports = (io, socket) => {

  function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => ({
      socketId,
      username: userSocketMap[socketId],
    }));
  }

  // Function to acquire lock on a room
  function acquireRoomLock(roomId, callback) {
    if (!roomLocks[roomId]) {
      roomLocks[roomId] = false;
    }

    const tryAcquireLock = () => {
      if (!roomLocks[roomId]) {
        roomLocks[roomId] = true;
        callback();
      } else {
        setImmediate(tryAcquireLock);
      }
    };

    tryAcquireLock();
  }

  // Function to release lock on a room
  function releaseRoomLock(roomId) {
    roomLocks[roomId] = false;
  }

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);
    console.log("clients", clients);

    // Sync the current code with the rejoined user
    if (roomCodeMap[roomId]) {
      // If there is existing code for the room, sync it to the user
      io.to(socket.id).emit(ACTIONS.CODE_CHANGE, { codes: roomCodeMap[roomId] });
    }

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, codes, changes }) => {
    console.log("code change", codes);
    console.log("change event in roomId", roomId);

    // Update the current code for the room
    roomCodeMap[roomId] = codes;

    // Emit code changes to other clients in the room, except the sender
    acquireRoomLock(roomId, () => {
      socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { codes, changes });
      releaseRoomLock(roomId);
    });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ codes,socketId }) => {
    // Sync code to a specific socket
    console.log("=====syncing ===", codes)
    acquireRoomLock(socketId, () => {
      io.to(socketId).emit(ACTIONS.CODE_CHANGE, { codes });
      releaseRoomLock(socketId);
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];

    rooms.forEach((roomId) => {
      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
  });
};
