import React from 'react'

const ClothCard = ({ clothKey, cloth, onAdd }) => {
  const clothImages = {
    // Regular Items
    shirt: '/assets/shirt.avif',
    tshirt: '/assets/t-shirt.jpg',
    pants: '/assets/trousers.webp',
    jeans: '/assets/jeans.avif',
    shorts: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=200&h=200&fit=crop&crop=center',
    
    // Premium Items
    suit: '/assets/suit.webp',
    blazer: '/assets/blazers.jpg',
    coat: '/assets/wintor coat.jpg',
    
    // Indian Wear
    saree: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=200&fit=crop&crop=center',
    salwar: '/assets/salwar kameez.jpg',
    lehenga: '/assets/lehanga.jpg',
    kurta: '/assets/kurta.webp',
    sherwani: '/assets/sherwani.jpg',
    
    // Women's Wear
    dress: '/assets/wedding dress.jpg',
    skirt: '/assets/skirt.jpg',
    
    // Home Textiles
    bedsheet: '/assets/bedsheet.jpg',
    pillowcover: '/assets/pillow cover.jpg',
    blanket: '/assets/blanket.jpg',
    comforter: '/assets/blanket.jpg',
    curtain: '/assets/curtains.webp',
    towel: '/assets/towel.jpg',
    bathrobe: '/assets/bathrope.jpg',
    
    // Specialty Items
    wedding: '/assets/wedding dress.jpg',
    leather: '/assets/jacket.jpg',
    
    // Accessories
    tie: '/assets/tie.jpg',
    scarf: '/assets/scarf.jpg',
    dupatta: '/assets/dupatta.jpg',
    jacket: '/assets/jacket.jpg'
  }

  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg"
      onClick={() => onAdd(clothKey)}
    >
      <div className="aspect-square mb-3 overflow-hidden rounded-md relative">
        <img
          src={clothImages[clothKey] || 'https://via.placeholder.com/200x200/e5e7eb/6b7280?text=' + encodeURIComponent(cloth.name)}
          alt={cloth.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200x200/e5e7eb/6b7280?text=' + encodeURIComponent(cloth.name)
          }}
        />
        {cloth.category && (
          <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${
            cloth.category === 'specialty' ? 'bg-purple-100 text-purple-800' :
            cloth.category === 'premium' ? 'bg-blue-100 text-blue-800' :
            cloth.category === 'bulk' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {cloth.category}
          </span>
        )}
      </div>
      <h4 className="font-medium text-gray-900 dark:text-white">{cloth.name}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">₹{cloth.price}</p>
      {cloth.services && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {cloth.services.slice(0, 2).join(', ')}{cloth.services.length > 2 ? '...' : ''}
        </p>
      )}
    </div>
  )
}

export default ClothCard