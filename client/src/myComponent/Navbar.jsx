import { ModeToggle } from '@/components/mode-toggle'
import { cn } from '@/lib/utils'
import React from 'react'
import { useSelector } from 'react-redux';

export const Navbar = ({className}) => {
  const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);
  console.log("isLoggedIn obj",isLoggedIn)
  return (
    <div className={cn(`flex justify-between items-center`,className)}>
        <div className={cn(' p-2 rounded-sm ', isLoggedIn ?"bg-green-700":"bg-orange-700")}>CLOUD-IDE</div>
        <div className='min-w-20'>
        <ModeToggle />
        </div>
        <div className='flex gap-4'>
          {
            isLoggedIn ? (<>
              <div>Home</div>
              <div>Editor</div>
              </>

            ):(<></>)
          }
        </div>
    </div>
  )
}
