    var os = require('os');
    var pty = require('node-pty');
    const { mkdirSync, existsSync, mkdir } = require('fs');
    const chokidar = require("chokidar")
    const fs = require("fs/promises");
    const { debounce } = require('lodash');
    const path = require("path")
 

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
    const userDir = process.env.INIT_CWD ? process.env.INIT_CWD + "/user" : path.join(process.cwd(), "user");

    let initialized = false;
    var ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      // cwd: path.join(process.cwd()),
      cwd: userDir,
      env: process.env
    });

  console.log(process.env.INIT_CWD + "/user")



    ptyProcess.resize(100, 40);


    ptyProcess.onData(data =>{
      if (!initialized) {
        // Skip the first prompt data to prevent double prompt
        io.emit('terminal:data', data);
        initialized = true;
        
      } else {
        io.emit('terminal:data', data);
      }
    })

    socket.on("terminal:write",(data)=>{
      ptyProcess.write(data)
    })
     // Handle file content changes from the client
  socket.on("file:change", debounce(async ({ content, path }) => {
    const fullPath = path.join(userDir, path);
    try {
      await fs.writeFile(fullPath, content);
      console.log(`File written to ${fullPath}`);
    } catch (error) {
      console.error("Failed to write file:", error);
    }
  }, 300));
    ptyProcess.onExit((exitCode, signal) => {
      
      console.log(`PTY process exited with code: ${exitCode}, signal: ${signal}`);
  });

    }

