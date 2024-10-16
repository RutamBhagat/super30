import { type InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { trades } from './trade';

export const symbols = pgTable('symbols', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const symbolsRelations = relations(symbols, ({ many }) => ({
  trades: many(trades),
}));

export const selectSymbolSchema = createSelectSchema(symbols, {
  name: schema => schema.name.min(1),
});

export const createSymbolSchema = z.object({
  body: selectSymbolSchema.pick({
    name: true,
  }),
});

export type Symbol = InferSelectModel<typeof symbols>;
export type NewSymbol = z.infer<typeof createSymbolSchema>['body'];
