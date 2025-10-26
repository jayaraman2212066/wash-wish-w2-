import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { loginStart, loginSuccess, loginFailure } from '../context/authSlice'
import { dbService } from '../utils/databaseService'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const { loading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())

    try {
      // Demo credentials handling
      const demoUsers = {
        'admin@washwish.com': {
          id: 'admin_001',
          name: 'Admin User',
          email: 'admin@washwish.com',
          role: 'admin',
          phone: '+91-9876543210'
        },
        'staff@washwish.com': {
          id: 'staff_001', 
          name: 'Staff Member',
          email: 'staff@washwish.com',
          role: 'staff',
          phone: '+91-9876543211'
        },
        'customer@washwish.com': {
          id: 'customer_001',
          name: 'Customer User', 
          email: 'customer@washwish.com',
          role: 'customer',
          phone: '+91-9876543212'
        }
      }

      const demoPasswords = {
        'admin@washwish.com': 'admin123',
        'staff@washwish.com': 'staff123', 
        'customer@washwish.com': 'customer123'
      }

      // Check demo users first
      if (demoUsers[formData.email] && demoPasswords[formData.email] === formData.password) {
        const user = demoUsers[formData.email]
        const token = `demo_token_${user.role}_${Date.now()}`
        
        // Ensure localStorage is set before dispatching
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        
        dispatch(loginSuccess({ user, token }))
        toast.success(`Welcome ${user.name}! (${user.role.toUpperCase()})`)
        
        // Small delay to ensure state is updated
        setTimeout(() => {
          navigate('/dashboard')
        }, 100)
        return
      }
      
      // Check users in database
      const user = await dbService.getVerifiedUser(formData.email, formData.password)
      
      if (user) {
        const token = `user_token_${user.role}_${Date.now()}`
        
        // Ensure localStorage is set before dispatching
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        }))
        localStorage.setItem('token', token)
        
        dispatch(loginSuccess({ 
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone
          }, 
          token 
        }))
        toast.success(`Welcome back ${user.name}!`)
        
        setTimeout(() => {
          navigate('/dashboard')
        }, 100)
        return
      }

      // If no user found, show error
      dispatch(loginFailure())
      toast.error('Invalid credentials. Try demo accounts below.')
    } catch (error) {
      console.error('Login error:', error)
      dispatch(loginFailure())
      toast.error('Login failed. Please check your credentials and try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to WashWish
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
        
        {/* Admin Credentials Display */}
        <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
          <div className="text-center">
            <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-4">
              🔑 Admin Access
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-red-300 dark:border-red-700">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Email:</div>
              <div className="text-lg font-mono font-bold text-red-600 dark:text-red-400 mb-3">
                admin@washwish.com
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Password:</div>
              <div className="text-lg font-mono font-bold text-red-600 dark:text-red-400">
                admin123
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Login Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setFormData({email: 'admin@washwish.com', password: 'admin123'})}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            🚀 Use Admin Credentials
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login