import React, { useEffect, useRef, useState } from 'react';
import '@xterm/xterm/css/xterm.css'; // Import the xterm.css file for styling
import { io } from 'socket.io-client'; // Import Socket.IO client
import { Terminal } from '@xterm/xterm';
import { initSocket } from '@/socket';

function TerminalComp() {
  const terminalRef = useRef(null); // Reference to the DOM element
  const isRendered = useRef(null)
  const socket = useRef(null); // State to store socket instance
  let term;

  useEffect(() => {
    // Initialize Socket.IO connection
    async function init(){
    const newSocket =   await initSocket();// Connect to the backend
    socket.current = newSocket;

    // Initialize the terminal
    term = new Terminal({
      rows: 24,
      cursorBlink: true,
    });

    // if (terminalRef.current) {
      term.open(terminalRef.current); // Bind the terminal to the DOM element
      // term.focus();
      // term.writeln("Connected to Socket.IO server");

      // Handle terminal input
      term.onData((data) => {
        console.log(data)
        socket.current.emit("terminal:write",data)
        
      });

     socket.current.on("terminal:data",(data)=>{
      term.write(data);
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
    // return () => {
    //   socket.current?.disconnect();
    //   term.dispose(); // Clean up the terminal instance
    // };
  }, [socket.current]);

  return (
    <div id='terminal'
      ref={terminalRef}
      // style={{ width: '100%', height: '100%', backgroundColor: 'black' }}
    ></div>
  );
}

export default TerminalComp;
