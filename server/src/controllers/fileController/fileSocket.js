    const fs = require("fs/promises");
    const path = require("path")

    module.exports =(io,socket)=>{
        socket.on("file:change",async({content})=>{
            console.log(process.cwd());                         
            // await fs.writeFile(`./user`,content)
        });
    }