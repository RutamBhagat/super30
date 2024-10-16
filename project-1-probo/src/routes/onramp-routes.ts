import type { Router } from 'express';
import { handleOnrampInr } from '@/controllers/onramp-controllers';
import { createRouter } from '@/utils/create';

export default createRouter((router: Router) => {
  router.post('/inr', handleOnrampInr);
});
