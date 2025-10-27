import { useState, useEffect } from 'react'

const DynamicBackground = () => {
  const [currentBg, setCurrentBg] = useState(0)
  
  const backgrounds = [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1920&h=1080&fit=crop'
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