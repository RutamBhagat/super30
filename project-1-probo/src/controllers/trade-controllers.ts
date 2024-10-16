import { createTradeSchema } from '@/schema/trade';
import { mintTokens } from '@/services/trade-services';
import { createHandler } from '@/utils/create';

export const handleMintTokens = createHandler(createTradeSchema, async (req, res) => {
  const { userId, stockSymbol, quantity, price } = req.body;
  await mintTokens({ userId, stockSymbol, quantity, price });
  res.status(200).json({ message: `Minted ${quantity} 'yes' and 'no' tokens for user ${userId}, remaining balance is 0` });
});
