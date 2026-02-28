const express = require('express');
const router = express.Router();
const prisma = require('../db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/overview', auth, admin, async (req, res) => {
  try {
    const [userCount, weightCount, dietCount, exerciseCount] = await Promise.all([
      prisma.user.count(),
      prisma.weightRecord.count(),
      prisma.dietRecord.count(),
      prisma.exerciseRecord.count(),
    ]);

    res.json({
      userCount,
      recordCount: {
        weight: weightCount,
        diet: dietCount,
        exercise: exerciseCount,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/users', auth, admin, async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();

    const where = q
      ? {
          OR: [
            { email: { contains: q } },
            { phone: { contains: q } },
            { nickname: { contains: q } },
          ],
        }
      : undefined;

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
        createdAt: true,
        updatedAt: true,
        role: true,
        _count: {
          select: {
            weightRecords: true,
            dietRecords: true,
            exerciseRecords: true,
          },
        },
      },
    });

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.patch('/users/:id/role', auth, admin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { role } = req.body;
    
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid user id' });
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    if (id === req.adminUser.id) return res.status(400).json({ message: 'Cannot change own role' });

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await prisma.user.update({
      where: { id },
      data: { role },
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/users/:id', auth, admin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid user id' });
    if (id === req.adminUser.id) return res.status(400).json({ message: 'Cannot delete current admin user' });

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await prisma.$transaction([
      prisma.weightRecord.deleteMany({ where: { userId: id } }),
      prisma.dietRecord.deleteMany({ where: { userId: id } }),
      prisma.exerciseRecord.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);

    res.json({ ok: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
