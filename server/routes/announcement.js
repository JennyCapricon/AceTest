import { Router } from 'express';
import { createAnnouncement, getAnnouncements, deleteAnnouncement } from '../controllers/announcementController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, authorize('TEACHER', 'ADMIN'), createAnnouncement);
router.get('/', protect, getAnnouncements);
router.delete('/:id', protect, authorize('ADMIN'), deleteAnnouncement);

export default router;
