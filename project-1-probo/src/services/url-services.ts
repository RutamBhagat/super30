import crypto from 'node:crypto';
import { url } from 'node:inspector';
import { type NewUrl, urls } from '@/schema/url';
import { type NewVisitHistory, visitHistory } from '@/schema/visit-history';
import { db } from '@/utils/db';
import { BackendError } from '@/utils/errors';
import { and, count, eq } from 'drizzle-orm';

export async function getRedirectURLForCurrentUser(redirectURL: string, userId: string) {
  const [url] = await db
    .select()
    .from(urls)
    .where(
      and(
        eq(urls.redirectURL, redirectURL),
        eq(urls.userId, userId),
      ),
    )
    .limit(1);
  return url;
}

export async function addUrl(url: NewUrl, userId: string) {
  const { redirectURL } = url;
  const shortID = crypto.randomBytes(8).toString('hex');

  const [newURL] = await db
    .insert(urls)
    .values({
      redirectURL,
      shortID,
      userId,
    })
    .returning({
      id: urls.id,
      shortID: urls.shortID,
      redirectURL: urls.redirectURL,
      userId: urls.userId,
      createdAt: urls.createdAt,
      updatedAt: urls.updatedAt,
    });

  if (!newURL) {
    throw new BackendError('INTERNAL_ERROR', {
      message: 'Failed to add URL',
    });
  }

  return { newURL };
}

export async function addVisit(visit: NewVisitHistory) {
  const { urlId } = visit;

  const [newVisitHistory] = await db
    .insert(visitHistory)
    .values({
      urlId,
    })
    .returning({
      id: visitHistory.id,
      urlId: visitHistory.urlId,
      createdAt: visitHistory.createdAt,
    });

  if (!newVisitHistory) {
    throw new BackendError('INTERNAL_ERROR', {
      message: 'Failed to add visit',
    });
  }

  return { newVisitHistory };
}

export async function getRedirectURLByID(shortId: string) {
  const [url] = await db
    .select({
      id: urls.id,
      shortID: urls.shortID,
      redirectURL: urls.redirectURL,
      userId: urls.userId,
      createdAt: urls.createdAt,
      updatedAt: urls.updatedAt,
    })
    .from(urls)
    .where(
      eq(urls.shortID, shortId),
    )
    .limit(1);
  return url;
}

export async function getRedirectURLVisitCount(shortId: string) {
  const [result] = await db
    .select({ count: count() })
    .from(visitHistory)
    .leftJoin(urls, eq(visitHistory.urlId, urls.id))
    .where(eq(urls.shortID, shortId));

  return result?.count;
}
