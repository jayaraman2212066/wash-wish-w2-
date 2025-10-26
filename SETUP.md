# WashWish Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (v4.4 or higher)
3. **Git**

## Quick Setup

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://mongodb.com/atlas
2. Create a cluster
3. Get connection string
4. Update `.env` file

### 3. Configure Environment

Update `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/laundry
JWT_SECRET=washwish_super_secret_key_2024
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Update `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=your_razorpay_key_here
```

### 4. Test Database Connection

```bash
npm run test-db
```

You should see:
```
✅ Database connected successfully!
✅ Test document created successfully!
✅ Test document deleted successfully!
✅ Database connection closed
```

### 5. Start Development Servers

**Option A: Start both servers together**
```bash
npm run start-dev
```

**Option B: Start servers separately**
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend
npm run dev
```

## Default Admin Account

The system creates a default admin account:
- **Email**: admin@washwish.com
- **Password**: admin123
- **Role**: admin

## Testing Authentication

### 1. Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "9876543210",
    "address": "123 Main St",
    "role": "customer"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Test Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Frontend URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Common Issues & Solutions

### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 2. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill process using port
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### 3. CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Check backend CORS configuration in `server.js`

### 4. JWT Token Issues
```
Invalid token
```
**Solution**: Clear localStorage and login again
```javascript
localStorage.clear()
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get orders
- `GET /api/orders/my` - Get my orders
- `PUT /api/orders/:id/status` - Update status

### Payments
- `POST /api/payments/create-order` - Create payment
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/user/:id` - Get payments

## Development Workflow

1. **Make changes** to frontend/backend
2. **Test locally** with both servers running
3. **Check browser console** for errors
4. **Check backend logs** for API errors
5. **Test API endpoints** with Postman/curl

## Production Deployment

1. **Build frontend**
   ```bash
   npm run build
   ```

2. **Set production environment**
   ```bash
   NODE_ENV=production
   ```

3. **Use process manager**
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name washwish-api
   ```

## Support

If you encounter issues:
1. Check this setup guide
2. Verify all dependencies are installed
3. Check MongoDB is running
4. Verify environment variables
5. Check browser/server console logs