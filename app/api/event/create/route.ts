import { NextRequest, NextResponse } from 'next/server';
import { Event } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { name, description, date, location, image } = await req.json();
    const result: Event = await prisma.event.create({
      data: {
        name: name,
        description: description,
        date: date,
        location: location,
        image: image,
      },
    });
    return NextResponse.json({ result });
  } catch (e) {
    console.error('Request error', e);
    return NextResponse.json(
      { error: 'Error creating event' },
      { status: 500 }
    );
  }
}
