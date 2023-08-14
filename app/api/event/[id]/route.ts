import { NextRequest, NextResponse } from 'next/server';
import { Event } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const url = req.url;
    const id = url.substring(url.lastIndexOf('/') + 1);
    const event: Event = await prisma.event.findUnique({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ event });
  } catch (e) {
    console.error('Request error', e);
    return NextResponse.json(
      { error: 'Error fetching event' },
      { status: 500 }
    );
  }
}
