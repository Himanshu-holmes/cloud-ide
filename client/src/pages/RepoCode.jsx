import { Button } from '@/components/ui/button';
import { ACTIONS, inviteLink } from '@/constants';
import { getCookie } from '@/lib/cookie';

import CodeEditor from '@/myComponent/codeArea/CodeEditor';
import FileTree from '@/myComponent/fileArea/FileTree';

import TerminalComp from '@/myComponent/terminal/Terminal';
import { initSocket } from '@/socket';
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';


const RepoCode = () => {
  const token = getCookie("token");
  const curUsername = getCookie("username");
  
  // container
  const [containerDetails,setContainerDetails] = useState({containerId:null,
    port:null
  });
  // files
  const [fileTree,setFileTree] = useState({});
  const [selectedFile, setSelectedFile] = useState("");

  const getContainerDetails = async() =>{
   const isInvite = useUrlParam("invite");
const containerLink = isInvite ? `http://localhost:3005/container?roomId=${roomId}` : `http://localhost:3005/container`
    const response = await fetch(containerLink,{
      method:"POST",
      headers:{
        "content-type":"application/json",
      },
      body: JSON.stringify({

      }),
        credentials: 'include'
    });
    const result = await response.json();
    console.log("container",result.data)
    setContainerDetails({
      containerId:result.data.containerId,
      port:result.data.port
    })
  }
  useEffect(()=>{
    getContainerDetails()
  },[])
 
  const useUrlParam = (param) => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get(param);
  };
  const getFileTree = async()=>{
    if(!containerDetails.port)return
    
    const response = await fetch(`http://localhost:${containerDetails.port}/files`);
    const result = await response.json();
    console.log("filetree == ",result)
    setFileTree(result.tree)
  }

  useEffect(()=>{
    getFileTree();
    
  },[containerDetails])
  // code editor
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation()
 
  const navigate = useNavigate();
  const { roomId } = useParams();


  const [clients,setClients] = useState([
    
  ])


  useEffect(() => {
    console.log("username ==============================",curUsername)
    if(!curUsername) return 
    console.log("current socket",socketRef.current);
  const init = async () => {
    console.log("container details ===================",containerDetails)
    if(!containerDetails.containerId)return
    const isInviteLink = useUrlParam("invite")
    console.log("isInvite ======================>>>>>>>>>>>>>>>>>>>",isInviteLink)
    
    socketRef.current = await initSocket(containerDetails.containerId,isInviteLink);
    socketRef.current.on("connect_error",(err)=>handleError(err));
    socketRef.current.on("connect_failed",(err)=>handleError(err));
    console.log("socket connected",socketRef.current);

    function handleError(err){
      console.log("error",err);
      toast.error("Socket connection failed");
      navigate("/");
      
    }
    socketRef.current.emit(ACTIONS.JOIN,{
      roomId,
      username: curUsername
    })
    // listening for joined event
    socketRef.current.on(ACTIONS.JOINED,({ clients,
      username,
      socketId})=>{
        if(username !== curUsername){
          toast.success(`${username} joined the room`);
          console.log(`$username joined`)
        }
        console.log("socket clients ",clients)
        setClients(clients)
        console.log("syncing code",codeRef.current)
        
        socketRef.current.emit(ACTIONS.SYNC_CODE,{codes:codeRef.current,
          socketId
        })
      });
      
      socketRef.current.on("file:refresh",getFileTree)

      // Listening on disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
        toast.success(`${username} left the room `)
        setClients((prev)=>{
          return prev.filter(client => client.socketId !== socketId)
        })
      })
  };  
  init();

return () => {
  socketRef.current?.disconnect();
  socketRef.current?.off(ACTIONS.JOINED);
  socketRef.current?.off(ACTIONS.DISCONNECTED);
  socketRef.current?.off("file:refresh",getFileTree)
};

  }, [containerDetails.containerId]);

  if(!curUsername){
    return <Navigate to="/"/>
  }

 

  // this code is for resizing
  const [leftWidth, setLeftWidth] = useState(window.innerWidth/4); // Initial width for the left panel
  const [middleWidth, setMiddleWidth] = useState(window.innerWidth/2); // Initial width for the middle panel
  const [rightWidth, setRightWidth] = useState(window.innerWidth/4); // Initial width for the right panel
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  const handleMouseDownLeft = () => {
    setIsResizingLeft(true);
  };

  const handleMouseDownRight = () => {
    setIsResizingRight(true);
  };
 const [isSaved,setIsSaved] = useState(false)
