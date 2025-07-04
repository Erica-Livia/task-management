import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).min(1),
    description: z.string().optional(),
    columnId: z.number({ required_error: 'Column ID is required' }),
    subtasks: z.array(z.string().min(1)).optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    columnId: z.number().optional(),
    subtasks: z.array(z.object({
      id: z.number().optional(),
      title: z.string().min(1),
    })).optional(),
  }),
  params: z.object({
    taskId: z.string().transform(val => parseInt(val, 10)),
  }),
});

export const taskParamsSchema = z.object({
  params: z.object({
    taskId: z.string().transform(val => parseInt(val, 10)),
  }),
});

export const reorderTasksSchema = z.object({
  body: z.object({
    tasks: z.array(
        z.object({
          id: z.number(),
          position: z.number(),
          columnId: z.number(),
        })
    ),
  }),
});

export type ReorderTasksDto = z.infer<typeof reorderTasksSchema>['body'];
export type CreateTaskDto = z.infer<typeof createTaskSchema>['body'];
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>['body'];