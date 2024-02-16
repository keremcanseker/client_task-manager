import { z, ZodType } from "zod";
export type User = {
  id?: string;
  username: string;
  password: string;
};

export const UserSchema: ZodType<User> = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username must be at most 20 characters"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(20, "Password must be at most 20 characters"),
});

export type Task = {
  _id?: string;
  title: string;
  description: string;
  dueDate?: string;
  completed?: boolean;
  username?: string;
};

export const TaskSchema: ZodType<Task> = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  dueDate: z.string().optional(),
  completed: z.boolean().optional(),
  username: z.string().optional(),
  _id: z.string().optional(),
});
