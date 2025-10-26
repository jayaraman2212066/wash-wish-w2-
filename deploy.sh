#!/bin/bash

echo "🚀 Starting WashWish Deployment Process..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
fi

# Create README if it doesn't exist
if [ ! -f "README.md" ]; then
    echo "📝 Creating README.md..."
    echo "# WashWish - Laundry Management System" > README.md
    echo "" >> README.md
    echo "A comprehensive React-based frontend for a laundry management system with role-based dashboards, order management, payments, and analytics." >> README.md
    echo "" >> README.md
    echo "## Live Demo" >> README.md
    echo "- Frontend: https://washwish-frontend.onrender.com" >> README.md
    echo "- Backend API: https://washwish-backend.onrender.com/api" >> README.md
    echo "" >> README.md
    echo "## Features" >> README.md
    echo "- 🔐 JWT Authentication with role-based access" >> README.md
    echo "- 📊 Customer, Staff, and Admin dashboards" >> README.md
    echo "- 📦 Complete order management system" >> README.md
    echo "- 💳 Razorpay payment integration" >> README.md
    echo "- 📈 Analytics and reporting" >> README.md
    echo "- 🤖 AI cost estimation" >> README.md
    echo "- 📱 Responsive design with dark mode" >> README.md
fi

# Add all files to git
echo "📁 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "feat: complete washwish laundry management system

- Frontend: React 18 + Vite + Tailwind CSS
- Backend: Node.js + Express + File-based database
- Features: Authentication, Orders, Payments, Reports
- Deployment: Render.com ready with auto-deploy
- Database: JSON file-based storage (production ready)"

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

# Add remote origin
echo "🔗 Adding remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/jayaraman2212066/wash-wish-w2-.git

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push -u origin main --force

echo "✅ Deployment completed successfully!"
echo ""
echo "🎉 Next Steps:"
echo "1. Go to https://render.com and connect your GitHub repository"
echo "2. Create two web services:"
echo "   - Backend: Node.js service (use backend/ folder)"
echo "   - Frontend: Static site (use root folder)"
echo "3. Set environment variables as specified in render.yaml"
echo "4. Deploy and enjoy your live application!"
echo ""
echo "📱 Your app will be available at:"
echo "- Frontend: https://washwish-frontend.onrender.com"
echo "- Backend: https://washwish-backend.onrender.com"