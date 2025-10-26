import { createSlice } from '@reduxjs/toolkit'

const getInitialAuthState = () => {
  try {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      const parsedUser = JSON.parse(user)
      if (parsedUser && parsedUser.id && parsedUser.email && parsedUser.role) {
        // Set a flag to indicate this is a restored session
        sessionStorage.setItem('sessionRestored', 'true')
        return {
          user: parsedUser,
          token: token,
          isAuthenticated: true,
          loading: false,
        }
      }
    }
    
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    }
  } catch (error) {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    }
  }
}

const initialState = getInitialAuthState()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      
      // Ensure localStorage and sessionStorage are set
      try {
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        localStorage.setItem('token', action.payload.token)
        sessionStorage.setItem('currentSession', 'active')
      } catch (error) {
        console.error('Failed to save auth data:', error)
      }
    },
    loginFailure: (state) => {
      state.loading = false
      state.user = null
      state.token = null
      state.isAuthenticated = false
      // Clear localStorage on explicit failure
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    logout: (state) => {
      console.log('Logging out user')
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions
export default authSlice.reducer