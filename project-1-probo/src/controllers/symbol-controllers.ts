import { createSymbol } from '@/services/symbol-services';
import { createHandler } from '@/utils/create';

export const handleCreateSymbol = createHandler(async (req, res) => {
  const symbol = req.params.symbol as string;
  await createSymbol({ name: symbol });
  res.status(201).json({ message: `Symbol ${symbol} created` });
});
