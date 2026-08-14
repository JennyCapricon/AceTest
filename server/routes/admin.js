import { Router } from 'express';
import {
  getUsers,
  getUser,
  toggleUserStatus,
  deleteUser,
  updateUser,
  getSchools,
  createSchool,
  updateSchool,
  deleteSchool,
  getSystemStats,
  flagAllNonAdminsForPasswordReset,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// TEMPORARY: remove flagPasswordReset route after production flagging is confirmed.
router.post('/users/flag-password-reset', protect, authorize('ADMIN'), flagAllNonAdminsForPasswordReset);
router.get('/users', protect, authorize('ADMIN'), getUsers);
router.get('/users/:id', protect, authorize('ADMIN'), getUser);
router.put('/users/:id', protect, authorize('ADMIN'), updateUser);
router.put('/users/:id/toggle-status', protect, authorize('ADMIN'), toggleUserStatus);
router.delete('/users/:id', protect, authorize('ADMIN'), deleteUser);

router.get('/schools', protect, authorize('ADMIN'), getSchools);
router.post('/schools', protect, authorize('ADMIN'), createSchool);
router.put('/schools/:id', protect, authorize('ADMIN'), updateSchool);
router.delete('/schools/:id', protect, authorize('ADMIN'), deleteSchool);

router.get('/stats', protect, authorize('ADMIN'), getSystemStats);

export default router;
