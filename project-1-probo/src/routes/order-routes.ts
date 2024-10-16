import type { Router } from 'express';
import { handleBuyOrder, handleCancelOrder, handleSellOrder } from '@/controllers/order-controllers';
import { createRouter } from '@/utils/create';

export default createRouter((router: Router) => {
  router.post('/sell', handleSellOrder);
  router.post('/buy', handleBuyOrder);
  router.post('/cancel', handleCancelOrder);
});
