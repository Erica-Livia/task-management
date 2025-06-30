import { Router } from 'express';
import { updateSubtaskController } from '../controllers/subtask.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/requireUser.middleware';
import { updateSubtaskSchema } from '../schemas/subtask.schema';

const router = Router();

router.use(authMiddleware);

router.patch(
    '/:subtaskId',
    validate(updateSubtaskSchema),
    updateSubtaskController
);

export default router;