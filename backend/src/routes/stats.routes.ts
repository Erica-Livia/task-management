import { Router } from 'express';
import { authMiddleware } from '../middleware/requireUser.middleware';
import { getUserStatsController } from '../controllers/stats.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', getUserStatsController);

export default router;