import crypto from 'node:crypto';
import process from 'node:process';
import { type NewUser, type UpdateUser, type User, users } from '@/schema/user';
import { createUserBalance } from '@/services/user-balance-services';
import { db } from '@/utils/db';
import { BackendError } from '@/utils/errors';
import { sha256 } from '@/utils/hash';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm'; // Import the createUserBalance function

export async function getUserByUsername(username: string) {
  const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return user;
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user;
}

export async function addUser(user: NewUser) {
  const { password, ...userDetails } = user;

  const salt = crypto.randomBytes(32);
  const code = crypto.randomBytes(32).toString('hex');
  const hashedPassword = await argon2.hash(password, {
    salt,
  });

  const [newUser] = await db
    .insert(users)
    .values({
      ...userDetails,
      password: hashedPassword,
      salt: salt.toString('hex'),
      code,
    })
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      isAdmin: users.isAdmin,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  if (!newUser) {
    throw new BackendError('INTERNAL_ERROR', {
      message: 'Failed to add user',
    });
  }

  // Create a user balance record
  await createUserBalance(newUser.id);

  return { user: newUser, code };
}

export async function deleteUser(username: string) {
  const user = await getUserByUsername(username);

  if (!user)
    throw new BackendError('USER_NOT_FOUND');

  const [deletedUser] = await db.delete(users).where(eq(users.username, username)).returning({
    id: users.id,
    username: users.username,
  });

  return deletedUser;
}

export async function getUserByUserId(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user;
}

export async function updateUser(user: User, { username, password }: UpdateUser) {
  let code: string | undefined;
  let hashedCode: string | undefined;

  if (username) {
    const user = await getUserByUsername(username);

    if (user) {
      throw new BackendError('CONFLICT', {
        message: 'Username already in use',
        details: { username },
      });
    }

    code = crypto.randomBytes(32).toString('hex');
    hashedCode = sha256.hash(code);
  }

  const [updatedUser] = await db
    .update(users)
    .set({
      username,
      password,
      code: hashedCode,
      isVerified: hashedCode ? false : user.isVerified,
    })
    .where(eq(users.username, user.username))
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      isAdmin: users.isAdmin,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  if (!updatedUser) {
    throw new BackendError('USER_NOT_FOUND', {
      message: 'User could not be updated',
    });
  }
  return updatedUser;
}
