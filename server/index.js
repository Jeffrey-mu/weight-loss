const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: '*', // Allow all origins explicitly for now to fix CORS issues
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true, // Some clients might need this even with '*' origin (though standard spec says no, some implementations differ)
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Explicitly handle preflight requests for all routes
app.options(/.*/, cors(corsOptions));
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
