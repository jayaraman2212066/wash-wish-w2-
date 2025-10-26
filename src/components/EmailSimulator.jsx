import { useState } from 'react'
import { Mail, ExternalLink, X } from 'lucide-react'

const EmailSimulator = ({ isOpen, onClose, userEmail, activationLink, userName }) => {
  if (!isOpen) return null

  const handleActivateClick = () => {
    window.open(activationLink, '_blank')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Mail className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Email Sent to {userEmail}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Email Preview */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            {/* Email Header */}
            <div className="border-b border-gray-200 dark:border-gray-600 pb-4 mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <div><strong>From:</strong> WashWish &lt;noreply@washwish.com&gt;</div>
                  <div><strong>To:</strong> {userEmail}</div>
                  <div><strong>Subject:</strong> Activate Your WashWish Account</div>
                </div>
                <div className="text-xs">
                  {new Date().toLocaleString()}
                </div>
              </div>
            </div>

            {/* Email Body */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-blue-600 mb-2">🧺 WashWish</h1>
                <p className="text-gray-600 dark:text-gray-400">Professional Laundry Service</p>
              </div>

              <div className="text-gray-800 dark:text-gray-200">
                <p className="mb-4">Hi {userName || 'there'},</p>
                
                <p className="mb-4">
                  Welcome to WashWish! We're excited to have you join our community of satisfied customers.
                </p>
                
                <p className="mb-6">
                  To complete your registration and activate your account, please click the button below:
                </p>

                <div className="text-center mb-6">
                  <button
                    onClick={handleActivateClick}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Activate My Account
                  </button>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Important:</strong> This activation link will expire in 24 hours for security reasons.
                  </p>
                </div>

                <p className="mb-4 text-sm">
                  If the button doesn't work, you can copy and paste this link into your browser:
                </p>
                
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded border text-xs font-mono break-all mb-6">
                  {activationLink}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Once your account is activated, you'll be able to:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1 mb-4">
                    <li>Schedule pickup and delivery</li>
                    <li>Track your orders in real-time</li>
                    <li>Manage your payment methods</li>
                    <li>Access exclusive member discounts</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  If you didn't create this account, please ignore this email.
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Best regards,<br />
                  The WashWish Team
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  WashWish - Professional Laundry Service<br />
                  📧 support@washwish.com | 📞 +91-9876543210<br />
                  This is an automated email, please do not reply.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            📧 This email has been sent to <strong>{userEmail}</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

export default EmailSimulator