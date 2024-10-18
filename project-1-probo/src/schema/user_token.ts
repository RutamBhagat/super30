import { type InferSelectModel, relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { symbols } from './symbol';
import { users } from './user';

// User Tokens Table
export const userTokens = pgTable('user_tokens', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  stockSymbol: text('stock_symbol').notNull().references(() => symbols.name),
  tokenType: text('token_type').notNull(),
  quantity: integer('quantity').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations
export const userTokensRelations = relations(userTokens, ({ one }) => ({
  user: one(users, {
    fields: [userTokens.userId],
    references: [users.id],
  }),
  symbol: one(symbols, {
    fields: [userTokens.stockSymbol],
    references: [symbols.name],
  }),
}));

// Zod Schemas
export const selectUserTokenSchema = createSelectSchema(userTokens).extend({
  tokenType: z.enum(['yes', 'no']),
});

export const updateUserTokenSchema = z.object({
  body: selectUserTokenSchema.pick({
    quantity: true,
  }),
});

// Types
export type UserToken = z.infer<typeof selectUserTokenSchema>;
export type UpdateUserToken = z.infer<typeof updateUserTokenSchema>['body'];
