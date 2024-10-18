import { onramps } from '@/schema/onramp';
import { orders } from '@/schema/order';
import { symbols } from '@/schema/symbol';
import { trades } from '@/schema/trade';
import { users } from '@/schema/user';
import { userBalances } from '@/schema/user_balance';
import { userTokens } from '@/schema/user_token';
import { db } from '@/utils/db';

export async function resetDB() {
  await db.delete(onramps);
  await db.delete(orders);
  await db.delete(symbols);
  await db.delete(trades);
  await db.delete(userBalances);
  await db.delete(userTokens);
  await db.delete(users);
}
