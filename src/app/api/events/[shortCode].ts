import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { StatusCodes } from 'http-status-codes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { shortCode } = req.query;

  if (req.method === 'GET') {
    if (typeof shortCode !== 'string') {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Invalid shortCode' });
    }
    const event = await prisma.event.findUnique({ where: { sqid: shortCode } });

    if (!event) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Event not found' });
    }

    res.json(event);
  } else {
    res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: 'Method not allowed' });
  }
}
