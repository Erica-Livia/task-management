import { z } from 'zod';

export const createBoardSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Board name is required',
    }).min(1, 'Board name cannot be empty'),

   
    columns: z.array(z.string().min(1, 'Column name cannot be empty')).optional(),
  }),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>['body'];

const params = {
  params: z.object({
    boardId: z.string().transform((val, ctx) => {
      const parsed = parseInt(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Board ID must be a number',
        });
        return z.NEVER;
      }
      return parsed;
    }),
  }),
};

export const getOrDeleteBoardSchema = z.object({
  ...params,
});

export const updateBoardSchema = z.object({
  ...params,
  body: z.object({
    name: z.string().min(1).optional(),
    columns: z.array(z.object({
      id: z.number().optional(),
      name: z.string().min(1, 'Column name cannot be empty'),
    })).optional(),
  }),
});

export type UpdateBoardInput = z.infer<typeof updateBoardSchema>['body'];