import {io} from "socket.io-client";


export const initSocket = async(containerId,isInviteLink) => {
  
    const options = {
        "force new connection": true,
        reconnectionAttempts: "Infinity",
        timeout: 10000,
        transports: ["websocket"],


    };
   console.log("backend url",import.meta.env.VITE_BACKEND_URL)
   console.log("from socket.js",isInviteLink)
   if(isInviteLink === "true"){
    return io(`${import.meta.env.VITE_BACKEND_URL}/?id=${containerId}&invite=${isInviteLink}`,options)
   }
    return io(`${import.meta.env.VITE_BACKEND_URL}/?id=${containerId}`,options)

}