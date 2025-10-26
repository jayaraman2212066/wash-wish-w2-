import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { voiceService } from '../utils/voiceService'
import { toast } from 'react-toastify'

const VoiceCommandPanel = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    // Check if speech recognition is supported
    if (!voiceService.recognition) {
      setIsEnabled(false)
      toast.warning('Voice commands not supported in this browser')
    }
  }, [])

  const handleVoiceCommand = async () => {
    if (!isEnabled) return

    if (isListening) {
      voiceService.stopListening()
      setIsListening(false)
      return
    }

    try {
      setIsListening(true)
      setTranscript('')
      setResponse('')
      
      const command = await voiceService.startListening()
      setTranscript(command)
      setIsListening(false)

      // Process the command
      const result = await voiceService.processVoiceCommand(command, user?.id)
      setResponse(result.text)

      // Speak the response
      if (result.text) {
        setIsSpeaking(true)
        voiceService.speak(result.text)
        
        // Stop speaking indicator after estimated time
        setTimeout(() => setIsSpeaking(false), result.text.length * 50)
      }

      // Execute action if any
      if (result.action) {
        setTimeout(() => {
          executeVoiceAction(result.action, result.data)
        }, 2000)
      }

    } catch (error) {
      setIsListening(false)
      toast.error('Voice command failed: ' + error.message)
    }
  }

  const executeVoiceAction = (action, data) => {
    switch (action) {
      case 'create_order':
        window.location.href = '/orders/create'
        break
      case 'view_order':
        window.location.href = '/orders'
        break
      case 'recharge_wallet':
        window.location.href = '/wallet'
        break
      case 'view_wallet':
        window.location.href = '/wallet'
        break
      case 'view_invoice':
        window.location.href = '/invoices'
        break
      default:
        console.log('Unknown action:', action)
    }
  }

  const stopSpeaking = () => {
    if (voiceService.synthesis) {
      voiceService.synthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const exampleCommands = [
    "Book pickup for tomorrow",
    "Check my order status",
    "Recharge wallet 500 rupees",
    "Show my latest invoice",
    "What's my wallet balance"
  ]

  if (!isEnabled) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
        <Mic className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Voice commands not supported in this browser
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🎙️ Voice Commands
        </h3>

        {/* Voice Control Button */}
        <div className="mb-6">
          <button
            onClick={handleVoiceCommand}
            disabled={isSpeaking}
            className={`relative w-20 h-20 rounded-full transition-all duration-300 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-blue-500 hover:bg-blue-600'
            } ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? (
              <MicOff className="h-8 w-8 text-white mx-auto" />
            ) : (
              <Mic className="h-8 w-8 text-white mx-auto" />
            )}
            
            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
            )}
          </button>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {isListening ? 'Listening...' : 'Click to speak'}
          </p>
        </div>

        {/* Speaking Indicator */}
        {isSpeaking && (
          <div className="mb-4 flex items-center justify-center">
            <Volume2 className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm text-green-600">Speaking...</span>
            <button
              onClick={stopSpeaking}
              className="ml-2 p-1 text-gray-500 hover:text-gray-700"
            >
              <VolumeX className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>You said:</strong> "{transcript}"
            </p>
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Assistant:</strong> {response}
            </p>
          </div>
        )}

        {/* Example Commands */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Try saying:
          </h4>
          <div className="space-y-2">
            {exampleCommands.map((command, index) => (
              <button
                key={index}
                onClick={() => {
                  setTranscript(command)
                  voiceService.processVoiceCommand(command, user?.id).then(result => {
                    setResponse(result.text)
                    if (result.text) {
                      voiceService.speak(result.text)
                    }
                    if (result.action) {
                      setTimeout(() => executeVoiceAction(result.action, result.data), 2000)
                    }
                  })
                }}
                className="block w-full text-left px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                "{command}"
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          💡 Voice commands work best in quiet environments
        </div>
      </div>
    </div>
  )
}

export default VoiceCommandPanel