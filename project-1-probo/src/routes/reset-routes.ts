import type { Router } from 'express';
import { handleReset } from '@/controllers/reset-controllers';
import { createRouter } from '@/utils/create';

export default createRouter((router: Router) => {
  router.post('/', handleReset);
});
