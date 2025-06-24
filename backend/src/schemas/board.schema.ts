import { z } from 'zod';

export const createBoardSchema = z.object({
  name: z.string().min(1, "Board name cannot be empty"),
  columns: z.array(z.string().min(1)).optional(), 
});

export const updateBoardSchema = z.object({
  name: z.string().min(1).optional(),
  columns: z.array(z.object({
      id: z.number().optional(),
      name: z.string().min(1),
      position: z.number()
  })).optional()
});