export interface UserStatsDto {
    totalBoards: number;
    totalTasks: number;
    completedTasks: number;
    tasksByStatus: {
        status: string;
        count: string;
    }[];
}