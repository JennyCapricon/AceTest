import prisma from '../config/db.js';

export const getUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const where = {};
    if (role) where.role = role;

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          isActive: true,
          createdAt: true,
          studentProfile: true,
          teacherProfile: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        studentProfile: true,
        teacherProfile: true,
        _count: { select: { submissions: true } },
      },
    });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: !user.isActive },
      select: { id: true, isActive: true, role: true, email: true },
    });

    res.json({
      success: true,
      data: updated,
      message: `User ${updated.isActive ? 'activated' : 'deactivated'}`,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, role, isActive } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { firstName, lastName, email, role, isActive },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        isActive: true,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const getSchools = async (req, res, next) => {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: schools });
  } catch (error) {
    next(error);
  }
};

export const createSchool = async (req, res, next) => {
  try {
    const school = await prisma.school.create({ data: req.body });
    res.status(201).json({ success: true, data: school });
  } catch (error) {
    next(error);
  }
};

export const updateSchool = async (req, res, next) => {
  try {
    const school = await prisma.school.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: school });
  } catch (error) {
    next(error);
  }
};

export const deleteSchool = async (req, res, next) => {
  try {
    await prisma.school.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'School deleted' });
  } catch (error) {
    next(error);
  }
};

export const getSystemStats = async (req, res, next) => {
  try {
    const [totalUsers, totalExams, totalQuestions, totalResults, recentUsers, recentExams] =
      await Promise.all([
        prisma.user.count(),
        prisma.exam.count(),
        prisma.question.count(),
        prisma.result.count(),
        prisma.user.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: { id: true, email: true, role: true, firstName: true, lastName: true, createdAt: true },
        }),
        prisma.exam.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { subject: true, creator: { select: { firstName: true, lastName: true } } },
        }),
      ]);

    res.json({
      success: true,
      data: { totalUsers, totalExams, totalQuestions, totalResults, recentUsers, recentExams },
    });
  } catch (error) {
    next(error);
  }
};
