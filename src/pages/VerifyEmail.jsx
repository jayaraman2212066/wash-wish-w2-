import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import { dbService } from '../utils/databaseService'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('')
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link')
      return
    }

    verifyEmail()
  }, [token])

  const verifyEmail = async () => {
    try {
      const email = searchParams.get('email')
      
      if (!email) {
        setStatus('error')
        setMessage('Invalid verification link - missing email parameter')
        return
      }
      
      // Get pending user from database
      const pendingUser = await dbService.getPendingUser(token, email)
      
      if (!pendingUser) {
        setStatus('error')
        setMessage('Invalid or expired verification link. Please register again.')
        return
      }
      
      // Activate the user (move from pending to verified)
      const verifiedUser = await dbService.activateUser(pendingUser)
      
      setStatus('success')
      setMessage(`Welcome ${verifiedUser.name}! Your account has been successfully verified and you can now login.`)
      
    } catch (error) {
      console.error('Email verification error:', error)
      setStatus('error')
      setMessage('Email verification failed. Please try again or contact support.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center">
            {status === 'verifying' && (
              <Loader className="h-12 w-12 text-blue-600 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-12 w-12 text-green-600" />
            )}
            {status === 'error' && (
              <XCircle className="h-12 w-12 text-red-600" />
            )}
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {status === 'verifying' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h2>
          
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {message}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {status === 'success' && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
              <div className="text-sm text-green-700 dark:text-green-300">
                <p className="font-medium">Welcome to WashWish!</p>
                <p className="mt-1">Your account has been successfully verified. You can now login and start using our laundry services.</p>
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="text-sm text-red-700 dark:text-red-300">
                <p className="font-medium">Verification Failed</p>
                <p className="mt-1">The verification link may be invalid or expired. Please try registering again or contact support.</p>
              </div>
            </div>
          )}
          
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Login
            </Link>
            
            {status === 'error' && (
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register Again
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail