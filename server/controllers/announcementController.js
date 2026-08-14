import prisma from '../config/db.js';

export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, target } = req.body;

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        target: target || 'all',
        authorId: req.user.id,
      },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    next(error);
  }
};

export const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await prisma.announcement.findMany({
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: announcements });
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    await prisma.announcement.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    next(error);
  }
};
