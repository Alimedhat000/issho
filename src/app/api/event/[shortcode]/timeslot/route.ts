import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

type RequestPayload = {
  participantId: string;
  dates: string[]; // ISO strings like 2000-01-01T09:00:00
};

// POST → add slots
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ shortcode: string }> },
) {
  return handleUpsert(req, context, false);
}

// PUT → replace slots
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ shortcode: string }> },
) {
  return handleUpsert(req, context, true);
}

async function handleUpsert(
  req: NextRequest,
  context: { params: Promise<{ shortcode: string }> },
  replace: boolean,
) {
  try {
    const { shortcode } = await context.params;
    const { participantId, dates } = (await req.json()) as RequestPayload;

    if (!participantId || !Array.isArray(dates)) {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    const event = await prisma.event.findUnique({
      where: { shortCode: shortcode },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: StatusCodes.NOT_FOUND },
      );
    }

    const participant = await prisma.participant.findFirst({
      where: { id: participantId, eventId: event.id },
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found for event' },
        { status: StatusCodes.NOT_FOUND },
      );
    }

    // If replace = true, clear existing slots first
    if (replace) {
      await prisma.timeSlot.deleteMany({
        where: {
          eventId: event.id,
          participantId,
        },
      });
    }

    const createdSlots = [];
    for (const dateStr of dates) {
      const eventdate = new Date(dateStr);
      const date = new Date(dateStr);

      if (isNaN(date.getTime())) continue;

      eventdate.setUTCHours(0, 0, 0, 0);

      // Ensure EventDate exists
      let eventDate = await prisma.eventDate.findFirst({
        where: { eventId: event.id, date: eventdate },
      });

      if (!eventDate) {
        eventDate = await prisma.eventDate.create({
          data: { eventId: event.id, date: eventdate },
        });
      }

      const hour = date.getUTCHours();
      const minute = date.getUTCMinutes();

      try {
        const slot = await prisma.timeSlot.create({
          data: {
            eventId: event.id,
            eventDateId: eventDate.id,
            participantId,
            hour,
            minute,
          },
        });
        createdSlots.push(slot);
      } catch (err) {
        console.error(err);
        return NextResponse.json(
          { error: 'Failed to create timeslot' },
          { status: StatusCodes.INTERNAL_SERVER_ERROR },
        );
      }
    }

    return NextResponse.json(createdSlots, {
      status: replace ? StatusCodes.OK : StatusCodes.CREATED,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
