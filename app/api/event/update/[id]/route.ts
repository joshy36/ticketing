import { NextRequest, NextResponse } from 'next/server';
import { Event } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const url = req.url;
    const id = url.substring(url.lastIndexOf('/') + 1);

    const { name, description, date, location, image } = await req.json();

    const updateData: {
      name?: string;
      description?: string;
      date?: Date;
      location?: string;
      image?: string;
    } = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (date) updateData.date = date;
    if (location) updateData.location = location;
    if (image) updateData.image = image;
    console.log(updateData);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update!' },
        { status: 400 }
      );
    }

    const updateEvent: Event = await prisma.event.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return NextResponse.json({ updateEvent });
  } catch (e) {
    console.error('Request error', e);
    return NextResponse.json(
      { error: 'Error creating event' },
      { status: 500 }
    );
  }
}
