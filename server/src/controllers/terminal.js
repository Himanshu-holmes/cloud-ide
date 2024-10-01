var os = require('os');
var pty = require('node-pty');


module.exports = (io,socket) =>{

var shell = os.platform() === 'win32' ? 'powershell.exe' : 'fish';

var ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD,
  env: process.env
});




ptyProcess.resize(100, 40);


ptyProcess.onData(data =>{
  io.emit('terminal:data',data)
})

socket.on("terminal:write",(data)=>{
  ptyProcess.write(data)
})
    
}

