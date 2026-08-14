import { Router } from 'express';
import { getLeaderboard, getMyGamification, getBadges } from '../controllers/gamificationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/leaderboard', protect, getLeaderboard);
router.get('/me', protect, getMyGamification);
router.get('/badges', protect, getBadges);

export default router;
