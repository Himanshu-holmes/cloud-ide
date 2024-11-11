const express = require("express")
const Docker = require("dockerode");
const passport = require("passport");
const { executeQuery } = require("./dbConnect");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("./constant"); 
const jwt = require("jsonwebtoken");
const { formattedResponse, sendResponse } = require("./utils");
const { containerizeServerRepo } = require("./controllers/container.controller");
const { IMAGE_NAME } = require("./constant")
const { PORT_TO_CONTAINER, CONTAINER_TO_PORT } = require("../containerMapping");
const cors = require("cors")
const cookieParser = require("cookie-parser");
const httpProxy = require('http-proxy');
const { dbSetup } = require("./controllers/dbSetup");
const { v4: uuidv4 } = require('uuid');


const http = require('http');

const { error } = require("console");
const { insertRoomId } = require("./models/rooms.model");








const app = express();

const server = http.createServer(app);









app.use(express.json())
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));
app.options('*', cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(cookieParser());

const docker = new Docker(
  
);


app.post("/register",async(req,res)=>{
    const {username,email,password} = req.body;
    
    if(!username||!email||!password){
   return sendResponse(res,400,null,"username,email and password is required")
    }
  
    let query  = `select email,username from users where email = ? OR username = ?`;
    const isUserExist =  await executeQuery(query,email);

    if (isUserExist.status === 200 && isUserExist.data.length >0){
        return res.status(404).json({message:"user already exists "})
    }
    let hashedPassword = bcrypt.hashSync(password,10);
    let createUserQuery = `
      insert into users (username,email,password) value (?,?,?)
    `
    let createUser = await executeQuery(createUserQuery,[username,email,hashedPassword]);
    if (createUser.status !== 200) {
        return sendResponse(res,404,null,createUser.message)
        //  res.status(404).json({message:createUser.message})
    }

    return sendResponse(res,200,null,"user created successfully")
    //  res.status(200).json({message:"user created successfully"})
    
});



app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
    
      let query = `SELECT users.id,username, email, password,room_name FROM users
      left join rooms on users.id = rooms.creator_id
      WHERE email = ?`;
      let result = await executeQuery(query, [email]);
  
     
      if (result.status !== 200 || result.data.length === 0) {
        return res.status(400).json({
          message: "User not found or query failed",
        });
      }
  
      let hashedPassword = result.data[0].password;
  
     
      let isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
  
      if (!isPasswordCorrect) {
        return sendResponse(res,401,null,"Password incorrect")
        //  res.status(401).json({
        //   message: "Password incorrect",
        // });
      }
    let {room_name,id} = result.data[0]
    if(!room_name){
      room_name = uuidv4();
      let insertRoomResponse = await insertRoomId(id,room_name);
      if(insertRoomResponse.status!==200){
        return sendResponse(res,400,null,insertRoomResponse.message)
      }
    }
     const username = result.data[0].username
     
      const token = jwt.sign(
        { email: result.data[0].email,
          username
         }, 
        JWT_SECRET, 
        { expiresIn: JWT_EXPIRES_IN }
      );
  
      return res.status(200).cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
        httpOnly: false, // Makes the cookie accessible only to the web server
        secure: true, // Ensures it's only sent over HTTPS in production
        sameSite: "none", // Controls cross-site request behavior
        path:"/"
      })
      .cookie("username",username,{
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
        httpOnly: false, // Makes the cookie accessible only to the web server
        secure: true, // Ensures it's only sent over HTTPS in production
        sameSite: "none", // Controls cross-site request behavior
        path:"/"
      })
      .json({
        message: "Login successful",
         roomId:room_name,
        
      })
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  });

app.post('/logout', (req, res) => {
    res.clearCookie('token'); 
    res.redirect('/login');
  });

function authenticateToken(req, res, next) {
  // using bearer token
    // const bearerToken = req.headers['authorization'];
    // if (!bearerToken) return res.sendStatus(401); 
    // let token = bearerToken.split(" ")[1]

  // using cookies
  const token = req.cookies.token;

  // if(!token) return  res.redirect('/login');
if(!token) return   res.sendStatus(401); 
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      // if (err) return  res.redirect('/login');
      console.log(user)
      req.user = user; 
      next();
    });
  }
  

async function start(){
    try {
       const listContainer = await docker.listContainers({
        all: true
       }) 
       console.log(listContainer)
        
        // const container = await docker.createContainer({
        //     Image:"ubuntu",
        //     Cmd:"bash"
        // })
        // console.log(container)
    } catch (error) {
        console.log(error);
    }
}
// start()

