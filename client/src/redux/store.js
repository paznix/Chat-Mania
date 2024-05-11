import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import audioCallReducer from './audioCall'
import authReducer from './auth'


export const store = configureStore({
  reducer: {
        user : userReducer,
        audioCall: audioCallReducer,
        auth: authReducer
  },
})