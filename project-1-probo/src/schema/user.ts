import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 255 }).unique().notNull(),
  email: text('email').unique(),
  isAdmin: boolean('is_admin').default(false),
  password: text('password').notNull().default('123456'),
  isVerified: boolean('is_verified').notNull().default(true),
  salt: text('salt').notNull(),
  code: text('code').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Zod Schemas
export const selectUserSchema = createSelectSchema(users).extend({
  email: z.string().email().optional(),
  username: z.string().min(3).max(255),
  password: z.string().min(6),
  isAdmin: z.boolean().optional(),
  isVerified: z.boolean(),
  salt: z.string(),
  code: z.string(),
});

export const createUserSchema = z.object({
  body: selectUserSchema.pick({
    username: true,
    email: true,
    password: true,
  }),
});

export const updateUserSchema = z.object({
  body: selectUserSchema.pick({
    username: true,
    password: true,
  }),
});

export const loginSchema = z.object({
  body: selectUserSchema.pick({
    username: true,
    password: true,
  }),
});

export const deleteUserSchema = z.object({
  body: selectUserSchema.pick({
    username: true,
  }),
});

// Types
export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof createUserSchema>['body'];
export type UpdateUser = z.infer<typeof updateUserSchema>['body'];
export type LoginCredentials = z.infer<typeof loginSchema>['body'];
