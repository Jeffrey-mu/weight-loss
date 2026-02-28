const prisma = require('../db');
const { isAdminUser } = require('../utils/permission');

module.exports = async (req, res, next) => {
  try {
    const userId = req.user?.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, phone: true, role: true },
    });

    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (!isAdminUser(user)) return res.status(403).json({ message: 'Forbidden' });

    req.adminUser = user;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
