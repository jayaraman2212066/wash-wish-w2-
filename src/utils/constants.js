export const USER_ROLES = {
  CUSTOMER: 'customer',
  STAFF: 'staff',
  ADMIN: 'admin',
}

export const ORDER_STATUS = {
  PENDING: 'pending',
  PICKED_UP: 'picked_up',
  IN_PROCESS: 'in_process',
  WASHED: 'washed',
  IRONED: 'ironed',
  READY_FOR_DELIVERY: 'ready_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
}

export const CLOTH_TYPES = {
  // Regular Items
  shirt: { name: 'Shirt', price: 100, category: 'regular', services: ['Dry Clean', 'Wash & Iron', 'Steam Press'] },
  tshirt: { name: 'T-Shirt', price: 80, category: 'regular', services: ['Regular Wash', 'Wash & Iron'] },
  pants: { name: 'Trousers/Pants', price: 120, category: 'regular', services: ['Dry Clean', 'Wash & Iron'] },
  jeans: { name: 'Jeans', price: 100, category: 'regular', services: ['Regular Wash', 'Wash & Iron'] },
  shorts: { name: 'Shorts', price: 70, category: 'regular', services: ['Regular Wash', 'Steam Press'] },
  
  // Premium Items
  suit: { name: 'Suit', price: 400, category: 'premium', services: ['Dry Clean Only', 'Steam Press'] },
  blazer: { name: 'Blazer', price: 250, category: 'premium', services: ['Dry Clean', 'Steam Press'] },
  coat: { name: 'Winter Coat', price: 300, category: 'premium', services: ['Dry Clean', 'Steam Refresh'] },
  
  // Indian Wear
  saree: { name: 'Saree', price: 200, category: 'premium', services: ['Dry Clean', 'Wash & Iron', 'Border Pressing'] },
  salwar: { name: 'Salwar Kameez', price: 150, category: 'regular', services: ['Wash & Iron', 'Steam Press'] },
  lehenga: { name: 'Lehenga', price: 500, category: 'specialty', services: ['Dry Clean Only', 'Professional Handling'] },
  kurta: { name: 'Kurta/Kurti', price: 120, category: 'regular', services: ['Wash & Iron', 'Steam Press'] },
  sherwani: { name: 'Sherwani', price: 400, category: 'specialty', services: ['Dry Clean Only', 'Steam Press'] },
  
  // Women's Wear
  dress: { name: 'Dress', price: 180, category: 'regular', services: ['Dry Clean', 'Wash & Iron'] },
  skirt: { name: 'Skirt', price: 100, category: 'regular', services: ['Wash & Iron', 'Steam Press'] },
  
  // Home Textiles
  bedsheet: { name: 'Bedsheet', price: 150, category: 'bulk', services: ['Wash & Iron', 'Steam Press'] },
  pillowcover: { name: 'Pillow Cover', price: 50, category: 'bulk', services: ['Wash & Iron'] },
  blanket: { name: 'Blanket', price: 200, category: 'bulk', services: ['Dry Clean', 'Heavy Duty Wash'] },
  comforter: { name: 'Comforter', price: 250, category: 'bulk', services: ['Dry Clean', 'Fluff & Fold'] },
  curtain: { name: 'Curtains', price: 180, category: 'bulk', services: ['Dry Clean', 'Steam Press'] },
  towel: { name: 'Towel', price: 80, category: 'regular', services: ['Regular Wash', 'Sanitization'] },
  bathrobe: { name: 'Bath Robe', price: 150, category: 'regular', services: ['Regular Wash', 'Steam Press'] },
  
  // Specialty Items
  wedding: { name: 'Wedding Dress', price: 800, category: 'specialty', services: ['Dry Clean Only', 'Preservation Service'] },
  leather: { name: 'Leather Jacket', price: 600, category: 'specialty', services: ['Leather Dry Clean Only'] },
  
  // Accessories
  tie: { name: 'Tie', price: 60, category: 'regular', services: ['Dry Clean Only', 'Steam Press'] },
  scarf: { name: 'Scarf', price: 80, category: 'regular', services: ['Dry Clean', 'Steam Press'] },
  dupatta: { name: 'Dupatta', price: 100, category: 'regular', services: ['Wash & Iron', 'Steam Press'] },
  jacket: { name: 'Jacket', price: 250, category: 'premium', services: ['Dry Clean', 'Steam Press'] }
}

export const SERVICE_CATEGORIES = {
  REGULAR: 'regular',
  PREMIUM: 'premium',
  BULK: 'bulk',
  SPECIALTY: 'specialty'
}

export const DELIVERY_OPTIONS = {
  REGULAR: { name: 'Regular Service (2-3 days)', price: 0, days: '2-3' },
  EXPRESS: { name: 'Express Service (24-hour)', price: 100, days: '1' },
  SAME_DAY: { name: 'Same Day Service', price: 200, days: '0' }
}

export const SPECIAL_TREATMENTS = {
  STAIN_REMOVAL: { name: 'Stain Removal', price: 50 },
  ODOR_REMOVAL: { name: 'Odor Removal', price: 40 },
  ANTIBACTERIAL: { name: 'Antibacterial Treatment', price: 30 },
  SANITIZATION: { name: 'Sanitization & Disinfection', price: 60 },
  WATERPROOFING: { name: 'Waterproofing', price: 80 },
  WRINKLE_FREE: { name: 'Wrinkle-Free Treatment', price: 40 }
}

export const STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ORDER_STATUS.PICKED_UP]: 'bg-blue-100 text-blue-800',
  [ORDER_STATUS.IN_PROCESS]: 'bg-purple-100 text-purple-800',
  [ORDER_STATUS.WASHED]: 'bg-indigo-100 text-indigo-800',
  [ORDER_STATUS.IRONED]: 'bg-pink-100 text-pink-800',
  [ORDER_STATUS.READY_FOR_DELIVERY]: 'bg-orange-100 text-orange-800',
  [ORDER_STATUS.DELIVERED]: 'bg-green-100 text-green-800',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
}