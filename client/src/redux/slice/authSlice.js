

//  is in test mode

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
    const response = await fetch('http://localhost:3005/logout', {
      method: 'POST',
      credentials: 'include', 
    });
  
    if (!response.ok) {
      throw new Error('Failed to log out');
    }
  
   
    return await response.json();
})

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    
    setLogIn: state => {
        state.isLoggedIn = true;
    }
  },
  extraReducers:(builder)=>{
    builder
    .addCase(logoutUser.fulfilled, (state) => {
      state.isLoggedIn = false; 
      toast.success('Successfully logged out');
      window.location.href = '/login'; 
    })
    .addCase(logoutUser.rejected, (state, action) => {
      toast.error(action.error.message); 
    });
  }
})



// Action creators are generated for each case reducer function
export const { setLogIn } = authSlice.actions;



export default authSlice.reducer