import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getTypes, addType, deleteType } from '../controllers/typeController.js';

const router = Router();

router.use(authenticate);
router.get('/', getTypes);
router.post('/', addType);
router.delete('/:id', deleteType);

export default router;
