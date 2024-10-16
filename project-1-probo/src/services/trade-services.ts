import type { NewTrade } from '@/schema/trade';
import { trades } from '@/schema/trade';
import { db } from '@/utils/db';

export async function mintTokens({ userId, stockSymbol, quantity, price }: NewTrade) {
  await db.insert(trades).values({ userId, stockSymbol, quantity, price }).returning();
}
