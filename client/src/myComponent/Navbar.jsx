import { ModeToggle } from '@/components/mode-toggle'
import { cn } from '@/lib/utils'
import React from 'react'

export const Navbar = ({className}) => {
  return (
    <div className={cn(`flex justify-between items-center`,className)}>
        <div className='bg-orange-700 p-2 rounded-sm '>CLOUD-IDE</div>
        <div className='min-w-20'>
        <ModeToggle />
        </div>
        <div className='flex gap-4'>
            <div>Home</div>
            <div>Editor</div>
        </div>
    </div>
  )
}
