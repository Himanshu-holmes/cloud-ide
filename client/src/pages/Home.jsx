
import React from 'react'
import { v4 as uuid }  from 'uuid'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
  


export const Home = () => {
    const [roomId, setRoomId] = React.useState('')
    const [username, setUsername] = React.useState('')
    const navigate = useNavigate()
    const createRoom = (e) => {
        e.preventDefault();
    const roomId = uuid()
    console.log(roomId)
    setRoomId(roomId)
    toast.success('Room created successfully')
   
    // return roomId
    };
    const handleJoin = (e) => {
        e.preventDefault();
        if(!roomId || !username) {
            toast.error('Please enter username and room id')
            return
        }
        navigate(`/editor/${roomId}`)
    }
  return (
    <div className='flex flex-col justify-center items-center min-h-screen'>
      <Card className={cn(`w-96`)}>
  <CardHeader>
    <CardTitle>Cloud-ide</CardTitle>
    <CardDescription className={cn(`h-2`)}>{roomId}</CardDescription>
  </CardHeader>
  <CardContent className={cn(`flex flex-col gap-4`)}>
    <Input placeholder="Room ID" value={roomId} onChange={(e)=>{
        setRoomId(e.target.value)
    }}/>
    <Input placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
  </CardContent>
  <CardFooter className={cn(`flex justify-between`)}>
   <Button className={cn(`bg-green-700 font-bold dark:text-white dark:hover:text-black`)} onClick={handleJoin}>Join</Button>
    <Button className={cn(`bg-blue-700 font-bold dark:text-white dark:hover:text-black`)} onClick={createRoom}>Create Room</Button>
  </CardFooter>
</Card>

    </div>
  )
}


