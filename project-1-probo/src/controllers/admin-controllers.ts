import { deleteUserSchema, type User } from '@/schema/user';
import {
  getAllUsers,
  getAUser,
} from '@/services/admin-services';
import { deleteUser } from '@/services/user-services';
import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';

export const handleGetAllUsers = createHandler(async (_req, res) => {
  const users = await getAllUsers();
  res.status(200).json({
    users,
  });
});

export const handleGetAUser = createHandler(
  async (req, res) => {
    const userId = req.params.id as string;
    const user = await getAUser(userId);
    res.status(200).json(user);
  },
);

export const handleDeleteUserAdmin = createHandler(deleteUserSchema, async (req, res) => {
  const { username } = req.body;

  const { user } = res.locals as { user: User };

  if (!user.isAdmin) {
    throw new BackendError('UNAUTHORIZED', {
      message: 'You are not authorized to delete this user',
    });
  }

  const deletedUser = await deleteUser(username);

  res.status(200).json({
    user: deletedUser,
  });
});

// export const handleDeleteAllUnverifiedUsers = createHandler(async (_req, res) => {
//   const unverfiedUsersCount = await deleteAllUnverifiedUsers();
//   res.status(200).json({
//     message: `${unverfiedUsersCount} unverified users deleted successfully`,
//   });
// });

// export const handleGetAllVerifiedUsers = createHandler(async (_req, res) => {
//   const users = await getAllVerifiedUsers();
//   res.status(200).json({
//     users,
//   });
// });

// export const handleGetAllUsers = createHandler(async (_req, res) => {
//   const users = await getAllUsers();
//   res.status(200).json({
//     users,
//   });
// });
