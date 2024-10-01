import { Button } from '@/components/ui/button';
import { ACTIONS } from '@/constants';
import CodeEditor from '@/myComponent/codeArea/CodeEditor';
import { initSocket } from '@/socket';
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';


const RepoCode = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [clients,setClients] = useState([
    
  ])


  useEffect(() => {
    if(!location.state) return 
    console.log("current socket",socketRef.current);
  const init = async () => {
    socketRef.current = await initSocket();
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
      username: location.state?.username
    })
    // listening for joined event
    socketRef.current.on(ACTIONS.JOINED,({ clients,
      username,
      socketId})=>{
        if(username !== location.state?.username){
          toast.success(`${username} joined the room`);
          console.log(`$username joined`)
        }
        console.log("socket init ran")
        setClients(clients)
        console.log("syncing code",codeRef.current)
        
        socketRef.current.emit(ACTIONS.SYNC_CODE,{codes:codeRef.current,
          socketId
        })
      });
      
      

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
};

  }, []);

  if(!location.state){
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

  return (
    <div className="resizable-layout flex h-[100vh]">
      <div className="file-explorer bg-[#03152b] border-r-2 border-solid border-[#ccc] overflow-auto p-2" style={{ width: leftWidth }}>
        <h2>Files</h2>
        <div>
          {/* Your file explorer content goes here */}
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
        {/* Your file explorer content goes here */}
        <Button className="dark:bg-slate-300 p-4" onClick={(e)=>{
          if(!roomId) return
          navigator.clipboard.writeText(roomId)
          .then(()=>{
            toast.success('Room ID copied to clipboard')
          })
          .catch(()=>{
            toast.error('Failed to copy Room ID')
          })
        }}>
          Copy Room ID
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
        {/* <h2>Editor</h2> */}
        {/* Your editor content goes here */}
        <CodeEditor socketRef={socketRef} roomId={roomId} onCodeChange={
          (code)=>{
            codeRef.current = code;
          }
        }/>
      </div>
      <div className="resizer cursor-ew-resize w-5 bg-transparent" onMouseDown={handleMouseDownRight} />
      <div className="terminal bg-[#03152b] overflow-auto" style={{ width: rightWidth }}>
        <h2>Terminal</h2>
        {/* Your terminal content goes here */}
      </div>
    </div>
  );
};

export default RepoCode;
