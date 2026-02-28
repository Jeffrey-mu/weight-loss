const express = require('express');
const router = express.Router();
const prisma = require('../db');
const auth = require('../middleware/auth');

// Get all weight records
router.get('/', auth, async (req, res) => {
  try {
    const weightRecords = await prisma.weightRecord.findMany({
      where: { userId: req.user.user.id },
      orderBy: { date: 'desc' },
    });
    res.json(weightRecords);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a weight record
router.post('/', auth, async (req, res) => {
  try {
    const { date, weight, bodyFat, waist, hip, note } = req.body;

    const newWeightRecord = await prisma.weightRecord.create({
      data: {
        userId: req.user.user.id,
        date: new Date(date),
        weight: parseFloat(weight),
        bodyFat: bodyFat ? parseFloat(bodyFat) : null,
        waist: waist ? parseFloat(waist) : null,
        hip: hip ? parseFloat(hip) : null,
        note,
      },
    });

    res.json(newWeightRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a weight record
router.put('/:id', auth, async (req, res) => {
  try {
    const { date, weight, bodyFat, waist, hip, note } = req.body;
    const { id } = req.params;

    const weightRecord = await prisma.weightRecord.findUnique({
      where: { id: parseInt(id) },
    });

    if (!weightRecord) {
      return res.status(404).json({ message: 'Weight record not found' });
    }

    if (weightRecord.userId !== req.user.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedWeightRecord = await prisma.weightRecord.update({
      where: { id: parseInt(id) },
      data: {
        date: date ? new Date(date) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
        waist: waist ? parseFloat(waist) : undefined,
        hip: hip ? parseFloat(hip) : undefined,
        note,
      },
    });

    res.json(updatedWeightRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a weight record
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const weightRecord = await prisma.weightRecord.findUnique({
      where: { id: parseInt(id) },
    });

    if (!weightRecord) {
      return res.status(404).json({ message: 'Weight record not found' });
    }

    if (weightRecord.userId !== req.user.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await prisma.weightRecord.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Weight record removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
