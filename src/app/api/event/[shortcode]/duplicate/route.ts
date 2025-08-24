import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { sqids } from '@/lib/sqids';

async function generateUniqueSqid(numbers: number[]): Promise<string> {
  let sqid = sqids.encode(numbers);
  let exists = await prisma.event.findUnique({ where: { shortCode: sqid } });
  let attempt = 1;
  // On conflict, vary numbers input (e.g. add attempt count) to get new code
  while (exists) {
    sqid = sqids.encode([...numbers, attempt]);
    exists = await prisma.event.findUnique({ where: { shortCode: sqid } });
    attempt++;
  }
  return sqid;
}

// Duplicate event by shortcode
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ shortcode: string }> },
) {
  try {
    const { shortcode } = await context.params;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { shortCode: shortcode },
      include: {
        EventDates: true,
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: StatusCodes.NOT_FOUND },
      );
    }

    // Generate a new short code for the duplicated event
    const baseNumbers = [
      Date.now(),
      existingEvent.title.length,
      Math.floor(Math.random() * 1000), // Add randomness
    ];

    const newShortCode = await generateUniqueSqid(baseNumbers);

    // Duplicate the event
    const duplicatedEvent = await prisma.event.create({
      data: {
        title: `${existingEvent.title} (Copy)`,
        shortCode: newShortCode,
        creatorId: existingEvent.creatorId,
        folderId: existingEvent.folderId, // Keep same folder
        timezone: existingEvent.timezone,
        startTime: existingEvent.startTime,
        endTime: existingEvent.endTime,
        timeIncrement: existingEvent.timeIncrement,
        EventDates: {
          create: existingEvent.EventDates.map((eventDate) => ({
            date: eventDate.date,
            weekday: eventDate.weekday,
          })),
        },
      },
      include: {
        EventDates: {
          include: {
            TimeSlot: {
              include: {
                participant: {
                  select: {
                    id: true,
                    name: true,
                    userId: true,
                  },
                },
              },
            },
          },
        },
        Participant: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(duplicatedEvent, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error('Error duplicating event by shortcode:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
