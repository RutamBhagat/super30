import type { NewOrder } from '@/schema/order';
import { orders } from '@/schema/order';
import { db } from '@/utils/db';
import { and, eq } from 'drizzle-orm';

export async function sellOrder({ userId, stockSymbol, quantity, price, stockType }: NewOrder) {
  await db.insert(orders).values({ userId, stockSymbol, quantity, price, stockType }).returning();
}

export async function buyOrder({ userId, stockSymbol, quantity, price, stockType }: NewOrder) {
  await db.insert(orders).values({ userId, stockSymbol, quantity, price, stockType }).returning();
}

export async function cancelOrder({ userId, stockSymbol, quantity, price, stockType }: NewOrder) {
  await db.delete(orders).where(and(eq(orders.userId, userId), eq(orders.stockSymbol, stockSymbol), eq(orders.quantity, quantity), eq(orders.price, price), eq(orders.stockType, stockType))).returning();
}
