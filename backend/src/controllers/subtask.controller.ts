import { Request, Response, NextFunction } from 'express';
import { SubtaskService } from '../services/subtask.service';

const subtaskService = new SubtaskService();

export const updateSubtaskController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const subtaskId = parseInt(req.params.subtaskId, 10);

        const updatedSubtask = await subtaskService.updateSubtaskStatus(subtaskId, req.body, userId);

        res.status(200).json(updatedSubtask);
    } catch (error) {
        next(error);
    }
};