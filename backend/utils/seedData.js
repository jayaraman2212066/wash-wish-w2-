const User = require('../models/User');
const LaundryItem = require('../models/LaundryItem');

const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@washwish.com',
        password: 'admin123',
        phone: '9999999999',
        address: 'Admin Office, WashWish HQ',
        role: 'admin'
      });
      console.log('Admin user created:', admin.email);
    }
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
};

const seedLaundryItems = async () => {
  try {
    const itemsCount = await LaundryItem.countDocuments();
    
    if (itemsCount === 0) {
      const items = [
        {
          name: 'Shirt',
          type: 'shirt',
          price: 100,
          description: 'Regular shirt cleaning and pressing',
          category: 'clothing',
          processingTime: 24
        },
        {
          name: 'Pants',
          type: 'pants',
          price: 120,
          description: 'Trouser cleaning and pressing',
          category: 'clothing',
          processingTime: 24
        },
        {
          name: 'Saree',
          type: 'saree',
          price: 200,
          description: 'Traditional saree cleaning with special care',
          category: 'clothing',
          processingTime: 48
        },
        {
          name: 'Bedsheet',
          type: 'bedsheet',
          price: 150,
          description: 'Bedsheet washing and folding',
          category: 'bedding',
          processingTime: 24
        },
        {
          name: 'Towel',
          type: 'towel',
          price: 80,
          description: 'Towel washing and drying',
          category: 'accessories',
          processingTime: 12
        },
        {
          name: 'Jacket',
          type: 'jacket',
          price: 250,
          description: 'Jacket dry cleaning and pressing',
          category: 'clothing',
          processingTime: 48
        }
      ];

      await LaundryItem.insertMany(items);
      console.log('Laundry items seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding laundry items:', error.message);
  }
};

const seedDatabase = async () => {
  await createAdminUser();
  await seedLaundryItems();
};

module.exports = { seedDatabase, createAdminUser, seedLaundryItems };