const express = require('express');
const fs = require('fs/promises');
const {  CORS_ORIGIN } = require('./constant');

const app = express();
const cors = require('cors');

let {count} = require('./constant');
const cookieParser = require('cookie-parser');
const logger = require('./controllers/log');
const { generateFileTree } = require('./controllers/fileController/file.controller.js');



app.use(cors({
    origin:["http://localhost:3005","http://localhost:5173"],
    credentials:true
}));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(cookieParser())

const userRequest= {};
// app.use((req,res,next)=>{
//   logger(userRequest,req.url,req.method,req.ip);
//     next();
// })

// routes ===========================
app.get('/',(req,res)=>{
    count++
    console.log("count",count);
    res.send("I am working!!!!!")
})
// 
app.use("/api/",require("./routes/user.routes"));

app.get("/files",async (req,res)=>{
    let fileTree = await generateFileTree("./user")
    res.json({tree:fileTree})
});
app.get("/file/content",async(req,res)=>{
    const path = req.query.path;
    console.log("path",path)
      let data =  await fs.readFile(`./user${path}`,"utf-8");
      res.json({content:data})
})


module.exports = app