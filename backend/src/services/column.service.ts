import { Column } from '../modals/Column';
import { Board } from '../modals/Board';
import { CreateColumnDto, UpdateColumnDto } from '../schemas/column.schema';
import { AppError } from '../utils/errors';
import {AppDataSource} from "../config/database";

export class ColumnService {
    private columnRepository = AppDataSource.getRepository(Column);
    private boardRepository = AppDataSource.getRepository(Board);

    public async createColumn(columnData: CreateColumnDto, userId: number): Promise<Column> {
        const board = await this.boardRepository.findOne({
            where: { id: columnData.boardId, user: { id: userId } },
        });

        if (!board) {
            throw new AppError('Board not found or you do not have permission to access it', 404);
        }

        const newColumn = this.columnRepository.create({
            name: columnData.name,
            board: board,
            position: await this.columnRepository.count({ where: { board: { id: board.id } } }) || 0,
        });

        return await this.columnRepository.save(newColumn);
    }

    public async updateColumn(columnId: number, columnData: UpdateColumnDto, userId: number): Promise<Column> {
        const column = await this.columnRepository.findOne({
            where: { id: columnId },
            relations: ['board', 'board.user'],
        });

        if (!column) {
            throw new AppError('Column not found', 404);
        }
        if (column.board.user.id !== userId) {
            throw new AppError('You are not authorized to modify this column', 403);
        }

        // 2. Update the name and save
        column.name = columnData.name;
        return await this.columnRepository.save(column);
    }

    public async deleteColumn(columnId: number, userId: number): Promise<void> {
        const column = await this.columnRepository.findOne({
            where: { id: columnId },
            relations: ['board', 'board.user'],
        });

        if (!column) {
            throw new AppError('Column not found', 404);
        }
        if (column.board.user.id !== userId) {
            throw new AppError('You are not authorized to delete this column', 403);
        }

        await this.columnRepository.remove(column);
    }
}