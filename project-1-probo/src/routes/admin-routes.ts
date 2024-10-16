import type { Router } from 'express';
import {
  handleGetAllUsers,
  handleGetAUser,
  //   handleDeleteAllUnverifiedUsers,
  //   handleGetAllVerifiedUsers,
} from '@/controllers/admin-controllers';
import { createRouter } from '@/utils/create';
// import { authenticate } from '@/middlewares/auth';

export default createRouter((router: Router) => {
//   router.use(
//     authenticate({
//       verifyAdmin: true,
//     }),
//   );
  router.get('/all-users', handleGetAllUsers);
  router.get('/user/:id', handleGetAUser);
//   router.get('/all-verfied-users', handleGetAllVerifiedUsers);
//   router.delete('/remove-unverified-users', handleDeleteAllUnverifiedUsers);
});
