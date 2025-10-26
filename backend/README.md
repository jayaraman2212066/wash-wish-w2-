# WashWish Backend - Laundry Management System API

A comprehensive Node.js backend for the WashWish Laundry Management System with role-based access control, payment integration, and analytics.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Customer, Staff, Admin)
- Password hashing with bcrypt
- Token validation middleware

### 👥 User Management
- User registration and login
- Profile management
- Staff creation (Admin only)
- User deactivation

### 📦 Order Management
- Create orders with automatic pricing
- Order status tracking
- Staff assignment
- Order filtering and search

### 💳 Payment Integration
- Razorpay payment gateway integration
- Payment verification
- Transaction history
- Refund processing

### 📊 Reports & Analytics
- Daily and monthly reports
- Revenue analytics
- Top customers analysis
- MongoDB aggregation pipelines

### 🤖 AI Features (Placeholder)
- Cost estimation
- Smart pickup scheduling
- Demand prediction

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Razorpay** for payments
- **bcryptjs** for password hashing
- **express-validator** for input validation

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/laundry
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   mongod
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - User login
GET  /api/auth/profile     - Get user profile
```

### Users
```
GET    /api/users          - Get all users (Admin)
PUT    /api/users/profile  - Update profile
PUT    /api/users/password - Change password
POST   /api/users/staff    - Create staff (Admin)
DELETE /api/users/:id      - Delete user (Admin)
```

### Orders
```
POST   /api/orders              - Create order
GET    /api/orders              - Get all orders (Admin/Staff)
GET    /api/orders/my           - Get customer orders
GET    /api/orders/:id          - Get single order
PUT    /api/orders/:id/status   - Update order status
PUT    /api/orders/:id/assign   - Assign staff (Admin)
DELETE /api/orders/:id          - Delete order (Admin)
```

### Payments
```
POST /api/payments/create-order  - Create payment order
POST /api/payments/verify        - Verify payment
GET  /api/payments/user/:id      - Get user payments
GET  /api/payments               - Get all payments (Admin)
POST /api/payments/:id/refund    - Refund payment (Admin)
```

### Reports
```
GET /api/reports/daily          - Daily reports
GET /api/reports/monthly        - Monthly reports
GET /api/reports/top-customers  - Top customers
GET /api/reports/revenue        - Revenue analytics
```

### AI Features
```
POST /api/ai/estimate-cost      - Cost estimation
GET  /api/ai/smart-schedule     - Smart scheduling
GET  /api/ai/demand-prediction  - Demand prediction (Admin)
```

## Database Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  role: ['customer', 'staff', 'admin'],
  profilePicture: String,
  isActive: Boolean
}
```

### Order Schema
```javascript
{
  orderId: String (auto-generated),
  customerId: ObjectId,
  customerName: String,
  items: [{
    type: String,
    quantity: Number,
    pricePerUnit: Number,
    total: Number
  }],
  totalAmount: Number,
  pickupAddress: String,
  deliveryAddress: String,
  pickupDate: Date,
  deliveryDate: Date,
  paymentMethod: ['online', 'cod'],
  paymentStatus: ['pending', 'paid', 'failed'],
  orderStatus: ['pending', 'picked_up', 'in_process', 'washed', 'ironed', 'ready_for_delivery', 'delivered', 'cancelled'],
  specialInstructions: String,
  assignedStaff: ObjectId
}
```

### Payment Schema
```javascript
{
  paymentId: String (auto-generated),
  orderId: ObjectId,
  userId: ObjectId,
  amount: Number,
  currency: String,
  paymentMethod: String,
  paymentStatus: ['pending', 'paid', 'failed', 'refunded'],
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  paidAt: Date
}
```

## Pricing Configuration

```javascript
const CLOTH_PRICES = {
  shirt: 100,      // ₹100 per shirt
  pants: 120,      // ₹120 per pants
  saree: 200,      // ₹200 per saree
  bedsheet: 150,   // ₹150 per bedsheet
  towel: 80,       // ₹80 per towel
  jacket: 250      // ₹250 per jacket
};
```

## Security Features

- **Helmet.js** for security headers
- **Rate limiting** to prevent abuse
- **CORS** configuration
- **Input validation** with express-validator
- **Password hashing** with bcrypt
- **JWT token** authentication

## Error Handling

Centralized error handling with:
- Custom error messages
- Validation error formatting
- MongoDB error handling
- JWT error handling
- Development stack traces

## Default Admin Account

The system automatically creates an admin account on first run:
- **Email**: admin@washwish.com
- **Password**: admin123
- **Role**: admin

## Development

```bash
# Install nodemon for development
npm install -g nodemon

# Run in development mode
npm run dev

# The server will restart automatically on file changes
```

## Testing

Use the provided Postman collection or test with curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","phone":"9876543210","address":"123 Main St"}'
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a process manager like PM2
3. Set up MongoDB replica set
4. Configure reverse proxy (Nginx)
5. Set up SSL certificates
6. Configure environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.