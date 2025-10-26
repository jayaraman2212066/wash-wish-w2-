import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, Package, CreditCard, BarChart3, Settings, 
  LogOut, Menu, X, Moon, Sun, User, Users,
  Sparkles, Wallet as WalletIcon, FileText, Calendar
} from 'lucide-react'
import { logout, loginSuccess } from '../context/authSlice'
import { toggleDarkMode } from '../context/themeSlice'
import { USER_ROLES } from '../utils/constants'
import DynamicBackground from './DynamicBackground'
import ChatbotWidget from './ChatbotWidget'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { darkMode } = useSelector((state) => state.theme)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  
  // Ensure session persistence in Layout
  useEffect(() => {
    const checkSession = () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedUser && !isAuthenticated) {
        try {
          const parsedUser = JSON.parse(storedUser)
          if (parsedUser && parsedUser.id) {
            dispatch(loginSuccess({ user: parsedUser, token: storedToken }))
          }
        } catch (error) {
          console.error('Session restore failed:', error)
        }
      }
    }
    
    checkSession()
  }, [isAuthenticated, dispatch])

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear all storage
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      sessionStorage.clear()
      dispatch(logout())
      navigate('/login')
    }
  }

  const getNavItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Orders', href: '/orders', icon: Package },
      { name: 'Special Services', href: '/special-services', icon: Sparkles },
      { name: 'Subscriptions', href: '/subscriptions', icon: Calendar },
      { name: 'Wallet', href: '/wallet', icon: WalletIcon },
      { name: 'Payments', href: '/payments', icon: CreditCard },
      { name: 'Invoices', href: '/invoices', icon: FileText },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]

    if (user?.role === USER_ROLES.ADMIN) {
      baseItems.splice(3, 0, 
        { name: 'Reports', href: '/reports', icon: BarChart3 },
        { name: 'AI Analytics', href: '/ai-analytics', icon: Sparkles },
        { name: 'Customers', href: '/customers', icon: User },
        { name: 'Staff', href: '/staff', icon: Users }
      )
    }

    return baseItems
  }

  const navItems = getNavItems()

  return (
    <>
      <DynamicBackground />
      <div className="app-overlay">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🧺</span>
              <h1 className="text-xl font-bold text-blue-600">WashWish</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🧺</span>
              <h1 className="text-xl font-bold text-blue-600">WashWish</h1>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow">
          <button
            className="px-4 text-gray-500 focus:outline-none lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 justify-between px-4">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Welcome, {user?.name}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{user?.role}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
      
      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
    </>
  )
}

export default Layout