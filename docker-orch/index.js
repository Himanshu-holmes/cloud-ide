const express = require("express")
const Docker = require("dockerode");
const passport = require("passport");
const { executeQuery } = require("./dbConnect");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("./constant"); 
const jwt = require("jsonwebtoken");
const { formattedResponse } = require("./utils");
const { containerizeServerRepo } = require("./controllers/container.controller");
const { IMAGE_NAME } = require("../server/src/constant");
const { PORT_TO_CONTAINER, CONTAINER_TO_PORT } = require("../containerMapping");
const cors = require("cors")
const cookieParser = require("cookie-parser");
const { createProxyMiddleware } = require('http-proxy-middleware');




const app = express();

app.use(express.json())
app.use(cors({
  origin:["http://localhost:5173"],
  credentials:true
}))
app.use(cookieParser());
const docker = new Docker(
  {
      socketPath: "/home/abhi/.docker/desktop/docker.sock"
  }
);

app.post("/register",async(req,res)=>{
    const {email,password} = req.body;
    
  
    let query  = `select email from user where email = ? `
    const isUserExist =  await executeQuery(query,email);

    if (isUserExist.status === 200 && isUserExist.data.length >0){
        return res.status(404).json({message:"user already exists"})
    }
    let hashedPassword = bcrypt.hashSync(password,10);
    let createUserQuery = `
      insert into user (email,password) value (?,?)
    `
    let createUser = await executeQuery(createUserQuery,[email,hashedPassword]);
    if (createUser.status !== 200) {
        return res.status(404).json({message:createUser.message})
    }

    return res.status(200).json({message:"user created successfully"})
    
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
    
      let query = `SELECT email, password FROM user WHERE email = ?`;
      let result = await executeQuery(query, [email]);
  
     
      if (result.status !== 200 || result.data.length === 0) {
        return res.status(400).json({
          message: "User not found or query failed",
        });
      }
  
      let hashedPassword = result.data[0].password;
  
     
      let isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
  
      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: "Password incorrect",
        });
      }
  
     
      const token = jwt.sign(
        { email: result.data[0].email }, 
        JWT_SECRET, 
        { expiresIn: JWT_EXPIRES_IN }
      );
  
      return res.status(200).cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
        httpOnly: true, // Makes the cookie accessible only to the web server
        secure: true, // Ensures it's only sent over HTTPS in production
        sameSite: "none" // Controls cross-site request behavior
      })
      .json({
        message: "Login successful",
        token: token, 
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

  if(!token) return  res.redirect('/login');

  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return  res.redirect('/login');
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


app.post("/container",authenticateToken,async(req,res)=>{

 await containerizeServerRepo(docker);




    // lets first check if there is any container exists in db
    let query = `select docker_id from user where email = ?`;
    if(req.user){
        let response =await executeQuery(query,[req.user?.email]);
        if(response.status !== 200){
            return res.json({
                message:response.message
            })
        };
        if (response.data[0]?.docker_id){
          console.log(response.data)
            console.log("length",response.data.length)
          let containerId = response.data[0].docker_id;
          let container = await docker.getContainer(containerId);
          
          container.inspect(function (err, data) {
            console.log("inspect",data);
            if(data.State.Status !== "running"){
                container.start()
            }
          });
        //   container.start(function (err, data) {
        //     console.log(data);
        //   });
           res.json({
            message:"container already exist with this user"
          })
          return
        }
    }
  console.log(CONTAINER_TO_PORT);
//  see available ports
    const availablePort = (()=>{
        for(let i=8001; i<8999; i++){
           if(PORT_TO_CONTAINER[i])
           {continue}
           else{

             return `${i}`;
           }
        }
        return null;
    })();
    if (!availablePort) {
        return res.status(500).json({ message: "No available ports" });
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

  query = `update user set docker_id = ? where email = ?`
 let storeContainerIdResponse = await executeQuery(query,[container.id,req.user?.email]);

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
    sameSite: "none" // Controls cross-site request behavior
  })
  .json({
    container:container.id
  })
});


app.use('/:containerId/', (req, res, next) => {
  const containerId = req.params.containerId;
  const port = CONTAINER_TO_PORT[containerId];

  // If containerId has no associated port, skip this middleware
  if (!port) {
      return res.status(404).send('Container ID not found');
  }

  // Proxy the request to the target port
  const proxy = createProxyMiddleware({
      target: `http://localhost:${port}`,
      changeOrigin: true,
      pathRewrite: { [`^/${containerId}`]: '' }, // Remove containerId from the path if needed
  });
  
  // Execute the proxy middleware
  proxy(req, res, next);
});

const port = 3005
app.listen(port,()=>{
    console.log(`app is listening on ${port}`)
})