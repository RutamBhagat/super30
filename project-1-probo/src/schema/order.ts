import { type InferSelectModel, relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { symbols } from './symbol';
import { users } from './user';

// Orders Table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  stockSymbol: text('stock_symbol').notNull().references(() => symbols.name),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
  stockType: text('stock_type').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations
export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  symbol: one(symbols, {
    fields: [orders.stockSymbol],
    references: [symbols.name],
  }),
}));

// Zod Schemas
export const selectOrderSchema = createSelectSchema(orders).extend({
  stockType: z.enum(['yes', 'no']),
  status: z.enum(['pending', 'filled', 'cancelled']),
});

export const createOrderSchema = z.object({
  body: selectOrderSchema.pick({
    userId: true,
    stockSymbol: true,
    quantity: true,
    price: true,
    stockType: true,
  }),
});

// Types
export type Order = InferSelectModel<typeof orders>;
export type NewOrder = z.infer<typeof createOrderSchema>['body'];
