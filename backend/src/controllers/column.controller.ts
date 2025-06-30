import { Request, Response, NextFunction } from 'express';
import { ColumnService } from '../services/column.service';

const columnService = new ColumnService();

export const createColumnController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const column = await columnService.createColumn(req.body, userId);
        res.status(201).json(column);
    } catch (error) {
        next(error);
    }
};

export const updateColumnController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const columnId = parseInt(req.params.columnId, 10);
        const column = await columnService.updateColumn(columnId, req.body, userId);
        res.status(200).json(column);
    } catch (error) {
        next(error);
    }
};

export const deleteColumnController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const columnId = parseInt(req.params.columnId, 10);
        await columnService.deleteColumn(columnId, userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};