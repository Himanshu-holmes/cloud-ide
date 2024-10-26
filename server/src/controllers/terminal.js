    var os = require('os');
    var pty = require('node-pty');
    const { mkdirSync, existsSync, mkdir } = require('fs');
    const chokidar = require("chokidar")
    const fs = require("fs/promises");
    var path = require("path")

    module.exports = async(io,socket) =>{


    chokidar.watch('./user').on('all', (event, path) => {

      console.log("File change detected:", event, path);
        io.emit("file:refresh",path);
      });
    // var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    var shell = 'sh';

    // if( ! existsSync(path.join(process.cwd(),"/user")) ){
    //   console.log(existsSync(path.join(process.cwd(),"/user")))
    //     // mkdirSync(
    //     //   path.join(process.cwd(),"/user")
    //     // )
    // }

    var ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      // cwd: path.join(process.cwd()),
      cwd: process.env.INIT_CWD + "/user",
      env: process.env
    });





    ptyProcess.resize(100, 40);


    ptyProcess.onData(data =>{
      const cleanData = data
      // .replace(/\x1B\[[0-9;]*[mK]/g, '')   // ANSI color codes
      // .replace(/\x1B\]0;.*?\x07/g, '')     // Window title sequences
      // .replace(/\x1B\[?200[4h]/g, '');      // Bracketed paste mode on/off
      io.emit('terminal:data',cleanData)
    })

    socket.on("terminal:write",(data)=>{
      ptyProcess.write(data)
    })
    socket.on("file:change",async({content,path})=>{
      console.log('path:::',path)
                          
      await fs.writeFile(`./user${path}`,content)
  });
    ptyProcess.onExit((exitCode, signal) => {
      
      console.log(`PTY process exited with code: ${exitCode}, signal: ${signal}`);
  });

    }

