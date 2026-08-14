import { Router } from 'express';
import {
  getResults,
  getResult,
  getStudentDashboard,
  getTeacherDashboard,
  getAdminDashboard,
  exportResults,
} from '../controllers/resultController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/student/dashboard', protect, authorize('STUDENT'), getStudentDashboard);
router.get('/teacher/dashboard', protect, authorize('TEACHER'), getTeacherDashboard);
router.get('/admin/dashboard', protect, authorize('ADMIN'), getAdminDashboard);
router.get('/', protect, getResults);
router.get('/:id', protect, getResult);
router.get('/:examId/export', protect, authorize('TEACHER', 'ADMIN'), exportResults);

export default router;
