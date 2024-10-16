import { Buffer } from 'node:buffer';
import { deleteUserSchema, loginSchema, newUserSchema, updateUserSchema, type User, verifyUserSchema } from '@/schema/user';
import { addUser, deleteUser, getUserByEmail, updateUser } from '@/services/user-services';
import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';
import generateToken from '@/utils/jwt';
import argon2 from 'argon2';
import consola from 'consola';

export const handleAddUser = createHandler(newUserSchema, async (req, res) => {
  const user = req.body;
  consola.log('Received body:', req.body);
  const existingUser = await getUserByEmail(user.email);

  if (existingUser) {
    throw new BackendError('CONFLICT', {
      message: 'User already exists',
    });
  }

  const { user: addedUser } = await addUser(user);

  // Uncomment and implement email verification if needed
  // const status = await sendVerificationEmail(
  //   process.env.API_BASE_URL,
  //   addedUser.firstName,
  //   addedUser.lastName,
  //   addedUser.email,
  //   code,
  // );

  // if (status !== 200) {
  //   await deleteUser(addedUser.email);
  //   throw new BackendError('INTERNAL_ERROR', {
  //     message: 'Failed to signup user',
  //   });
  // }

  res.status(201).json(addedUser);
});

export const handleUserLogin = createHandler(loginSchema, async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);

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

export const handleUserLoginWithoutVerification = createHandler(loginSchema, async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);

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
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      jobTitle: user.jobTitle,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

export const handleUpdateUser = createHandler(updateUserSchema, async (req, res) => {
  const { user } = res.locals as { user: User };

  const { firstName, lastName, email, gender, jobTitle, password } = req.body;

  const updatedUser = await updateUser(user, { firstName, lastName, email, gender, jobTitle, password });

  res.status(200).json({
    user: updatedUser,
  });
});

export const handleDeleteUser = createHandler(deleteUserSchema, async (req, res) => {
  const { email } = req.body;

  const { user } = res.locals as { user: User };

  // consola.log('Received Email:', email);
  // consola.log('Token User Email:', user.email);

  if (user.email !== email) {
    throw new BackendError('UNAUTHORIZED', {
      message: 'You are not authorized to delete this user',
    });
  }

  const deletedUser = await deleteUser(email);

  res.status(204).json({
    user: deletedUser,
  });
});

// export const handleVerifyUser = createHandler(verifyUserSchema, async (req, res) => {
//   try {
//     const { email, code } = req.query;

//     await verifyUser(email, code);
//     const template = render(
//       UserVerified({ status: 'verified', message: 'User verified successfully' }),
//     );
//     res.status(200).send(template);
//   }
//   catch (err) {
//     if (err instanceof BackendError) {
//       const template = render(
//         UserVerified({
//           status: 'invalid',
//           message: err.message,
//           error: 'Invalid Request',
//         }),
//       );
//       res.status(getStatusFromErrorCode(err.code)).send(template);
//       return;
//     }
//     throw err;
//   }
// });
