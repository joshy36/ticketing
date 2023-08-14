import { NextRequest, NextResponse } from 'next/server';
import { Event } from '@prisma/client';
import prisma from '@/lib/prisma';

export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const events: Event[] = await prisma.event.findMany();
    return NextResponse.json({ events });
  } catch (e) {
    console.error('Request error', e);
    return NextResponse.json(
      { error: 'Error fetching event' },
      { status: 500 }
    );
  }
}
