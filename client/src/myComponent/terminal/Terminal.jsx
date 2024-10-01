import React, { useEffect, useRef, useState } from 'react';
import '@xterm/xterm/css/xterm.css'; // Import the xterm.css file for styling
import { io } from 'socket.io-client'; // Import Socket.IO client
import { Terminal } from '@xterm/xterm';
import { initSocket } from '@/socket';

function TerminalComp() {
  const terminalRef = useRef(null); // Reference to the DOM element
  const socket = useRef(null); // State to store socket instance
  let term;

  useEffect(() => {
    // Initialize Socket.IO connection
    async function init(){
    const newSocket =   await initSocket();// Connect to the backend
    socket.current = newSocket;

    // Initialize the terminal
    term = new Terminal({
      cols: 80,
      rows: 24,
      cursorBlink: true,
    });

    if (terminalRef.current) {
      term.open(terminalRef.current); // Bind the terminal to the DOM element
      term.focus();
      term.writeln("Connected to Socket.IO server");

      // Handle terminal input
      term.onData((input) => {
        if (input === '\r') {
          term.writeln('$'); // New prompt after pressing Enter
        
        } else {
          term.write(input); // Echo input to terminal
          if (socket.current) {
            socket.current.emit('message', input); // Send the input to the server
          }
        }
      });
    }

    // Listen for messages from the server
    if (newSocket) {
      newSocket.on('message', (msg) => {
        term.writeln(msg); // Write server messages to the terminal
      });
    }
    }
    init();
    // Cleanup on component unmount
    return () => {
      socket.current?.disconnect();
      term.dispose(); // Clean up the terminal instance
    };
  }, [socket.current]);

  return (
    <div
      ref={terminalRef}
      style={{ width: '100%', height: '100%', backgroundColor: 'black' }}
    ></div>
  );
}

export default TerminalComp;
