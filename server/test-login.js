const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    const phone = '13800138000';
    const password = 'password123';
    
    // Clean up
    await prisma.user.deleteMany({
      where: { phone }
    });
    
    // 1. Register
    console.log('Registering user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
        nickname: 'Test User'
      }
    });
    console.log('User registered:', user);
    
    // 2. Login
    console.log('Logging in...');
    const account = phone;
    const isEmail = account.includes('@');
    console.log('Is Email:', isEmail);
    
    let foundUser;
    if (isEmail) {
      foundUser = await prisma.user.findUnique({ where: { email: account } });
    } else {
      foundUser = await prisma.user.findUnique({ where: { phone: account } });
    }
    
    console.log('Found user:', foundUser);
    
    if (!foundUser) {
      console.error('User not found!');
      return;
    }
    
    const isMatch = await bcrypt.compare(password, foundUser.password);
    console.log('Password match:', isMatch);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
