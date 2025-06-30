import { z } from 'zod';

export const updateSubtaskSchema = z.object({
    body: z.object({
        isCompleted: z.boolean({
            required_error: 'isCompleted is a required boolean field',
        }),
    }),
    params: z.object({
        subtaskId: z.string().transform(val => parseInt(val, 10)),
    }),
});

export type UpdateSubtaskDto = z.infer<typeof updateSubtaskSchema>['body'];