// function handleSaved(c,s,setIsSaved){
//    function checkIsSaved(c,s){
//     return c===s
//    }
//    let res = checkIsSaved(c,s);
//    console.log("isSaved ============================================================ ",res)
//    setIsSaved(res)
// }
  const handleMouseMove = (event) => {
    if (isResizingLeft) {
      const newWidth = event.clientX;
      if (newWidth > 100 && newWidth < window.innerWidth - rightWidth - 10) {
        setLeftWidth(newWidth);
        setMiddleWidth(window.innerWidth - newWidth - rightWidth - 10);
      }
    }

    if (isResizingRight) {
      const newWidth = window.innerWidth - event.clientX;
      if (newWidth > 100 && newWidth < window.innerWidth - leftWidth - 10) {
        setRightWidth(newWidth);
        setMiddleWidth(window.innerWidth - leftWidth - newWidth - 10);
      }
    }
  };

  const handleMouseUp = () => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
  };

  useEffect(() => {
    if (isResizingLeft || isResizingRight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight]);
  console.log("container details",containerDetails)
  return (
    <div className="resizable-layout flex h-[100vh]">
      <div className="file-explorer bg-[#03152b] border-r-2 border-solid border-[#ccc] overflow-auto p-2" style={{ width: leftWidth }}>
        <h2>Files</h2>
        <div>
          {/* file explorer */}
          <FileTree tree={fileTree} setSelectedFile={setSelectedFile} />
        </div>
        <div className='clients '>
          {/* break and show ---------*/}
          <div>
            
            {Array.from({ length: Math.floor(leftWidth / 10) }, (_, index) => '-').join('')}
          
          
            </div>
          
          <h1 className=''>Online Users</h1>
          {clients.map(client=><div key={client.socketId} className='client text-green-700'>{client.username}</
            div>)}
        </div>
        {/* */}
        <Button className="dark:bg-slate-300 p-4" onClick={(e)=>{
          if(!roomId) return
          navigator.clipboard.writeText(`${inviteLink}/${roomId}?invite=true`)
          .then(()=>{
            toast.success('Invite Link copied to clipboard')
          })
          .catch(()=>{
            toast.error('Failed to copy Invite Link')
          })
        }}>
          Copy Invite Link
        </Button>
        <Button className="dark:bg-slate-300 p-4" onClick={(e)=>{
          navigate('/')
        }
        }>
          Leave Room
        </Button>
      </div>
      <div className="resizer cursor-ew-resize w-5 bg-transparent" onMouseDown={handleMouseDownLeft} />
      <div className="editor flex flex-col border-r-2 border-solid border-[#ccc] overflow-auto " style={{ width: middleWidth }}>
        <h2>Editor</h2>
        {selectedFile && <p>{selectedFile.replaceAll("/"," >  ")}</p>}
        {<p>{isSaved ? "Saved":"Unsaved"}</p>}
        {/* editor  */}
        <CodeEditor containerDetails={containerDetails}  setIsSaved={setIsSaved} isSaved={isSaved} selectedFile={selectedFile}  socketRef={socketRef} roomId={roomId} onCodeChange={
          (code)=>{
            codeRef.current = code;
          }               
        }/>
      </div>
      <div className="resizer cursor-ew-resize w-5 bg-transparent overflow-hidden" onMouseDown={handleMouseDownRight} />
      <div className="terminal bg-[#03152b] overflow-hidden" style={{ width: rightWidth }}>
        <h2>Terminal</h2>
        {/* terminal*/}
        <TerminalComp containerDetails={containerDetails}/>
      </div>
    </div>
  );
};

export default RepoCode;
