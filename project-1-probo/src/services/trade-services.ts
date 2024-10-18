import type { NewTrade } from '@/schema/trade';
import { onramps } from '@/schema/onramp';
import { trades } from '@/schema/trade';
import { db } from '@/utils/db';
import { BackendError } from '@/utils/errors';
import { eq } from 'drizzle-orm';

export async function mintTokens({ userId, stockSymbol, quantity, price }: NewTrade) {
  await db.transaction(async (tx) => {
    // Insert the trade for 'yes' tokens
    await tx.insert(trades).values({
      userId,
      sellerId: userId, // Assuming the user is both the buyer and seller for minting
      stockSymbol,
      quantity,
      price,
      stockType: 'yes',
    }).returning();

    // Insert the trade for 'no' tokens
    await tx.insert(trades).values({
      userId,
      sellerId: userId, // Assuming the user is both the buyer and seller for minting
      stockSymbol,
      quantity,
      price,
      stockType: 'no',
    }).returning();

    const [currentAmountResult] = await tx.select({ amount: onramps.amount })
      .from(onramps)
      .where(eq(onramps.userId, userId));

    if (!currentAmountResult) {
      throw new BackendError('USER_NOT_FOUND', {
        message: 'User not found',
      });
    }

    const currentAmount = currentAmountResult.amount;
    const newAmount = currentAmount - (quantity * price * 2); // Deduct for both 'yes' and 'no' tokens

    if (newAmount < 0) {
      throw new BackendError('NOT_ACCEPTABLE', {
        message: 'Not enough balance',
      });
    }

    await tx.update(onramps)
      .set({ amount: newAmount })
      .where(eq(onramps.userId, userId));
  });
}
