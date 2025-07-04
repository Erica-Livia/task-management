import {AppDataSource} from "../config/database";
import { Task } from '../modals/Task';
import { Column } from '../modals/Column';
import { Subtask } from '../modals/Subtask';
import { AppError } from '../utils/errors';
import {CreateTaskDto, ReorderTasksDto, UpdateTaskDto} from '../schemas/task.schema';


export class TaskService {
    private taskRepository = AppDataSource.getRepository(Task);
    private columnRepository = AppDataSource.getRepository(Column);
    private subtaskRepository = AppDataSource.getRepository(Subtask);

  public async createTask(taskData: CreateTaskDto, userId: number): Promise<Task> {
    const column = await this.columnRepository.findOne({
      where: { id: taskData.columnId },
      relations: ['board', 'board.user'], 
    });

    if (!column) {
      throw new AppError('Column not found', 404);
    }
    if (column.board.user.id !== userId) {
      throw new AppError('You are not authorized to add a task to this board', 403);
    }

    const newTask = this.taskRepository.create({
      title: taskData.title,
      description: taskData.description,
      column: column,
      status: column.name, 
      position: (await this.taskRepository.count({ where: { column: { id: column.id } } })) || 0,
    });

    if (taskData.subtasks && taskData.subtasks.length > 0) {
      const subtaskEntities = taskData.subtasks.map(title => 
        this.subtaskRepository.create({ title })
      );
      newTask.subtasks = subtaskEntities;
    }

    return await this.taskRepository.save(newTask);
  }

  public async updateTask(taskId: number, taskData: UpdateTaskDto, userId: number): Promise<Task> {
    const task = await this.taskRepository.findOneOrFail({
        where: { id: taskId },
        relations: ['column', 'column.board', 'column.board.user']
    }).catch(() => {
        throw new AppError('Task not found', 404);
    });

    if(task.column.board.user.id !== userId) {
        throw new AppError('You are not authorized to modify this task', 403);
    }
    
    task.title = taskData.title ?? task.title;
    task.description = taskData.description ?? task.description;

      if (taskData.columnId && taskData.columnId !== task.column.id) {
          const newColumn = await this.columnRepository.findOneBy({ id: taskData.columnId });
          if (!newColumn) {
              throw new AppError('Target column not found', 404);
          }

        task.column = newColumn;
        task.status = newColumn.name;
    }
    
    return await this.taskRepository.save(task);
  }

  public async deleteTask(taskId: number, userId: number): Promise<void> {
    const task = await this.taskRepository.findOneOrFail({
        where: { id: taskId },
        relations: ['column', 'column.board', 'column.board.user']
    }).catch(() => {
        throw new AppError('Task not found', 404);
    });

    if(task.column.board.user.id !== userId) {
        throw new AppError('You are not authorized to delete this task', 403);
    }
    
    await this.taskRepository.remove(task);
  }

    public async reorderTasks(reorderData: ReorderTasksDto, userId: number): Promise<void> {
        const { tasks } = reorderData;
        if (!tasks || tasks.length === 0) return;

        await AppDataSource.transaction(async (transactionalEntityManager) => {
            const firstTask = await transactionalEntityManager.findOne(Task, {
                where: { id: tasks[0].id },
                relations: ['column', 'column.board', 'column.board.user']
            });

            if (!firstTask || firstTask.column.board.user.id !== userId) {
                throw new AppError('Authorization failed. You do not own this board.', 403);
            }

            const updatePromises = tasks.map(async taskUpdate => {
                const newColumn = await transactionalEntityManager.findOneBy(Column, {id: taskUpdate.columnId});
                const newStatus = newColumn ? newColumn.name : 'Unknown';
                return transactionalEntityManager.update(
                    Task,
                    {id: taskUpdate.id},
                    {
                        position: taskUpdate.position,
                        column: {id: taskUpdate.columnId},
                        status: newStatus,
                    }
                );
            });

            await Promise.all(updatePromises);
        });
    }
}