import { type InferSelectModel, relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './user';

export const onramps = pgTable('onramps', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  amount: integer('amount').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const onrampsRelations = relations(onramps, ({ one }) => ({
  user: one(users, {
    fields: [onramps.userId],
    references: [users.id],
  }),
}));

export const selectOnrampSchema = createSelectSchema(onramps, {
  userId: schema => schema.userId.min(1),
  amount: schema => schema.amount.min(1),
});

export const createOnrampSchema = z.object({
  body: selectOnrampSchema.pick({
    userId: true,
    amount: true,
  }),
});

export type Onramp = InferSelectModel<typeof onramps>;
export type NewOnramp = z.infer<typeof createOnrampSchema>['body'];
