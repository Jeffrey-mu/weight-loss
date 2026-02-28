const express = require('express');
const router = express.Router();
const prisma = require('../db');
const auth = require('../middleware/auth');

// Get all diet records (optionally filter by date)
router.get('/', auth, async (req, res) => {
  try {
    const { date } = req.query;
    let where = { userId: req.user.user.id };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const dietRecords = await prisma.dietRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });
    res.json(dietRecords);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a diet record
router.post('/', auth, async (req, res) => {
  try {
    const { date, type, foodName, amount, calories } = req.body;

    const newDietRecord = await prisma.dietRecord.create({
      data: {
        userId: req.user.user.id,
        date: new Date(date),
        type, // "breakfast", "lunch", "dinner", "snack"
        foodName,
        amount: amount ? parseFloat(amount) : null,
        calories: parseFloat(calories),
      },
    });

    res.json(newDietRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a diet record
router.put('/:id', auth, async (req, res) => {
  try {
    const { date, type, foodName, amount, calories } = req.body;
    const { id } = req.params;

    const dietRecord = await prisma.dietRecord.findUnique({
      where: { id: parseInt(id) },
    });

    if (!dietRecord) {
      return res.status(404).json({ message: 'Diet record not found' });
    }

    if (dietRecord.userId !== req.user.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedDietRecord = await prisma.dietRecord.update({
      where: { id: parseInt(id) },
      data: {
        date: date ? new Date(date) : undefined,
        type,
        foodName,
        amount: amount ? parseFloat(amount) : undefined,
        calories: calories ? parseFloat(calories) : undefined,
      },
    });

    res.json(updatedDietRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a diet record
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const dietRecord = await prisma.dietRecord.findUnique({
      where: { id: parseInt(id) },
    });

    if (!dietRecord) {
      return res.status(404).json({ message: 'Diet record not found' });
    }

    if (dietRecord.userId !== req.user.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await prisma.dietRecord.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Diet record removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
