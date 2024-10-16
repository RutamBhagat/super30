import { type InferSelectModel, relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { symbols } from './symbol';
import { users } from './user';

export const trades = pgTable('trades', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  stockSymbol: text('stock_symbol').notNull(),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const tradesRelations = relations(trades, ({ one }) => ({
  user: one(users, {
    fields: [trades.userId],
    references: [users.id],
  }),
  symbol: one(symbols, {
    fields: [trades.stockSymbol],
    references: [symbols.name],
  }),
}));

export const selectTradeSchema = createSelectSchema(trades, {
  userId: schema => schema.userId.min(1),
  stockSymbol: schema => schema.stockSymbol.min(1),
  quantity: schema => schema.quantity.min(1),
  price: schema => schema.price.min(1),
});

export const createTradeSchema = z.object({
  body: selectTradeSchema.pick({
    userId: true,
    stockSymbol: true,
    quantity: true,
    price: true,
  }),
});

export type Trade = InferSelectModel<typeof trades>;
export type NewTrade = z.infer<typeof createTradeSchema>['body'];
