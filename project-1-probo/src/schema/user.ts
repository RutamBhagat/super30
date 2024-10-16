import { type InferSelectModel, relations } from 'drizzle-orm';
import { boolean, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { onramps } from './onramp';
import { orders } from './order';
import { trades } from './trade';

export const Gender = pgEnum('gender', ['MALE', 'FEMALE']);

export const users = pgTable('users', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  username: varchar('username', { length: 255 }).unique().notNull(),
  email: text('email').unique(),
  isAdmin: boolean('is_admin').default(false),
  password: text('password').notNull().default('123456'), // The schema is currently temporary for testing purposes
  isVerified: boolean('is_verified').notNull().default(true),
  salt: text('salt').notNull(),
  code: text('code').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  onramps: many(onramps),
  trades: many(trades),
  orders: many(orders),
}));

export const selectUserSchema = createSelectSchema(users, {
  email: schema =>
    schema.email.email().regex(/^([\w.%-]+@[a-z0-9.-]+\.[a-z]{2,6})*$/i),
});

export const verifyUserSchema = z.object({
  query: selectUserSchema.pick({
    email: true,
    code: true,
  }),
});

export const deleteUserSchema = z.object({
  body: selectUserSchema.pick({
    username: true,
  }),
});

export const loginSchema = z.object({
  body: selectUserSchema.pick({
    username: true,
    password: true,
  }),
});

export const addUserSchema = z.object({
  body: selectUserSchema.pick({
    username: true,
    password: true,
    salt: true,
    code: true,
  }),
});

export const updateUserSchema = z.object({
  body: selectUserSchema.pick({
    username: true,
    email: true,
    password: true,
  }).partial(),
});

export const newUserSchema = z.object({
  body: selectUserSchema.pick({
    username: true,
    password: true,
  }),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = z.infer<typeof newUserSchema>['body'];
export type UpdateUser = z.infer<typeof updateUserSchema>['body'];
