import { executeQuery } from "../dbConnect";
import { formattedResponse } from "../utils"

async function insertRoomId(id:string,roomId:string){
    try {
        let query = `insert into rooms(room_name,creator_id) values(?,?)`;
        let result = await executeQuery(query,[roomId,id]);
        if(result.status !=200){
            return formattedResponse(400,null,result.message);
        }
        return formattedResponse(200,result.data,"inserted successfully")
    } catch (error:any) {
        console.log(error);
        return formattedResponse(500,null,error.message);
    }
}

export {
    insertRoomId
}