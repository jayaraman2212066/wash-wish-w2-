const express = require('express');
const router = express.Router();

let users = [
  { id: 1, email: 'admin@washwish.com', password: 'admin123', name: 'Admin', role: 'admin' }
];

router.post('/register', (req, res) => {
  const { name, email, password, phone, address } = req.body;
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    phone: phone || '0000000000',
    address: address || 'Default Address',
    role: 'customer'
  };
  
  users.push(newUser);
  
  res.json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: { _id: newUser.id, name, email, phone: newUser.phone, address: newUser.address, role: 'customer' },
      token: 'fake-token-' + newUser.id
    }
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { _id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role },
        token: 'fake-token-' + user.id
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;