import { type InferSelectModel, relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { symbols } from './symbol';
import { users } from './user';

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  stockSymbol: text('stock_symbol').notNull(),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
  stockType: text('stock_type').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

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

export const selectOrderSchema = createSelectSchema(orders, {
  userId: schema => schema.userId.min(1),
  stockSymbol: schema => schema.stockSymbol.min(1),
  quantity: schema => schema.quantity.min(1),
  price: schema => schema.price.min(1),
  stockType: schema => schema.stockType.min(1),
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

export type Order = InferSelectModel<typeof orders>;
export type NewOrder = z.infer<typeof createOrderSchema>['body'];
