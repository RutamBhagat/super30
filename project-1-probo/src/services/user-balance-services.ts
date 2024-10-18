import { userBalances } from '@/schema/user_balance';
import { db } from '@/utils/db';
import { BackendError } from '@/utils/errors';
import { eq } from 'drizzle-orm';

export async function createUserBalance(userId: string) {
  const [newBalance] = await db
    .insert(userBalances)
    .values({ userId, balance: 0, locked: 0 })
    .returning({
      userId: userBalances.userId,
      balance: userBalances.balance,
      locked: userBalances.locked,
      updatedAt: userBalances.updatedAt,
    });

  if (!newBalance) {
    throw new BackendError('INTERNAL_ERROR', {
      message: 'Failed to create user balance',
    });
  }

  return newBalance;
}

export async function getUserBalance(userId: string) {
  const [balance] = await db.select().from(userBalances).where(eq(userBalances.userId, userId)).limit(1);
  return balance;
}

export async function updateUserBalance(userId: string, balance: number, locked: number) {
  const [updatedBalance] = await db
    .update(userBalances)
    .set({ balance, locked })
    .where(eq(userBalances.userId, userId))
    .returning({
      userId: userBalances.userId,
      balance: userBalances.balance,
      locked: userBalances.locked,
      updatedAt: userBalances.updatedAt,
    });

  if (!updatedBalance) {
    throw new BackendError('NOT_FOUND', {
      message: 'User balance not found',
    });
  }

  return updatedBalance;
}
