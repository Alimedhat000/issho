import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      shortCode: providedShortCode,
      dates = [],
      weekDays = [],
      startTime,
      endTime,
      timeIncrement,
      timezone,
      creatorId,
      folderId,
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    if (dates.length === 0 && weekDays.length === 0) {
      return NextResponse.json(
        { error: 'Either dates or weekDays must be provided' },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    if (dates.length !== 0 && weekDays.length !== 0) {
      return NextResponse.json(
        { error: 'Provide dates or weekDays' },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    if (folderId && creatorId) {
      const folder = await prisma.folder.findUnique({
        where: { id: folderId },
      });

      if (!folder || folder.userId !== creatorId) {
        return NextResponse.json(
          { error: 'Invalid folder' },
          { status: StatusCodes.BAD_REQUEST },
        );
      }
    }

    let finalShortCode = providedShortCode;
    if (!finalShortCode) {
      // Use timestamp + title length + creatorId length as base numbers for sqid
      const baseNumbers = [
        Date.now(),
        title.length,
        creatorId ? creatorId.length : 0,
      ];

      try {
        finalShortCode = await generateUniqueSqid(baseNumbers);
        console.log(finalShortCode);
      } catch {
        return NextResponse.json(
          { error: 'Unable to generate unique shortCode' },
          { status: StatusCodes.INTERNAL_SERVER_ERROR },
        );
      }
    } else {
      // Check if provided shortCode is unique
      const existingEvent = await prisma.event.findUnique({
        where: { shortCode: finalShortCode },
      });

      if (existingEvent) {
        return NextResponse.json(
          { error: 'Short code already exists' },
          { status: StatusCodes.CONFLICT },
        );
      }
    }

    const eventDatesData: Array<{ date?: Date; weekday?: string }> = [];

    // Add specific dates
    if (dates.length > 0) {
      dates.forEach((dateString: string) => {
        eventDatesData.push({
          date: new Date(dateString),
          weekday: undefined,
        });
      });
    }

    if (weekDays.length > 0) {
      weekDays.forEach((weekday: string) => {
        eventDatesData.push({
          date: undefined,
          weekday: weekday.toLowerCase(),
        });
      });
    }

    const event = await prisma.event.create({
      data: {
        title,
        shortCode: finalShortCode,
        creatorId: creatorId || null,
        timezone,
        startTime,
        endTime,
        timeIncrement,
        EventDates: {
          create: eventDatesData,
        },
      },
      include: {
        EventDates: true,
        Participant: true,
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
          },
        },
      },
    });

    const isFullDayEvent = !startTime && !endTime;

    // if (isFullDayEvent && eventDatesData.length > 0) {
    //   // Get the created event dates to create TimeSlots
    //   const createdEventDates = await prisma.eventDate.findMany({
    //     where: { eventId: event.id },
    //   });
    //   // Create a fullDay TimeSlot for each EventDate
    //   // Note: These are placeholder slots. Participants will be added later when they join
    //   createdEventDates.map((eventDate: EventDate) => ({
    //     eventDateId: eventDate.id,
    //     hour: 0,
    //     minute: 0,
    //     fullDay: true,
    //     participantId: '', // Will be filled when participants join
    //     eventId: event.id,
    //   }));

    //   // We'll store this info in the response but not create TimeSlots without participants
    //   // The frontend will know it's a fullDay event and handle accordingly
    // }

    return NextResponse.json(
      {
        ...event,
        timeIncrement,
        isFullDayEvent,
      },
      { status: StatusCodes.CREATED },
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: StatusCodes.UNAUTHORIZED },
      );
    }

    const events = await prisma.event.findMany({
      where: { creatorId: currentUser.userId },
      include: {
        EventDates: true,
        Participant: true,
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
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Show newest events first
      },
    });

    return NextResponse.json(events, { status: StatusCodes.OK });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
