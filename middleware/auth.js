import { getSession } from 'next-auth/react';

export const authenticate = async (req, res, next) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  req.user = session.user;
  next();
};