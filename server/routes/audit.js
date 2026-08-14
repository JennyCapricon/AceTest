import { Router } from 'express';
import { getAuditLogs, getMyAuditLogs } from '../controllers/auditController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, authorize('ADMIN'), getAuditLogs);
router.get('/me', protect, getMyAuditLogs);

export default router;
