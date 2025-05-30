import { z } from 'zod';

export const UserObject = z.object({
  id: z.number().int(),
  email: z.string().email(),
  name: z.string().nullable(),
});

export type UserObject = z.infer<typeof UserObject>;
