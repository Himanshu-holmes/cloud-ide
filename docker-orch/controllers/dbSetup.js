

const createTableUsers = `
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL
);
`

const createTableRooms = `
CREATE TABLE IF NOT EXISTS rooms (
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    room_name VARCHAR(255) NOT NULL,
    creator_id INT,
    FOREIGN KEY (creator_id) REFERENCES users(id)
);`


const createTableRoomUsers = `
CREATE TABLE IF NOT EXISTS room_users (
    room_user_id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT,
    user_id INT,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);`
