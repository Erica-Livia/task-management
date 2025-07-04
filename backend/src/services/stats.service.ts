import { AppDataSource } from '../config/database';
import { Board } from '../modals/Board';
import { Task } from '../modals/Task';
import { UserStatsDto } from '../types/stats.dto';

export class StatsService {
    private boardRepository = AppDataSource.getRepository(Board);
    private taskRepository = AppDataSource.getRepository(Task);

    public async getUserStats(userId: number): Promise<UserStatsDto> {
        // 1. Get total number of boards
        const totalBoards = await this.boardRepository.count({
            where: { user: { id: userId } },
        });

        // 2. Get total number of tasks across all of the user's boards
        const totalTasks = await this.taskRepository.count({
            where: { column: { board: { user: { id: userId } } } },
        });

        // 3. Get total number of completed tasks (assuming 'Done' is the status)
        const completedTasks = await this.taskRepository.count({
            where: {
                column: { board: { user: { id: userId } } },
                status: 'Done', // Case-sensitive, make sure it matches your column name
            },
        });

        // 4. Get the count of tasks grouped by their status
        const tasksByStatus = await this.taskRepository
            .createQueryBuilder('task')
            .select('task.status', 'status')
            .addSelect('COUNT(task.id)', 'count')
            .leftJoin('task.column', 'column')
            .leftJoin('column.board', 'board')
            .where('board.userId = :userId', { userId })
            .groupBy('task.status')
            .getRawMany();

        return {
            totalBoards,
            totalTasks,
            completedTasks,
            tasksByStatus,
        };
    }
}