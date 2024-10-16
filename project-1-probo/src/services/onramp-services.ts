import type { NewOnramp } from '@/schema/onramp';
import { onramps } from '@/schema/onramp';
import { db } from '@/utils/db';

export async function onrampInr({ userId, amount }: NewOnramp) {
  await db.insert(onramps).values({ userId, amount }).returning();
}
