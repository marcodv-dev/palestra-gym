import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getExercises,
  getExercisesOfType,
  getExerciseById,
  addExercise,
  updateExercise,
  deleteExercise,
  deleteExercisesByType,
  markExerciseDone,
  completeWorkout,
  getStats
} from '../controllers/exerciseController.js';

const router = Router();

router.use(authenticate);

router.get('/', getExercises);
router.get('/stats', getStats);
router.get('/type/:typeId', getExercisesOfType);
router.get('/:id', getExerciseById);
router.post('/', addExercise);
router.put('/:id', updateExercise);
router.delete('/:id', deleteExercise);
router.delete('/type/:typeId', deleteExercisesByType);
router.post('/:id/done', markExerciseDone);
router.post('/complete', completeWorkout);

export default router;
