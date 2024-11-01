import {io} from "socket.io-client";


export const initSocket = async() => {
    let containerId = "5b38a9e099bee73d4181ddfe347fbd009e6c33da99f0fbf3d1485d0d59069e72"
    const options = {
        "force new connection": true,
        reconnectionAttempts: "Infinity",
        timeout: 10000,
        transports: ["websocket"],

    };
   console.log("backend url",import.meta.env.VITE_BACKEND_URL)
    return io(import.meta.env.VITE_BACKEND_URL,options)

}