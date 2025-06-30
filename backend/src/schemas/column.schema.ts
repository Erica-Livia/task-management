import { z } from 'zod';


export const createColumnSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Column name is required' }).min(1),
        boardId: z.number({ required_error: 'Board ID is required' }),
    }),
});

export const updateColumnSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Column name is required' }).min(1),
    }),
    params: z.object({
        columnId: z.string().transform(val => parseInt(val, 10)),
    }),
});

export const columnParamsSchema = z.object({
    params: z.object({
        columnId: z.string().transform(val => parseInt(val, 10)),
    }),
});

export type CreateColumnDto = z.infer<typeof createColumnSchema>['body'];
export type UpdateColumnDto = z.infer<typeof updateColumnSchema>['body'];