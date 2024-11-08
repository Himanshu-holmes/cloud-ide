import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import { getCookie } from './cookie';

const PrivateRoutes = () => {
  
  const isLoggedIn =  useSelector((state) => state.authReducer.isLoggedIn);
  console.log("private route",isLoggedIn)
  console.log("cookie",document.cookie)
 
  
  const token = getCookie("token")
  console.log(token)

  return (
    (isLoggedIn || token) ? <Outlet /> : <Navigate to='/login' />
  );
}

export default PrivateRoutes;
