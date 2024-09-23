import { useState } from 'react'
import { Home } from './pages/Home'
import { ThemeProvider } from './components/theme-provider'
import { ModeToggle } from './components/mode-toggle'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes } from 'react-router-dom'
import { Navbar } from './myComponent/Navbar'
import { Toaster } from 'react-hot-toast'
import RepoCode from './pages/RepoCode'



function App() {
  const [count, setCount] = useState(0)

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
          
    
  
        <Route path="/" element={<Home />} />
        <Route path='/editor/:id' element={<RepoCode/>} />
  
 
      </>
    )
  )

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster position='top-right' toastOptions={
        {
          success: {
            style: {
              background: 'green',
              color: 'white',
            }
          },
          error: {
            style: {
              background: 'red',
              color: 'white',
            }
          }
        }
      }/>
      <div className='m-2'>
      <Navbar className={"p-3"} />

 <RouterProvider router={router}/>
 </div>
 </ThemeProvider>
  )
  
}

export default App
