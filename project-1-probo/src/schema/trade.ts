import { type InferSelectModel, relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { symbols } from './symbol';
import { users } from './user';

// Trades Table
export const trades = pgTable('trades', {
  id: serial('id').primaryKey(),
  buyerId: uuid('buyer_id').notNull().references(() => users.id),
  sellerId: uuid('seller_id').notNull().references(() => users.id),
  stockSymbol: text('stock_symbol').notNull().references(() => symbols.name),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
  stockType: text('stock_type').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations
export const tradesRelations = relations(trades, ({ one }) => ({
  buyer: one(users, {
    fields: [trades.buyerId],
    references: [users.id],
  }),
  seller: one(users, {
    fields: [trades.sellerId],
    references: [users.id],
  }),
  symbol: one(symbols, {
    fields: [trades.stockSymbol],
    references: [symbols.name],
  }),
}));

// Zod Schemas
export const selectTradeSchema = createSelectSchema(trades).extend({
  stockType: z.enum(['yes', 'no']),
});

export const createTradeSchema = z.object({
  body: selectTradeSchema.pick({
    buyerId: true,
    sellerId: true,
    stockSymbol: true,
    quantity: true,
    price: true,
    stockType: true,
  }),
});

// Types
export type Trade = InferSelectModel<typeof trades>;
export type NewTrade = z.infer<typeof createTradeSchema>['body'];
