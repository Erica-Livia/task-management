import { Router } from 'express';
import { createColumnController, updateColumnController, deleteColumnController } from '../controllers/column.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/requireUser.middleware';
import { createColumnSchema, updateColumnSchema, columnParamsSchema } from '../schemas/column.schema';

const router = Router();

router.use(authMiddleware);

router.post('/', validate(createColumnSchema), createColumnController);

router.patch('/:columnId', validate(updateColumnSchema), updateColumnController);

router.delete('/:columnId', validate(columnParamsSchema), deleteColumnController);

export default router;