app.get("/dbSetup",
  // authenticateToken,
  async(req,res)=>{
    let response = await dbSetup();
    if(response.status!==200){
      return sendResponse(res,400,null,response.message)
      // res.status(400).json({
      //   message:response.message
      // })
    }
    return sendResponse(res,200,response,"successs")
    // res.status(200).json({
    //   response
    // })
})
app.post("/container",authenticateToken,async(req,res)=>{
 const roomId = req.query.roomId
 if(roomId){
  let query = `SELECT docker_id FROM rooms
left join users on rooms.creator_id = users.id
where rooms.room_name = ?`
const result = await executeQuery(query,[roomId])
if(result.status !== 200)return sendResponse(res,400,null,result.message);
let containerId = result.data[0].docker_id
sendResponse(res,200,{containerId,
  port:CONTAINER_TO_PORT[containerId]
 },"container already exist with this user")
 return


 }
 console.log("roomId",roomId); 
 await containerizeServerRepo(docker);

 const getAllPorts  = await executeQuery(`SELECT DISTINCT docker_id,port FROM users;`);

 if(getAllPorts.status !== 200){
   return sendResponse(res,400,null,getAllPorts.message)
 //    res.status(400).json({
 //     message:getAllPorts.message
 // })
 };

 getAllPorts.data.map((item)=>{
   CONTAINER_TO_PORT[item.docker_id] = item.port;
   PORT_TO_CONTAINER[item.port] = item.docker_id
 })
 



    // lets first check if there is any container exists in db
    let query = `select docker_id from users where email = ?`;
    if(req.user){
        let response =await executeQuery(query,[req.user?.email]);
        if(response.status !== 200){
            return sendResponse(res,400,null,response.message)
            // res.json({
            //     message:response.message
            // })
        };
        if (response.data[0]?.docker_id){
          console.log(response.data)
            console.log("length",response.data.length)
          let containerId = response.data[0].docker_id;
          let container = await docker.getContainer(containerId);
          
          container.inspect(function (err, data) {
            // console.log("inspect",data);
            if(data.State.Status !== "running"){
                container.start()
            }
          });
        //   container.start(function (err, data) {
        //     console.log(data);
        //   });
         sendResponse(res,200,{containerId,
          port:CONTAINER_TO_PORT[containerId]
         },"container already exist with this user")
          return
        }
    }
   

  console.log(CONTAINER_TO_PORT);
//  see available ports
    const availablePort = (()=>{
        for(let i=8000; i<8999; i++){
           if(PORT_TO_CONTAINER[i])
           {continue}
           else{

             return `${i}`;
           }
        }
        return null;
    })();
    if (!availablePort) {
        return sendResponse(res,500,null, "No available ports")
        // res.status(500).json({ message: "No available ports" });
    }
  
  console.log("available port ::", availablePort)
  
    const container = await docker.createContainer({
        Image:IMAGE_NAME,
        Cmd: ['node', 'server.js'],
        Tty:true,
        AttachStdout:true,
        HostConfig:{
            PortBindings:{
                "3000/tcp":[{HostPort:availablePort}]
            }
        }
    });
 await container.start();
 PORT_TO_CONTAINER[availablePort] = container.id;
 CONTAINER_TO_PORT[container.id] = availablePort;
 console.log(PORT_TO_CONTAINER);
 console.log(CONTAINER_TO_PORT);

  query = `update users set docker_id = ? , port = ? where email = ?`
 let storeContainerIdResponse = await executeQuery(query,[container.id,availablePort,req.user?.email]);

 if(storeContainerIdResponse.status !== 200){

container.remove(function (err, data) {
    console.log(data);
  });

  return res.json({
    message:storeContainerIdResponse.message
  })
 }


  return res
  .cookie("container_id", container.id, {
    expires: new Date(Date.now() + 730 *24 * 60 * 60 * 1000), // 1 day from now
    httpOnly: false, // Makes the cookie accessible only to the web server
    secure: true, // Ensures it's only sent over HTTPS in production
    sameSite: "none", // Controls cross-site request behavior
    path:"/"
  })
  .json({
    containerId:container.id,
    port:CONTAINER_TO_PORT[container.id]
  })
});

// app.use("/file",authenticateToken,(req,res)=>{

// })


app.use("/:containerId/file/content",authenticateToken,(req,res)=>{
  console.log(req.user.username)
  const containerId = req.params.containerId;
    const port = CONTAINER_TO_PORT[containerId];
    const filePath = req.query.path
  
  if(!port) return res.status(404).send("Container not found")
    const proxy = httpProxy.createProxyServer({
      target: `http://localhost:${port}`,
      ws: true,
    });
  //  upgrade this proxy to websocket
  proxy.web(req, res, { target: `http://localhost:${port}/file/content/` ,
    ws:true,
    changeOrigin:true,
    
  }, (err) => {
    console.error("Proxy Error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Proxy Error");
  });
    
    
})


app.use('/c/:containerId', (req, res, next) => {
  try {
    const containerId = req.params.containerId;
    const port = CONTAINER_TO_PORT[containerId];
  
    // If containerId has no associated port, skip this middleware
    if (!port) {
        return res.status(404).send('Container ID not found');
    }
  //  return res.send("hi")
    // Proxy the request to the target port
    const proxy = httpProxy.createProxyServer({
      target: `http://localhost:${port}`,
      ws: true,
    });
  //  upgrade this proxy to websocket
  proxy.web(req, res, { target: `http://localhost:${port}/` ,
    ws:true,
    changeOrigin:true,
    
  }, (err) => {
    console.error("Proxy Error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Proxy Error");
  });
    
    
  } catch (error) {
    console.log(error)
  
  }
});


// Set up a WebSocket proxy for Socket.IO connections
// 
// WebSocket Upgrade Handling


server.on('upgrade', (req, socket, head) => {
  

  const urlParams = new URL(`http://l`+req.url);
  // console.log("url",urlParams)
const containerId = urlParams.searchParams.get("id");
const isInviteLink = urlParams.searchParams.get("invite");

console.log("isInviteLink",isInviteLink)
const port = CONTAINER_TO_PORT[containerId];

  if(port ){
    const proxy = httpProxy.createProxyServer({
      target: `http://localhost:${port}`,
      ws: true,
    });

    proxy.ws(req, socket, head);
  }else {
    socket.write('HTTP/1.1 404 something wrong Not Found\r\n\r\n',(err)=>{
      console.log(err)
    });
    socket.end();
  }

});


server.listen(3005, () => {
  console.log('listening on *:3005');
});



