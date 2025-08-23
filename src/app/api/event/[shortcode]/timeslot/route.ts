import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

type RequestPayload = {
  participantId: string;
  dates: string[]; // Can be ISO strings like "2000-01-01T09:00:00" or weekday format like "MonT10:00:00.000Z"
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

function parseDateTime(dateStr: string) {
  // Check if it's a weekday format like "MonT10:00:00.000Z"
  const weekdayMatch = dateStr.match(
    /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)T(\d{2}):(\d{2}):(\d{2})(?:\.\d{3})?Z?$/,
  );

  if (weekdayMatch) {
    const [, weekdayAbbr, hourStr, minuteStr] = weekdayMatch;

    // Map abbreviated weekdays to full names
    const weekdayMap: Record<string, string> = {
      Mon: 'Monday',
      Tue: 'Tuesday',
      Wed: 'Wednesday',
      Thu: 'Thursday',
      Fri: 'Friday',
      Sat: 'Saturday',
      Sun: 'Sunday',
    };

    return {
      type: 'weekday' as const,
      weekday: weekdayAbbr.toLocaleLowerCase(),
      fullWeekday: weekdayMap[weekdayAbbr],
      hour: parseInt(hourStr),
      minute: parseInt(minuteStr),
    };
  }

  // Try to parse as regular ISO date
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    const eventDate = new Date(dateStr);
    eventDate.setUTCHours(0, 0, 0, 0);

    return {
      type: 'date' as const,
      date: eventDate,
      hour: date.getUTCHours(),
      minute: date.getUTCMinutes(),
    };
  }

  return null;
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
      console.error('❌ Invalid payload:', {
        participantId,
        datesIsArray: Array.isArray(dates),
      });
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    const event = await prisma.event.findUnique({
      where: { shortCode: shortcode },
    });

    if (!event) {
      console.error('❌ Event not found:', shortcode);
      return NextResponse.json(
        { error: 'Event not found' },
        { status: StatusCodes.NOT_FOUND },
      );
    }

    const participant = await prisma.participant.findFirst({
      where: { id: participantId, eventId: event.id },
    });

    if (!participant) {
      console.error('❌ Participant not found:', {
        participantId,
        eventId: event.id,
      });
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
      const parsed = parseDateTime(dateStr);
      if (!parsed) {
        console.warn(`Skipping invalid date format: ${dateStr}`);
        continue;
      }

      let eventDate;

      if (parsed.type === 'weekday') {
        // Handle weekday
        eventDate = await prisma.eventDate.findFirst({
          where: {
            eventId: event.id,
            weekday: parsed.weekday,
            date: null, // Ensure we're looking for weekday entries, not date entries
          },
        });

        if (!eventDate) {
          eventDate = await prisma.eventDate.create({
            data: {
              eventId: event.id,
              weekday: parsed.weekday,
              date: null,
            },
          });
        }
      } else {
        // Handle specific date
        eventDate = await prisma.eventDate.findFirst({
          where: {
            eventId: event.id,
            date: parsed.date,
            weekday: null, // Ensure we're looking for date entries, not weekday entries
          },
        });

        if (!eventDate) {
          eventDate = await prisma.eventDate.create({
            data: {
              eventId: event.id,
              date: parsed.date,
              weekday: null,
            },
          });
        }
      }

      try {
        const slot = await prisma.timeSlot.create({
          data: {
            eventId: event.id,
            eventDateId: eventDate.id,
            participantId,
            hour: parsed.hour,
            minute: parsed.minute,
          },
        });
        createdSlots.push(slot);
      } catch (err) {
        // Handle duplicate slot creation gracefully
        if (!replace) {
          console.warn(
            `⚠️ Slot already exists for ${dateStr}, skipping. Error: ${err}`,
          );
          continue;
        }
        console.error(`❌ Failed to create timeslot for ${dateStr}:`, err);
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
    console.error('💥 Internal server error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
