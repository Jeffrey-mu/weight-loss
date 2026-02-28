const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const auth = require('../middleware/auth');
const { isAdminUser } = require('../utils/permission');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, phone, password, nickname } = req.body;

    // Validate inputs
    if (!email && !phone) {
      return res.status(400).json({ message: 'Email or phone number is required' });
    }

    const cleanEmail = email ? email.trim() : null;
    const cleanPhone = phone ? phone.trim() : null;

    // Check if user exists by email
    if (cleanEmail) {
      const existingEmail = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (existingEmail) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
    }

    // Check if user exists by phone
    if (cleanPhone) {
      const existingPhone = await prisma.user.findUnique({ where: { phone: cleanPhone } });
      if (existingPhone) {
        return res.status(400).json({ message: 'User with this phone number already exists' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email: cleanEmail || undefined,
        phone: cleanPhone || undefined,
        password: hashedPassword,
        nickname,
      },
    });

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '30d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { account, password } = req.body;
    console.log('Login attempt:', { account }); // Log login attempt

    if (!account || !password) {
      return res.status(400).json({ message: 'Account and password are required' });
    }

    const cleanAccount = account.trim();
    let user;
    
    // Check if account is email or phone
    const isEmail = cleanAccount.includes('@');
    
    if (isEmail) {
      user = await prisma.user.findUnique({ where: { email: cleanAccount } });
    } else {
      user = await prisma.user.findUnique({ where: { phone: cleanAccount } });
    }

    if (!user) {
      console.log('User not found for account:', cleanAccount);
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Password mismatch for user:', user.id);
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '30d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get Current User
router.get('/me', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.user.id },
      select: {
        id: true,
        email: true,
        phone: true,
        nickname: true,
        gender: true,
        age: true,
        height: true,
        initialWeight: true,
        targetWeight: true,
        targetDate: true,
        avatar: true,
        role: true,
      },
    });
    res.json({ ...user, isAdmin: isAdminUser(user) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
