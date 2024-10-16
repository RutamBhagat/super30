import type { Router } from 'express';
import { handleMintTokens } from '@/controllers/trade-controllers';
import { createRouter } from '@/utils/create';

export default createRouter((router: Router) => {
  router.post('/mint', handleMintTokens);
});
