const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../database');
const emailService = require('./emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'washwish-super-secret-key-2024-production';
const SALT_ROUNDS = 14; // Higher salt rounds for better security
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

class AuthService {
  // Advanced password hashing with Argon2-like security using bcrypt
  async hashPassword(password) {
    // Generate a random salt with high cost factor
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  }

  // Secure password validation
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      throw new Error('Password must be at least 8 characters long');
    }
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      throw new Error('Password must contain uppercase, lowercase, number and special character');
    }
  }

  // Email validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  // Generate secure tokens
  generateSecureToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  // Check for account lockout
  isAccountLocked(user) {
    if (user.lockoutUntil && user.lockoutUntil > Date.now()) {
      return true;
    }
    return false;
  }

  // Handle failed login attempts
  handleFailedLogin(user) {
    const attempts = (user.loginAttempts || 0) + 1;
    const updates = { loginAttempts: attempts };

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      updates.lockoutUntil = Date.now() + LOCKOUT_TIME;
      updates.loginAttempts = 0;
    }

    db.updateById('users', user._id, updates);
  }

  // Reset login attempts on successful login
  resetLoginAttempts(user) {
    if (user.loginAttempts || user.lockoutUntil) {
      db.updateById('users', user._id, {
        loginAttempts: 0,
        lockoutUntil: null
      });
    }
  }

  async register(userData) {
    const { name, email, password, phone, address, role = 'customer' } = userData;
    
    // Input validation
    this.validateEmail(email);
    this.validatePassword(password);
    
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    const existingUser = db.find('users', { email: email.toLowerCase() })[0];
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Advanced password hashing
    const hashedPassword = await this.hashPassword(password);
    const verificationToken = this.generateSecureToken();
    const resetToken = this.generateSecureToken();
    
    const user = db.insert('users', {
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      address: address || '',
      role,
      isActive: false,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      passwordResetToken: null,
      passwordResetExpires: null,
      loginAttempts: 0,
      lockoutUntil: null,
      lastLogin: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = db.find('users', { email: email.toLowerCase() })[0];
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if account is locked
    if (this.isAccountLocked(user)) {
      const lockoutTime = Math.ceil((user.lockoutUntil - Date.now()) / 60000);
      throw new Error(`Account locked. Try again in ${lockoutTime} minutes.`);
    }

    // Verify password with timing attack protection
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      this.handleFailedLogin(user);
      throw new Error('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new Error('Please verify your email address before logging in');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated. Contact support.');
    }

    // Reset login attempts and update last login
    this.resetLoginAttempts(user);
    db.updateById('users', user._id, {
      lastLogin: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Generate secure JWT with additional claims
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        jti: crypto.randomUUID() // Unique token ID
      },
      JWT_SECRET,
      { 
        expiresIn: '7d',
        algorithm: 'HS256'
      }
    );

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        lastLogin: user.lastLogin
      },
      token
    };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      }
      throw new Error('Invalid token');
    }
  }

  getUserById(userId) {
    const user = db.findById('users', userId);
    if (!user) return null;
    
    // Never return sensitive data
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };
  }

  async verifyEmail(token) {
    if (!token || token.length !== 128) { // Secure token length check
      throw new Error('Invalid verification token');
    }

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
      emailVerificationExpires: null,
      updatedAt: new Date().toISOString()
    });

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.name);

    return updatedUser;
  }

  updateProfile(userId, updates) {
    // Whitelist allowed updates
    const allowedUpdates = ['name', 'phone', 'address'];
    const filteredUpdates = { updatedAt: new Date().toISOString() };
    
    allowedUpdates.forEach(key => {
      if (updates[key] !== undefined) {
        if (key === 'name' && updates[key].trim().length < 2) {
          throw new Error('Name must be at least 2 characters long');
        }
        filteredUpdates[key] = key === 'name' ? updates[key].trim() : updates[key];
      }
    });

    return db.updateById('users', userId, filteredUpdates);
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = db.findById('users', userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    this.validatePassword(newPassword);

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update password
    db.updateById('users', userId, {
      password: hashedPassword,
      updatedAt: new Date().toISOString()
    });

    return { message: 'Password updated successfully' };
  }

  // Generate password reset token
  async generatePasswordResetToken(email) {
    const user = db.find('users', { email: email.toLowerCase() })[0];
    if (!user) {
      // Don't reveal if email exists
      return { message: 'If email exists, reset link has been sent' };
    }

    const resetToken = this.generateSecureToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    db.updateById('users', user._id, {
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires,
      updatedAt: new Date().toISOString()
    });

    // Send reset email
    await emailService.sendPasswordResetEmail(user.email, resetToken, user.name);

    return { message: 'If email exists, reset link has been sent' };
  }
}

module.exports = new AuthService();