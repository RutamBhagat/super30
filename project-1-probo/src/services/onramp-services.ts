import type { NewOnramp } from '@/schema/onramp';
import { onramps } from '@/schema/onramp';
import { userBalances } from '@/schema/user_balance';
import { db } from '@/utils/db';
import { BackendError } from '@/utils/errors';
import { eq } from 'drizzle-orm';

export async function onrampInr({ userId, amount }: NewOnramp) {
  await db.transaction(async (tx) => {
    // Insert the onramp record
    await tx.insert(onramps).values({ userId, amount }).returning();

    // Get the current user balance
    const [currentBalanceResult] = await tx.select({ balance: userBalances.balance })
      .from(userBalances)
      .where(eq(userBalances.userId, userId));

    if (!currentBalanceResult) {
      throw new BackendError('USER_NOT_FOUND', {
        message: 'User balance not found',
      });
    }

    const currentBalance = currentBalanceResult.balance;
    const newBalance = currentBalance + amount;

    // Update the user balance
    await tx.update(userBalances)
      .set({ balance: newBalance })
      .where(eq(userBalances.userId, userId));
  });
}
