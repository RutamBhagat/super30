import type { User } from '@/schema/user';
import { addUrlSchema } from '@/schema/url';
import { addUrl, addVisit, getRedirectURLByID, getRedirectURLForCurrentUser, getRedirectURLVisitCount } from '@/services/url-services';
import { createHandler } from '@/utils/create';
import { BackendError, getStatusFromErrorCode } from '@/utils/errors';
import consola from 'consola';

export const handleGenerateNewShortURL = createHandler(addUrlSchema, async (req, res) => {
  const { user } = res.locals as { user: User };
  const { redirectURL } = req.body;
  consola.log('Received URL body:', redirectURL);

  const existingRedirectURL = await getRedirectURLForCurrentUser(redirectURL, user.id);

  if (existingRedirectURL) {
    throw new BackendError('CONFLICT', {
      message: 'Redirection URL already exists for current User',
    });
  }

  const { newURL } = await addUrl({ redirectURL }, user.id);

  res.status(201).json({ newURL });
});

export const handleRedirectURL = createHandler(
  async (req, res) => {
    const shortId = req.params.id as string;
    const url = await getRedirectURLByID(shortId);

    if (url && url.redirectURL) {
      addVisit({ urlId: url.id });
      res.redirect(url.redirectURL);
    }
    else {
      res.status(getStatusFromErrorCode('NOT_FOUND'));
    }
  },
);

export const handleGetURLVisits = createHandler(
  async (req, res) => {
    const shortId = req.params.id as string;
    const visitCount = await getRedirectURLVisitCount(shortId);

    res.status(200).json({ visitCount });
  },
);
