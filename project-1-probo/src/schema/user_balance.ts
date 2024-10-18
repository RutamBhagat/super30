import { type InferSelectModel, relations } from 'drizzle-orm';
import { integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './user';

// User Balances Table
export const userBalances = pgTable('user_balances', {
  userId: uuid('user_id').primaryKey().references(() => users.id),
  balance: integer('balance').notNull().default(0),
  locked: integer('locked').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations
export const userBalancesRelations = relations(userBalances, ({ one }) => ({
  user: one(users, {
    fields: [userBalances.userId],
    references: [users.id],
  }),
}));

// Zod Schemas
export const selectUserBalanceSchema = createSelectSchema(userBalances);

export const updateUserBalanceSchema = z.object({
  body: selectUserBalanceSchema.pick({
    balance: true,
    locked: true,
  }),
});

// Types
export type UserBalance = z.infer<typeof selectUserBalanceSchema>;
export type UpdateUserBalance = z.infer<typeof updateUserBalanceSchema>['body'];
