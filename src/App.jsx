import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toggleDarkMode } from './context/themeSlice'
import { loginSuccess } from './context/authSlice'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import OrdersSimple from './pages/OrdersSimple'
import OrdersTest from './pages/OrdersTest'
import OrdersFixed from './pages/OrdersFixed'
import OrdersMinimal from './pages/OrdersMinimal'
import CreateOrder from './pages/CreateOrder'
import Payments from './pages/Payments'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Customers from './pages/Customers'
import StaffManagement from './pages/StaffManagement'
import Subscriptions from './pages/Subscriptions'
import SpecialServices from './pages/SpecialServices'
import Wallet from './pages/Wallet'
import Invoices from './pages/Invoices'
import AIAnalytics from './pages/AIAnalytics'
import { USER_ROLES } from './utils/constants'

function App() {
  const { isAuthenticated, user, token } = useSelector((state) => state.auth)
  const { darkMode } = useSelector((state) => state.theme)
  const dispatch = useDispatch()
  
  // Restore authentication state on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser && !isAuthenticated) {
      try {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser && parsedUser.id && parsedUser.email && parsedUser.role) {
          dispatch(loginSuccess({ user: parsedUser, token: storedToken }))
        }
      } catch (error) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
  }, []) // Only run once on mount
  
  // Prevent auth state loss during navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isAuthenticated && user && token) {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isAuthenticated, user, token])

  useEffect(() => {
    // Initialize dark mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    if (savedDarkMode !== darkMode) {
      dispatch(toggleDarkMode())
    }
    
    // Apply dark mode class to document
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode, dispatch])

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<OrdersFixed />} />
        <Route 
          path="/orders/create" 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER, USER_ROLES.ADMIN]}>
              <CreateOrder />
            </ProtectedRoute>
          } 
        />
        <Route path="/payments" element={<Payments />} />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <Reports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/customers" 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <Customers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/staff" 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <StaffManagement />
            </ProtectedRoute>
          } 
        />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/special-services" element={<SpecialServices />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route 
          path="/ai-analytics" 
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <AIAnalytics />
            </ProtectedRoute>
          } 
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default App