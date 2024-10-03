var os = require('os');
var pty = require('node-pty');
const { mkdirSync } = require('fs');


module.exports = (io,socket) =>{

var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

var ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD + "/user",
  env: process.env
});





ptyProcess.resize(100, 40);


ptyProcess.onData(data =>{
  const cleanData = data
  .replace(/\x1B\[[0-9;]*[mK]/g, '')   // ANSI color codes
  .replace(/\x1B\]0;.*?\x07/g, '')     // Window title sequences
  .replace(/\x1B\[?200[4h]/g, '');      // Bracketed paste mode on/off
  io.emit('terminal:data',cleanData)
})

socket.on("terminal:write",(data)=>{
  ptyProcess.write(data)
})
    
}

