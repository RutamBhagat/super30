import { createOnrampSchema } from '@/schema/onramp';
import { onrampInr } from '@/services/onramp-services';
import { createHandler } from '@/utils/create';

export const handleOnrampInr = createHandler(createOnrampSchema, async (req, res) => {
  const { userId, amount } = req.body;
  await onrampInr({ userId, amount });
  res.status(200).json({ message: `Onramped ${userId} with amount ${amount}` });
});
