import type { Router } from 'express';
import adminRoutes from '@/routes/admin-routes';
import onrampRoutes from '@/routes/onramp-routes';
import orderRoutes from '@/routes/order-routes';
import symbolRoutes from '@/routes/symbol-routes';
import tradeRoutes from '@/routes/trade-routes';
import userRoutes from '@/routes/user-routes';
import { createRouter } from '@/utils/create';
import resetRoutes from './reset-routes';

export default createRouter((router: Router) => {
  router.use('/admin', adminRoutes);
  router.use('/user', userRoutes);
  router.use('/symbol', symbolRoutes);
  router.use('/onramp', onrampRoutes);
  router.use('/trade', tradeRoutes);
  router.use('/order', orderRoutes);
  router.use('/reset', resetRoutes);
});
