import { z } from 'zod';

// field definitions
const UserFields = {
  id: z.coerce.number().int().positive(),
  email: z.string().email().trim(),
  name: z.string().min(2).max(50).trim(),
};

// input validation
export const CreateUserInput = z.object({
  email: UserFields.email,
  name: UserFields.name.optional(),
});

export const UpdateUserInput = z.object({
  email: UserFields.email.optional(),
  name: UserFields.name.optional(),
});

// parameter validation
export const UserIdParam = z.object({
  id: UserFields.id,
});

export const UserEmailParam = z.object({
  email: UserFields.email,
});

export const CreateUserArgs = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

// type exports
export type CreateUserInput = z.infer<typeof CreateUserInput>;
export type UpdateUserInput = z.infer<typeof UpdateUserInput>;
export type UserIdParam = z.infer<typeof UserIdParam>;
export type UserEmailParam = z.infer<typeof UserEmailParam>;
