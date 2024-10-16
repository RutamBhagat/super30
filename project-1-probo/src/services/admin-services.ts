import { users } from '@/schema/user';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';

export async function getAllUsers() {
  return await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      gender: users.gender,
      jobTitle: users.jobTitle,
      isAdmin: users.isAdmin,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users);
}

export async function getAUser(id: string) {
  const [user] = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      gender: users.gender,
      jobTitle: users.jobTitle,
      isAdmin: users.isAdmin,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, id));

  return user;
}

// export async function getAllVerifiedUsers() {
//   return await db
//     .select({
//       id: users.id,
//       name: users.name,
//       email: users.email,
//       isVerified: users.isVerified,
//       isAdmin: users.isAdmin,
//       created_at: users.created_at,
//     })
//     .from(users)
//     .where(and(eq(users.isVerified, true), eq(users.isAdmin, false)));
// }

// export async function getAllUsers() {
//   return await db
//     .select({
//       id: users.id,
//       name: users.name,
//       email: users.email,
//       isVerified: users.isVerified,
//       isAdmin: users.isAdmin,
//       created_at: users.created_at,
//     })
//     .from(users);
// }

// export async function deleteAllUnverifiedUsers() {
//   const deletedUsers = await db
//     .delete(users)
//     .where(eq(users.isVerified, false))
//     .returning();
//   return deletedUsers.length;
// }
