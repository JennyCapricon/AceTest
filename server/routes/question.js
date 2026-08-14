import { Router } from 'express';
import multer from 'multer';
import {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  importQuestions,
} from '../controllers/questionController.js';
import { protect, authorize } from '../middleware/auth.js';

const memoryUpload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post('/', protect, authorize('TEACHER', 'ADMIN'), createQuestion);
router.get('/', protect, getQuestions);
router.get('/:id', protect, getQuestion);
router.put('/:id', protect, authorize('TEACHER', 'ADMIN'), updateQuestion);
router.delete('/:id', protect, authorize('TEACHER', 'ADMIN'), deleteQuestion);
router.post('/import', protect, authorize('TEACHER', 'ADMIN'), memoryUpload.single('file'), importQuestions);

export default router;
