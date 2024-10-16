import type { NewSymbol } from '@/schema/symbol';
import { symbols } from '@/schema/symbol';
import { db } from '@/utils/db';

export async function createSymbol({ name }: NewSymbol) {
  await db.insert(symbols).values({ name }).returning();
}
