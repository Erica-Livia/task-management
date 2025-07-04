import { Router } from 'express';
import { createTaskController, updateTaskController, deleteTaskController, reorderTasksController } from '../controllers/task.controller';
import { validate } from '../middleware/validate.middleware'; 
import { authMiddleware } from '../middleware/requireUser.middleware';
import { createTaskSchema, updateTaskSchema, taskParamsSchema, reorderTasksSchema } from '../schemas/task.schema';

const router = Router();

router.use(authMiddleware);

router.post('/', validate(createTaskSchema), createTaskController);

router.patch('/:taskId', validate(updateTaskSchema), updateTaskController);

router.delete('/:taskId', validate(taskParamsSchema), deleteTaskController);

router.post('/reorder', validate(reorderTasksSchema), reorderTasksController);

export default router;