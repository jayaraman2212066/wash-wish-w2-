# WashWish - Laundry Management System Frontend

A comprehensive React-based frontend for a laundry management system with role-based dashboards, order management, payments, and analytics.

## Features

### 🔐 Authentication
- User registration and login with JWT
- Role-based access (Customer, Staff, Admin)
- Secure routing with protected routes
- Password reset functionality

### 📊 Role-Based Dashboards
- **Customer Dashboard**: Order creation, tracking, payment history
- **Staff Dashboard**: Assigned orders, status updates
- **Admin Dashboard**: Analytics, revenue charts, customer management

### 📦 Order Management
- Create orders with cloth selection and pricing
- Real-time order tracking
- Status updates (Pending → Picked Up → In Process → Washed → Ironed → Ready → Delivered)
- Invoice generation and download

### 💳 Payment System
- Razorpay integration ready
- Payment history and status tracking
- Online and Cash on Delivery options
- Receipt generation

### 📈 Reports & Analytics (Admin)
- Revenue and order analytics
- Customer insights
- Service performance metrics
- Export to Excel/PDF

### 🤖 AI Features (Placeholder)
- AI Cost Estimator
- Smart Pickup Scheduler

### ⚙️ Settings
- Profile management
- Password change
- Notification preferences
- Dark/Light mode toggle

## Tech Stack

- **React 18** with Vite
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **React Router v6** for routing
- **Recharts** for analytics
- **Axios** for API calls
- **React Toastify** for notifications
- **Lucide React** for icons

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WASHWISH(W2)
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env` file and update the API base URL
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_RAZORPAY_KEY=your_razorpay_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.jsx      # Main layout with sidebar
│   └── ProtectedRoute.jsx
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Orders.jsx
│   ├── CreateOrder.jsx
│   ├── Payments.jsx
│   ├── Reports.jsx
│   └── Settings.jsx
├── context/            # Redux store and slices
│   ├── store.js
│   ├── authSlice.js
│   ├── orderSlice.js
│   └── themeSlice.js
├── utils/              # Utilities
│   ├── api.js          # Axios configuration
│   └── constants.js    # App constants
└── assets/             # Static assets
```

## Key Features Implementation

### Authentication Flow
- JWT token stored in localStorage
- Automatic token refresh
- Role-based route protection
- Logout on token expiry

### Order Management
- Dynamic pricing based on cloth types
- Real-time status updates
- Filtering and search functionality
- Invoice generation

### Payment Integration
- Razorpay payment gateway ready
- Payment status tracking
- Multiple payment methods
- Receipt download

### Responsive Design
- Mobile-first approach
- Responsive sidebar navigation
- Touch-friendly interface
- Dark mode support

## API Integration

The frontend is designed to work with a REST API. Update the `VITE_API_BASE_URL` in your `.env` file to point to your backend server.

### Expected API Endpoints

```
POST /api/auth/login
POST /api/auth/register
GET  /api/orders
POST /api/orders
PATCH /api/orders/:id/status
GET  /api/payments
POST /api/payments
GET  /api/users/profile
PUT  /api/users/profile
```

## Customization

### Adding New Cloth Types
Update `CLOTH_TYPES` in `src/utils/constants.js`:

```javascript
export const CLOTH_TYPES = {
  NEW_ITEM: { name: 'New Item', price: 150 },
  // ... existing items
}
```

### Modifying Order Status Flow
Update `ORDER_STATUS` and `STATUS_COLORS` in `src/utils/constants.js`

### Theme Customization
Modify `tailwind.config.js` to customize colors and styling

## Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service (Netlify, Vercel, etc.)

3. **Configure environment variables** on your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.