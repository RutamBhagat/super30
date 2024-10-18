import { type InferSelectModel, relations } from 'drizzle-orm';
import { integer, pgTable, serial, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './user';

// Onramps Table
export const onramps = pgTable('onramps', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  amount: integer('amount').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations
export const onrampsRelations = relations(onramps, ({ one }) => ({
  user: one(users, {
    fields: [onramps.userId],
    references: [users.id],
  }),
}));

// Zod Schemas
export const selectOnrampSchema = createSelectSchema(onramps);

export const createOnrampSchema = z.object({
  body: selectOnrampSchema.pick({
    userId: true,
    amount: true,
  }),
});

// Types
export type Onramp = InferSelectModel<typeof onramps>;
export type NewOnramp = z.infer<typeof createOnrampSchema>['body'];
