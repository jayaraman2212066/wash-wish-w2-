import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import orderSlice from './orderSlice'
import themeSlice from './themeSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    orders: orderSlice,
    theme: themeSlice,
  },
})