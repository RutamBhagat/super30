import { Buffer } from 'node:buffer';
import { deleteUserSchema, loginSchema, newUserSchema, updateUserSchema, type User, verifyUserSchema } from '@/schema/user';
import { addUser, deleteUser, getUserByUsername, updateUser } from '@/services/user-services';
import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';
import generateToken from '@/utils/jwt';
import argon2 from 'argon2';
import consola from 'consola';

export const handleUserLogin = createHandler(loginSchema, async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserByUsername(username);

  if (!user)
    throw new BackendError('USER_NOT_FOUND');

  const matchPassword = await argon2.verify(user.password, password, {
    salt: Buffer.from(user.salt, 'hex'),
  });
  if (!matchPassword)
    throw new BackendError('INVALID_PASSWORD');

  const token = generateToken(user.id);
  res.status(200).json({ token });
});

export const handleAddUser = createHandler(newUserSchema, async (req, res) => {
  const user = req.body;
  const existingUser = await getUserByUsername(user.username);

  if (existingUser) {
    throw new BackendError('CONFLICT', {
      message: 'User already exists',
    });
  }

  const { user: addedUser } = await addUser(user);

  res.status(201).json({ user: addedUser, message: `User ${user.username} created` });
});

export const handleUserLoginWithoutVerification = createHandler(loginSchema, async (req, res) => {
  const { username } = req.body;
  const user = await getUserByUsername(username);

  if (!user)
    throw new BackendError('USER_NOT_FOUND');

  const token = generateToken(user.id);
  res.status(200).json({ token });
});

export const handleGetUser = createHandler(async (_req, res) => {
  const { user } = res.locals as { user: User };

  res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

export const handleUpdateUser = createHandler(updateUserSchema, async (req, res) => {
  const { user } = res.locals as { user: User };

  const { username, password } = req.body;

  const updatedUser = await updateUser(user, { username, password });

  res.status(200).json({
    user: updatedUser,
  });
});

export const handleDeleteUser = createHandler(deleteUserSchema, async (req, res) => {
  const { username } = req.body;

  const { user } = res.locals as { user: User };

  if (user.username !== username) {
    throw new BackendError('UNAUTHORIZED', {
      message: 'You are not authorized to delete this user',
    });
  }

  const deletedUser = await deleteUser(username);

  res.status(204).json({
    user: deletedUser,
  });
});
