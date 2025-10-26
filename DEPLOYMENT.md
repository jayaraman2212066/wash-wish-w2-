# WashWish Deployment Guide

## 🚀 Quick Deploy to GitHub & Render

### Option 1: Automated Deployment (Recommended)

**Windows:**
```bash
deploy.bat
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Deployment

1. **Initialize Git & Push to GitHub:**
```bash
git init
git add .
git commit -m "feat: complete washwish laundry management system"
git branch -M main
git remote add origin https://github.com/jayaraman2212066/wash-wish-w2-.git
git push -u origin main --force
```

2. **Deploy to Render.com:**

#### Backend Service:
- Go to [Render.com](https://render.com)
- Connect your GitHub repository
- Create **Web Service**
- Settings:
  - **Name:** `washwish-backend`
  - **Environment:** `Node`
  - **Build Command:** `cd backend && npm install`
  - **Start Command:** `cd backend && npm start`
  - **Root Directory:** `backend`

#### Frontend Service:
- Create **Static Site**
- Settings:
  - **Name:** `washwish-frontend`
  - **Build Command:** `npm install && npm run build`
  - **Publish Directory:** `dist`

#### Environment Variables:

**Backend:**
```
NODE_ENV=production
JWT_SECRET=washwish-super-secret-key-2024-production-render
PORT=10000
FRONTEND_URL=https://washwish-frontend.onrender.com
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
EMAIL_USER=washwish.service@gmail.com
EMAIL_PASS=your-gmail-app-password
```

**Frontend:**
```
VITE_API_BASE_URL=https://washwish-backend.onrender.com/api
VITE_RAZORPAY_KEY=rzp_test_your_key_id
```

## 🗄️ Database Setup

The application uses a **file-based JSON database** that works perfectly on Render's free tier:

- **Users:** Stored in `backend/data/users.json`
- **Orders:** Stored in `backend/data/orders.json`
- **Payments:** Stored in `backend/data/payments.json`
- **Subscriptions:** Stored in `backend/data/subscriptions.json`

### Database Features:
- ✅ **Persistent storage** on Render
- ✅ **No external database** required
- ✅ **Automatic file creation**
- ✅ **JSON-based** for easy debugging
- ✅ **Production ready** for small to medium apps

## 🔧 Configuration

### Payment Integration (Razorpay)
1. Sign up at [Razorpay](https://razorpay.com)
2. Get your Test/Live API keys
3. Update environment variables

### Email Service
1. Use Gmail with App Password
2. Or integrate with SendGrid/Mailgun
3. Update `EMAIL_USER` and `EMAIL_PASS`

## 📱 Live URLs

After deployment, your app will be available at:
- **Frontend:** https://washwish-frontend.onrender.com
- **Backend API:** https://washwish-backend.onrender.com/api
- **Health Check:** https://washwish-backend.onrender.com/api/health

## 🧪 Testing

### Local Testing:
```bash
# Frontend
npm run dev

# Backend
cd backend && npm run dev
```

### Production Testing:
- Test all authentication flows
- Create sample orders
- Test payment integration
- Verify email notifications

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Input validation
- ✅ Role-based access control
- ✅ Secure environment variables

## 📊 Monitoring

### Health Checks:
- Backend: `/api/health`
- Database: Automatic file system checks
- Frontend: Static site monitoring

### Logs:
- Check Render dashboard for logs
- Monitor API response times
- Track user registrations and orders

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check Node.js version (>=18.0.0)
   - Verify package.json dependencies
   - Check build logs in Render dashboard

2. **API Connection Issues:**
   - Verify VITE_API_BASE_URL in frontend
   - Check CORS settings in backend
   - Ensure backend service is running

3. **Database Issues:**
   - Files are created automatically
   - Check write permissions
   - Verify data directory exists

### Support:
- Check Render logs for detailed error messages
- Test locally first before deploying
- Verify all environment variables are set

## 🎉 Success!

Your WashWish Laundry Management System is now live and ready to use!

### Default Login Credentials:
- **Admin:** admin@washwish.com / admin123
- **Staff:** staff@washwish.com / staff123
- **Customer:** Register new account

Enjoy your fully deployed laundry management system! 🧺✨