const express = require('express');
const router = express.Router();
const prisma = require('../db');
const auth = require('../middleware/auth');

// Get all exercise records (optionally filter by date)
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

    const exerciseRecords = await prisma.exerciseRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });
    res.json(exerciseRecords);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create an exercise record
router.post('/', auth, async (req, res) => {
  try {
    const { date, type, duration, calories } = req.body;

    const newExerciseRecord = await prisma.exerciseRecord.create({
      data: {
        userId: req.user.user.id,
        date: new Date(date),
        type, // "running", "swimming", etc.
        duration: duration ? parseInt(duration) : null,
        calories: parseFloat(calories),
      },
    });

    res.json(newExerciseRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update an exercise record
router.put('/:id', auth, async (req, res) => {
  try {
    const { date, type, duration, calories } = req.body;
    const { id } = req.params;

    const exerciseRecord = await prisma.exerciseRecord.findUnique({
      where: { id: parseInt(id) },
    });

    if (!exerciseRecord) {
      return res.status(404).json({ message: 'Exercise record not found' });
    }

    if (exerciseRecord.userId !== req.user.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedExerciseRecord = await prisma.exerciseRecord.update({
      where: { id: parseInt(id) },
      data: {
        date: date ? new Date(date) : undefined,
        type,
        duration: duration ? parseInt(duration) : undefined,
        calories: calories ? parseFloat(calories) : undefined,
      },
    });

    res.json(updatedExerciseRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete an exercise record
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const exerciseRecord = await prisma.exerciseRecord.findUnique({
      where: { id: parseInt(id) },
    });

    if (!exerciseRecord) {
      return res.status(404).json({ message: 'Exercise record not found' });
    }

    if (exerciseRecord.userId !== req.user.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await prisma.exerciseRecord.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Exercise record removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
