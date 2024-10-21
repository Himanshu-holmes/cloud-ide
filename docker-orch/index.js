const express = require("express")
const Docker = require("dockerode");
const passport = require("passport");
const { executeQuery } = require("./dbConnect");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("./constant"); 
const jwt = require("jsonwebtoken");
const { formattedResponse } = require("./utils");


const app = express();
app.use(express.json())
const docker = new Docker();

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
  
      return res.status(200).json({
        message: "Login successful",
        token: token, 
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  });


function authenticateToken(req, res, next) {
    const bearerToken = req.headers['authorization'];
  
    if (!bearerToken) return res.sendStatus(401); 
    let token = bearerToken.split(" ")[1]
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); 
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
const PORT_TO_CONTAINER = {};
const CONTAINER_TO_PORT = {};

app.post("/container",authenticateToken,async(req,res)=>{
    const availablePort = (()=>{
        for(let i=8000; i<8999; i++){
           if(CONTAINER_TO_PORT[i]) continue;
           return `${i}`;
        }
        return null;
    })();
    if (!availablePort) {
        return res.status(500).json({ message: "No available ports" });
    }
    // lets first check if there is any container exists in db
    let query = `select docker_id from user where email = ?`;
    if(req.user){
        let response =await executeQuery(query,[req.user?.email]);
        if(response.status !== 200){
            return res.json({
                message:response.message
            })
        };
        if (response.data.length > 0 ){
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
  
    const {image} = req.body;
    await docker.pull(image);
    const container = await docker.createContainer({
        Image:image,
        Cmd:"sh",
        Tty:true,
        AttachStdout:true,
        HostConfig:{
            PortBindings:{
                "80/tcp":[{HostPort:availablePort}]
            }
        }
    });
 await container.start();
 PORT_TO_CONTAINER[availablePort] = container.id;
 CONTAINER_TO_PORT[container.id] = availablePort;

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


  return res.json({
    container:container.id
  })
})
const port = 3000
app.listen(port,()=>{
    console.log(`app is listening on ${port}`)
})