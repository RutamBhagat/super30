import type { NewSymbol } from '@/schema/symbol';
import { symbols } from '@/schema/symbol';
import { db } from '@/utils/db';
import { BackendError } from '@/utils/errors';
import { eq } from 'drizzle-orm';

export async function createSymbol({ name }: NewSymbol) {
  try {
    const [existingSymbol] = await db
      .select()
      .from(symbols)
      .where(eq(symbols.name, name));

    if (existingSymbol) {
      throw new BackendError('CONFLICT', {
        message: 'Symbol with this name already exists',
        details: { name },
      });
    }

    const result = await db
      .insert(symbols)
      .values({ name })
      .returning({
        name: symbols.name,
      });

    return result[0];
  }
  catch (error) {
    if (error instanceof BackendError) {
      throw error;
    }
    throw error;
  }
}
