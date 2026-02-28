const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const weightRoutes = require('./routes/weight');
const dietRoutes = require('./routes/diet');
const exerciseRoutes = require('./routes/exercise');
const statsRoutes = require('./routes/stats');

app.use('/api/auth', authRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/exercise', exerciseRoutes);
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
  res.send('Weight Loss API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
