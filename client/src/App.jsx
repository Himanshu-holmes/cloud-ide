import { useState } from 'react'
import { Home } from './pages/Home'
import { ThemeProvider } from './components/theme-provider'
import { ModeToggle } from './components/mode-toggle'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes } from 'react-router-dom'
import { Navbar } from './myComponent/Navbar'
import { Toaster } from 'react-hot-toast'
import RepoCode from './pages/RepoCode'
import TerminalComp from './myComponent/terminal/Terminal'
import { Login } from './pages/Login'
import { Container } from './pages/Container'
import PrivateRoutes from './lib/PrivateRoute'



function App() {


  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/c" element={<Container />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoutes/>}>
        
        <Route path="/" element={<Home />} />
        <Route path='/editor/:roomId' element={<RepoCode/>} />
        <Route path="terminal" element={<TerminalComp />} />
             
          </Route>

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
