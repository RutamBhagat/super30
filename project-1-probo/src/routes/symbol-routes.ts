import type { Router } from 'express';
import { handleCreateSymbol } from '@/controllers/symbol-controllers';
import { createRouter } from '@/utils/create';

export default createRouter((router: Router) => {
  router.post('/create/:symbol', handleCreateSymbol);
});
