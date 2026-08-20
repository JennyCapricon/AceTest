import { Router } from 'express';
import prisma from '../config/db.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { questions: true, exams: true } },
        topics: { select: { id: true, name: true }, orderBy: { name: 'asc' } },
      },
    });
    res.json({ success: true, data: subjects });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/topics', async (req, res, next) => {
  try {
    const topics = await prisma.topic.findMany({
      where: { subjectId: req.params.id },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: topics });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/topics', protect, authorize('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const topic = await prisma.topic.create({
      data: { name: req.body.name, subjectId: req.params.id },
    });
    res.status(201).json({ success: true, data: topic });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id/topics/:topicId', protect, authorize('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    await prisma.topic.delete({ where: { id: req.params.topicId } });
    res.json({ success: true, message: 'Topic deleted' });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const subject = await prisma.subject.create({ data: req.body });
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const subject = await prisma.subject.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    await prisma.subject.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Subject deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
