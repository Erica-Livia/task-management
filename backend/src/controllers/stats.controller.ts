import { Request, Response, NextFunction } from 'express';
import { StatsService } from '../services/stats.service';

const statsService = new StatsService();

export const getUserStatsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const stats = await statsService.getUserStats(userId);
        res.status(200).json({ data: stats });
    } catch (error) {
        next(error);
    }
};