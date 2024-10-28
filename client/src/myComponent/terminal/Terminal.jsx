import React, { useEffect, useRef, useState } from 'react';
import '@xterm/xterm/css/xterm.css'; // Import the xterm.css file for styling
import { io } from 'socket.io-client'; // Import Socket.IO client
import { Terminal } from '@xterm/xterm';
import { initSocket } from '@/socket';

function TerminalComp() {
  const terminalRef = useRef(null); // Reference to the DOM element
  const termInstance = useRef(null);
  const isRender = useRef(false)
  const socket = useRef(null); // State to store socket instance


  useEffect(() => {
    if(isRender.current)return;
    console.log("terminal rendered ==================");
    isRender.current = true
    // Initialize Socket.IO connection
    async function init(){
      
    const newSocket =   await initSocket();// Connect to the backend
    socket.current = newSocket;

   

     // Initialize the terminal if it hasn't been initialized already
     if (!termInstance.current) {
      termInstance.current = new Terminal({
        rows: 24,
        cursorBlink: true,
      });
    }

    // if (terminalRef.current) {
      // term.open(terminalRef.current); // Bind the terminal to the DOM element
      // term.focus();
      // term.writeln("Connected to Socket.IO server");

      termInstance.current.open(terminalRef.current);

      // Handle terminal input
      termInstance.current.onData((data) => {
        console.log(data)
        socket.current.emit("terminal:write",data)
        
      });

     socket.current.on("terminal:data",(data)=>{
      termInstance.current.write(data);
     })
    // }

    // Listen for messages from the server
    // if (newSocket) {
    //   newSocket.on('message', (msg) => {
    //     term.writeln(msg); // Write server messages to the terminal
      // });
    // }
    }
    init();       
    // Cleanup on component unmount
    return () => {
      socket.current?.off("terminal:data")
      socket.current?.disconnect();
      termInstance.current?.dispose(); // Clean up the terminal instance
    };
  }, []);

  return (
    <div id='terminal'
      ref={terminalRef}
      style={{ width: '100%', height: '100%', backgroundColor: 'black' }}
    ></div>
  );
}

export default TerminalComp;
