import {NextFunction, Request, Response} from 'express';
import { TaskService } from '../services/task.service';

const taskService = new TaskService();

export const createTaskController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const task = await taskService.createTask(req.body, userId);
  res.status(201).json(task);
};

export const updateTaskController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const taskId = parseInt(req.params.taskId, 10);
  const task = await taskService.updateTask(taskId, req.body, userId);
  res.status(200).json(task);
};

export const deleteTaskController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const taskId = parseInt(req.params.taskId, 10);
  await taskService.deleteTask(taskId, userId);
  res.status(204).send(); 
};

export const reorderTasksController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    await taskService.reorderTasks(req.body, userId);
    res.status(200).json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    next(error);
  }
};