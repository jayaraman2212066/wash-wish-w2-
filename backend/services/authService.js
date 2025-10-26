const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../database');
const emailService = require('./emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'washwish-secret-key-2024';

class AuthService {
  async register(userData) {
    const { name, email, password, phone, address, role = 'customer' } = userData;
    
    const existingUser = db.find('users', { email })[0];
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    const user = db.insert('users', {
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      address: address || '',
      role,
      isActive: false,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    // Send verification email
    const emailSent = await emailService.sendVerificationEmail(email, verificationToken, name);
    
    if (!emailSent) {
      console.warn('Failed to send verification email to:', email);
    }

    return {
      message: 'Registration successful! Please check your email to verify your account.',
      emailSent,
      userId: user._id
    };
  }

  async login(email, password) {
    const user = db.find('users', { email })[0];
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new Error('Please verify your email address before logging in');
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      },
      token
    };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  getUserById(userId) {
    const user = db.findById('users', userId);
    if (!user) return null;
    
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role
    };
  }

  async verifyEmail(token) {
    const user = db.find('users', { emailVerificationToken: token })[0];
    
    if (!user) {
      throw new Error('Invalid verification token');
    }

    if (new Date() > new Date(user.emailVerificationExpires)) {
      throw new Error('Verification token has expired');
    }

    const updatedUser = db.updateById('users', user._id, {
      isEmailVerified: true,
      isActive: true,
      emailVerificationToken: null,
      emailVerificationExpires: null
    });

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.name);

    return updatedUser;
  }

  updateProfile(userId, updates) {
    const allowedUpdates = ['name', 'phone', 'address'];
    const filteredUpdates = {};
    
    allowedUpdates.forEach(key => {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    });

    return db.updateById('users', userId, filteredUpdates);
  }
}

module.exports = new AuthService();