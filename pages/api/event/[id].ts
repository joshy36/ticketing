import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { Event } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { method } = req;
  switch (method) {
    case 'GET':
      try {
        const event: Event = await prisma.event.findUnique({
          where: {
            id: Number(id),
          },
        });
        res.status(200).json(event);
      } catch (e) {
        console.error('Request error', e);
        res.status(500).json({ error: 'Error fetching event' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
