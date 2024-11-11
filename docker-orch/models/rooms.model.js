const { executeQuery } = require("../dbConnect");
const { formattedResponse } = require("../utils");

async function insertRoomId(id,roomId){
    try {
        let query = `insert into rooms(room_name,creator_id) values(?,?)`;
        let result = executeQuery(query,[roomId,id]);
        if(result.status !=200){
            return formattedResponse(400,null,result.message);
        }
        return formattedResponse(200,result.data,"inserted successfully")
    } catch (error) {
        console.log(error);
        return formattedResponse(500,null,error.message);
    }
}

module.exports = {
    insertRoomId
}