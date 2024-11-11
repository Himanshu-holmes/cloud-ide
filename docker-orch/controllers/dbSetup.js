const { executeQuery } = require("../dbConnect");
const { formattedResponse } = require("../utils");

const createTableUsers = `
CREATE TABLE IF NOT EXISTS users (
 id INT PRIMARY KEY AUTO_INCREMENT,
 username VARCHAR(255) UNIQUE,
 email VARCHAR(255) UNIQUE,
 password VARCHAR(255),
 docker_id VARCHAR(255) UNIQUE,
 port INT
);`

const createTableRooms = `
CREATE TABLE IF NOT EXISTS rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_name VARCHAR(255) NOT NULL,
    creator_id INT,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);`

const createTableRoomUsers = `
CREATE TABLE IF NOT EXISTS room_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT,
    user_id INT,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`

async function dbSetup(){
try {
    const usersTable = await executeQuery(createTableUsers);
    if(usersTable.status !== 200){
        return formattedResponse(400,null,`users table :: ${usersTable}`)
    };
    
    const roomsTable = await executeQuery(createTableRooms);
    if(roomsTable.status !== 200){
        return formattedResponse(400,null,`rooms table :: ${roomsTable}`)
    };
    const roomUsersTable = await executeQuery(createTableRoomUsers);
    if (roomUsersTable.status !== 200){
        return formattedResponse(400,null,`roomUsers table :: ${roomUsersTable}`)
    };
    
    return formattedResponse(200,null,"dbSetup successfully")
} catch (error) {
    console.log(error);
    return formattedResponse(500,null,`dbSetup :: ${error.message}`)
}
};
module.exports = {
    dbSetup
}