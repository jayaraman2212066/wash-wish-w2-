// Pricing configuration for different cloth types
const CLOTH_PRICES = {
  shirt: 100,
  pants: 120,
  saree: 200,
  bedsheet: 150,
  towel: 80,
  jacket: 250
};

const calculateItemTotal = (type, quantity) => {
  const pricePerUnit = CLOTH_PRICES[type] || 100;
  return {
    pricePerUnit,
    total: pricePerUnit * quantity
  };
};

const calculateOrderTotal = (items) => {
  return items.reduce((total, item) => total + item.total, 0);
};

module.exports = {
  CLOTH_PRICES,
  calculateItemTotal,
  calculateOrderTotal
};