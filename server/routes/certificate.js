import { Router } from 'express';
import { generateCertificate, getCertificate, getMyCertificates } from '../controllers/certificateController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, authorize('STUDENT'), generateCertificate);
router.get('/mine', protect, authorize('STUDENT'), getMyCertificates);
router.get('/:id', protect, getCertificate);

export default router;
