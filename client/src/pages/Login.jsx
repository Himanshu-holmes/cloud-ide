


import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { setLogIn } from "@/redux/slice/authSlice"

export function Login() {
    const [email,setEmail] = React.useState("");
    const [password,setPassword] = React.useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleSubmit = async(event) =>{
        event.preventDefault()
  try {
      const response = await fetch("http://localhost:3005/login",{
          method:"POST",
          headers: {
              "Content-Type": "application/json",
            },
          body:JSON.stringify({
              email: email,
              password: password,
            }),
          credentials:"include"
      });
      if(response.ok){
        toast.success("logged in successfully");
        dispatch(setLogIn());
        
        navigate("/");

      
      }else{
        toast.error("something went wrong")
      }
      console.log(response)
  } catch (error) {
    toast.error(error.message)
  }
    }
  return (
    <div className="flex justify-center items-center">
    <Card className="w-[350px] dark:bg-slate-200 dark:text-black">
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
        <CardDescription>Login Here</CardDescription>
      </CardHeader>
        <form  onSubmit={handleSubmit}>
      <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email" >email</Label>
              <Input id="email" type="email" placeholder="your email" value={email} onChange={(e)=>{
                setEmail(e.target.value)
              }} />
            </div>
            <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="password" value={password} onChange={(e)=>{
                setPassword(e.target.value)
              }}/>
            </div>
          </div>
      
      </CardContent>
      <CardFooter className="flex justify-between dark:text-white">
        <Button  type="submit" variant="outline">Login</Button>
        
       
      </CardFooter>
     
    </form>
    </Card>
    </div>
  )
}
