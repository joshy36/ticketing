import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function addEvent(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, description, date, location, image } = req.body;

  switch (req.method) {
    case 'POST':
      try {
        const result = await prisma.event.create({
          data: {
            name: name,
            description: description,
            date: date,
            location: location,
            image: image,
          },
        });
        res.status(201).json(result);
      } catch (e) {
        console.error('Request error', e);
        res.status(500).json({ error: 'Error creating event' });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
