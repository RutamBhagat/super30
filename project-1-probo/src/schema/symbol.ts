import { type InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Symbols Table
export const symbols = pgTable('symbols', {
  name: text('name').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Zod Schemas
export const selectSymbolSchema = createSelectSchema(symbols);

export const createSymbolSchema = z.object({
  body: selectSymbolSchema.pick({
    name: true,
  }),
});

// Types
export type Symbol = InferSelectModel<typeof symbols>;
export type NewSymbol = z.infer<typeof createSymbolSchema>['body'];
