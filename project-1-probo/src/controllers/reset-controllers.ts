import { createOnrampSchema } from '@/schema/onramp';
import { resetDB } from '@/services/reset-services';
import { createHandler } from '@/utils/create';

export const handleReset = createHandler(createOnrampSchema, async (req, res) => {
  await resetDB();
  res.status(204).json({ message: 'Database reset successfully' });
});
