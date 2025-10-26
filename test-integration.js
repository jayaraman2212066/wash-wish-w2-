const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

const testIntegration = async () => {
  console.log('🧪 Testing WashWish API Integration...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data.message);

    // Test 2: Register User
    console.log('\n2. Testing User Registration...');
    const registerData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      phone: '9876543210',
      address: '123 Test Street',
      role: 'customer'
    };

    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
    console.log('✅ User Registration:', registerResponse.data.message);
    const { user, token } = registerResponse.data.data;

    // Test 3: Login User
    console.log('\n3. Testing User Login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: registerData.email,
      password: registerData.password
    });
    console.log('✅ User Login:', loginResponse.data.message);

    // Test 4: Get Profile
    console.log('\n4. Testing Get Profile...');
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get Profile:', profileResponse.data.data.name);

    // Test 5: Create Order
    console.log('\n5. Testing Create Order...');
    const orderData = {
      items: [
        { type: 'shirt', quantity: 2 },
        { type: 'pants', quantity: 1 }
      ],
      pickupAddress: '123 Pickup Street',
      deliveryAddress: '456 Delivery Avenue',
      pickupDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      deliveryDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      paymentMethod: 'online',
      specialInstructions: 'Handle with care'
    };

    const orderResponse = await axios.post(`${API_BASE_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Create Order:', orderResponse.data.data.orderId);

    // Test 6: Get Orders
    console.log('\n6. Testing Get My Orders...');
    const ordersResponse = await axios.get(`${API_BASE_URL}/orders/my`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get Orders:', `${ordersResponse.data.data.orders.length} orders found`);

    console.log('\n🎉 All tests passed! Integration is working correctly.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data?.message || error.message);
    if (error.response?.data?.errors) {
      console.error('Validation errors:', error.response.data.errors);
    }
  }
};

// Run tests if MongoDB is available
const checkMongoDB = async () => {
  try {
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/laundry');
    console.log('📦 MongoDB connected, running integration tests...\n');
    await mongoose.connection.close();
    await testIntegration();
  } catch (error) {
    console.error('❌ MongoDB not available. Please start MongoDB first.');
    console.error('Run: mongod (or start MongoDB service)');
  }
};

checkMongoDB();