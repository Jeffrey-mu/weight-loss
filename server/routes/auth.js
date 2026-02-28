const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, phone, password, nickname } = req.body;

    // Validate inputs
    if (!email && !phone) {
      return res.status(400).json({ message: 'Email or phone number is required' });
    }

    // Check if user exists by email
    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
    }

    // Check if user exists by phone
    if (phone) {
      const existingPhone = await prisma.user.findUnique({ where: { phone } });
      if (existingPhone) {
        return res.status(400).json({ message: 'User with this phone number already exists' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email: email || undefined,
        phone: phone || undefined,
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
    const { account, password } = req.body; // 'account' can be email or phone

    let user;
    
    // Check if account is email or phone
    const isEmail = account.includes('@');
    
    if (isEmail) {
      user = await prisma.user.findUnique({ where: { email: account } });
    } else {
      user = await prisma.user.findUnique({ where: { phone: account } });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
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
        nickname: true,
        gender: true,
        age: true,
        height: true,
        initialWeight: true,
        targetWeight: true,
        targetDate: true,
        avatar: true,
      },
    });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
