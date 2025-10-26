const { CLOTH_PRICES } = require('../utils/pricing');

// @desc    AI Cost Estimator
// @route   POST /api/ai/estimate-cost
// @access  Private
const estimateCost = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    let totalCost = 0;
    const estimatedItems = [];

    items.forEach(item => {
      const { type, quantity } = item;
      const pricePerUnit = CLOTH_PRICES[type] || 100;
      const itemTotal = pricePerUnit * quantity;
      
      totalCost += itemTotal;
      estimatedItems.push({
        type,
        quantity,
        pricePerUnit,
        total: itemTotal
      });
    });

    // Add AI-based adjustments (mock implementation)
    const aiAdjustments = {
      bulkDiscount: totalCost > 1000 ? totalCost * 0.1 : 0,
      seasonalDiscount: 0, // Could be based on current season
      loyaltyDiscount: 0, // Could be based on customer history
      urgentCharges: 0 // Could be based on delivery date
    };

    const finalCost = totalCost - aiAdjustments.bulkDiscount;

    res.json({
      success: true,
      data: {
        items: estimatedItems,
        baseCost: totalCost,
        adjustments: aiAdjustments,
        finalCost: Math.round(finalCost),
        estimatedTime: '24-48 hours',
        confidence: 0.95
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Smart Pickup Scheduler
// @route   GET /api/ai/smart-schedule
// @access  Private
const smartSchedule = async (req, res, next) => {
  try {
    const { date, area } = req.query;
    
    // Mock AI scheduling logic
    const currentHour = new Date().getHours();
    const suggestedSlots = [];

    // Generate time slots based on current workload (mock data)
    const timeSlots = [
      { time: '09:00-11:00', availability: 'high', cost: 0 },
      { time: '11:00-13:00', availability: 'medium', cost: 20 },
      { time: '13:00-15:00', availability: 'low', cost: 50 },
      { time: '15:00-17:00', availability: 'medium', cost: 20 },
      { time: '17:00-19:00', availability: 'high', cost: 0 }
    ];

    timeSlots.forEach(slot => {
      suggestedSlots.push({
        ...slot,
        recommended: slot.availability === 'high',
        estimatedPickupTime: '30-45 minutes'
      });
    });

    res.json({
      success: true,
      data: {
        date: date || new Date().toISOString().split('T')[0],
        area: area || 'Default Area',
        suggestedSlots,
        aiRecommendation: {
          bestSlot: '09:00-11:00',
          reason: 'Low traffic and high availability',
          confidence: 0.87
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Demand Prediction
// @route   GET /api/ai/demand-prediction
// @access  Private/Admin
const demandPrediction = async (req, res, next) => {
  try {
    const { period = '7' } = req.query;
    
    // Mock demand prediction data
    const predictions = [];
    const today = new Date();
    
    for (let i = 0; i < parseInt(period); i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      // Mock prediction algorithm
      const dayOfWeek = date.getDay();
      let demandLevel = 'medium';
      let expectedOrders = 15;
      
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
        demandLevel = 'high';
        expectedOrders = 25;
      } else if (dayOfWeek === 1) { // Monday
        demandLevel = 'high';
        expectedOrders = 30;
      }
      
      predictions.push({
        date: date.toISOString().split('T')[0],
        demandLevel,
        expectedOrders,
        confidence: 0.82,
        recommendedStaff: Math.ceil(expectedOrders / 10)
      });
    }

    res.json({
      success: true,
      data: {
        period: `Next ${period} days`,
        predictions,
        summary: {
          averageDemand: predictions.reduce((sum, p) => sum + p.expectedOrders, 0) / predictions.length,
          peakDays: predictions.filter(p => p.demandLevel === 'high').length,
          recommendedActions: [
            'Schedule more staff for Monday',
            'Prepare for weekend rush',
            'Stock up on cleaning supplies'
          ]
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  estimateCost,
  smartSchedule,
  demandPrediction
};