import {io} from "socket.io-client";


export const initSocket = async() => {
    let containerId = `09cae955514dace6686f91f976d244eb9865eed09e68cd1bb9c5f1936d22f591`
    const options = {
        "force new connection": true,
        reconnectionAttempts: "Infinity",
        timeout: 10000,
        transports: ["websocket"],


    };
   console.log("backend url",import.meta.env.VITE_BACKEND_URL)
    return io(`${import.meta.env.VITE_BACKEND_URL}/?id=${containerId}`,options)

}