import type { Router } from 'express';
import {
  handleGenerateNewShortURL,
  handleGetURLVisits,
  handleRedirectURL,
} from '@/controllers/url-controllers';
import { authenticate } from '@/middlewares/auth';
import { createRouter } from '@/utils/create';

export default createRouter((router: Router) => {
  router.post('/', authenticate(), handleGenerateNewShortURL);
  router.get('/:id', handleRedirectURL);
  router.get('/analytics/:id', authenticate(), handleGetURLVisits);
});
