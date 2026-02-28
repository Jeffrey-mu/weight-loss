const express = require('express');
const router = express.Router();
const prisma = require('../db');
const auth = require('../middleware/auth');

router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's weight
    const weightRecord = await prisma.weightRecord.findFirst({
      where: {
        userId: req.user.user.id,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: { date: 'desc' },
    });

    // Get today's total calories intake
    const dietRecords = await prisma.dietRecord.findMany({
      where: {
        userId: req.user.user.id,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
    const totalIntake = dietRecords.reduce((acc, curr) => acc + curr.calories, 0);

    // Get today's total calories burned
    const exerciseRecords = await prisma.exerciseRecord.findMany({
      where: {
        userId: req.user.user.id,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
    const totalBurned = exerciseRecords.reduce((acc, curr) => acc + curr.calories, 0);

    res.json({
      weight: weightRecord ? weightRecord.weight : null,
      totalIntake,
      totalBurned,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
