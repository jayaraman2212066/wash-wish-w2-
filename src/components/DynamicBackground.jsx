import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const DynamicBackground = () => {
  const { darkMode } = useSelector((state) => state.theme)
  
  const backgrounds = [
    '/assets/background1.jpg',
    '/assets/background2.jpg', 
    '/assets/background3.jpg',
    '/assets/background4.jpg'
  ]

  useEffect(() => {
    let currentIndex = 0
    
    const changeBackground = () => {
      const overlay = darkMode 
        ? 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))' 
        : 'linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3))'
      
      // Set background properties
      document.body.style.backgroundImage = `${overlay}, url('${backgrounds[currentIndex]}')`
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundPosition = 'center'
      document.body.style.backgroundAttachment = 'fixed'
      document.body.style.backgroundRepeat = 'no-repeat'
      
      currentIndex = (currentIndex + 1) % backgrounds.length
    }

    // Set initial background immediately
    changeBackground()
    const interval = setInterval(changeBackground, 15000)
    
    return () => {
      clearInterval(interval)
      // Clean up background when component unmounts
      document.body.style.backgroundImage = ''
    }
  }, [darkMode, backgrounds])

  return null
}

export default DynamicBackground