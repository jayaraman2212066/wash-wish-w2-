import { useState, useEffect } from 'react'

const DynamicBackground = () => {
  const [currentBg, setCurrentBg] = useState(0)
  
  const backgrounds = [
    '/assets/background1.jpg',
    '/assets/background2.jpg', 
    '/assets/background3.jpg',
    '/assets/background4.jpg'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg(prev => (prev + 1) % backgrounds.length)
    }, 15000) // 15 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 -z-10">
      {backgrounds.map((bg, index) => (
        <div
          key={bg}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === currentBg ? 'opacity-10' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${bg})` }}
        />
      ))}
    </div>
  )
}

export default DynamicBackground