import { ModeToggle } from '@/components/mode-toggle'
import { getCookie } from '@/lib/cookie';
import { cn } from '@/lib/utils'
import React from 'react'
import { useSelector } from 'react-redux';

export const Navbar = ({className}) => {
  const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
  const token = getCookie("token");
  const username = getCookie("username");
  console.log("isLoggedIn obj",isLoggedIn)
  return (
    <div className={cn(`flex justify-between items-center p-10`,className)}>
        <div className={cn(' p-2 rounded-sm ', (isLoggedIn || token) ?"bg-green-700":"bg-orange-700")}>CLOUD-IDE</div>
        <div className='min-w-20'>
        <ModeToggle />
        </div>
        <div className='flex gap-4 items-center'>
          {
            (isLoggedIn || token ) ? (<>
              <div>Home</div>
              <div>Editor</div>
              <div className='border border-gray-400 p-2 '>{username}</div>
              </>

            ):(<></>)
          }
        </div>
    </div>
  )
}



