import { Router } from 'express';
import {
  createExam,
  getExams,
  getExam,
  updateExam,
  deleteExam,
  publishExam,
  scheduleExam,
  addQuestionsToExam,
  getAvailableExams,
  startExam,
  submitExam,
  getStudentUpcomingExams,
} from '../controllers/examController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/available', protect, authorize('STUDENT'), getAvailableExams);
router.get('/upcoming', protect, authorize('STUDENT'), getStudentUpcomingExams);
router.post('/', protect, authorize('TEACHER', 'ADMIN'), createExam);
router.get('/', protect, getExams);
router.get('/:id', protect, getExam);
router.put('/:id', protect, authorize('TEACHER', 'ADMIN'), updateExam);
router.delete('/:id', protect, authorize('TEACHER', 'ADMIN'), deleteExam);
router.put('/:id/publish', protect, authorize('TEACHER', 'ADMIN'), publishExam);
router.put('/:id/schedule', protect, authorize('TEACHER', 'ADMIN'), scheduleExam);
router.post('/:id/questions', protect, authorize('TEACHER', 'ADMIN'), addQuestionsToExam);
router.post('/:id/start', protect, authorize('STUDENT'), startExam);
router.post('/:id/submit', protect, authorize('STUDENT'), submitExam);

export default router;
