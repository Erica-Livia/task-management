import { getRepository } from 'typeorm';
import { Subtask } from '../modals/Subtask';
import { UpdateSubtaskDto } from '../schemas/subtask.schema';
import { AppError } from '../utils/errors';
import {AppDataSource} from "../config/database";
import {Board} from "../modals/Board";

export class SubtaskService {
    private subtaskRepository = AppDataSource.getRepository(Subtask);

    public async updateSubtaskStatus(
        subtaskId: number,
        subtaskData: UpdateSubtaskDto,
        userId: number
    ): Promise<Subtask> {
        const subtask = await this.subtaskRepository.findOne({
            where: { id: subtaskId },
            relations: ['task', 'task.column', 'task.column.board', 'task.column.board.user'],
        });

        if (!subtask) {
            throw new AppError('Subtask not found', 404);
        }

        if (subtask.task.column.board.user.id !== userId) {
            throw new AppError('You are not authorized to modify this subtask', 403);
        }

        subtask.isCompleted = subtaskData.isCompleted;

        return await this.subtaskRepository.save(subtask);
    }
}