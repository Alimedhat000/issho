import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  // res: NextResponse,
  context: { params: Promise<{ shortcode: string }> },
) {
  try {
    const { shortcode } = await context.params;

    console.log(shortcode);

    const event = await prisma.event.findUnique({
      where: { shortCode: shortcode },
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

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: StatusCodes.NOT_FOUND },
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}

export async function POST(
  req: NextRequest,
  // res: NextResponse,
  context: { params: Promise<{ shortcode: string }> },
) {
  try {
    const { shortcode } = await context.params;

    const body = await req.json();

    const {
      title,
      dates,
      weekDays,
      startTime,
      endTime,
      timeIncrement,
      timezone,
      creatorId,
    } = body;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { shortCode: shortcode },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: StatusCodes.NOT_FOUND },
      );
    }

    // Update event in a transaction
    const updatedEvent = await prisma.$transaction(async (tx) => {
      // Update basic event info
      const event = await tx.event.update({
        where: { shortCode: shortcode },
        data: {
          title: title !== undefined ? title : existingEvent.title,
          timezone: timezone !== undefined ? timezone : existingEvent.timezone,
          startTime:
            startTime !== undefined ? startTime : existingEvent.startTime,
          endTime: endTime !== undefined ? endTime : existingEvent.endTime,
          creatorId:
            creatorId !== undefined ? creatorId : existingEvent.creatorId,
        },
      });
      // Handle event dates update if provided
      if (dates !== undefined || weekDays !== undefined) {
        // Delete existing event dates (and cascade time slots)
        await tx.eventDate.deleteMany({
          where: { eventId: event.id },
        });

        // Prepare new event dates data
        const eventDatesData: Array<{
          eventId: string;
          date?: Date;
          weekday?: string;
        }> = [];

        // Add specific dates
        if (dates && dates.length > 0) {
          dates.forEach((dateString: string) => {
            eventDatesData.push({
              eventId: event.id,
              date: new Date(dateString),
              weekday: undefined,
            });
          });
        }

        // Add weekdays
        if (weekDays && weekDays.length > 0) {
          weekDays.forEach((weekday: string) => {
            eventDatesData.push({
              eventId: event.id,
              date: undefined,
              weekday: weekday.toLowerCase(),
            });
          });
        }

        // Create new event dates if we have any
        if (eventDatesData.length > 0) {
          await tx.eventDate.createMany({
            data: eventDatesData,
          });
        }
      }

      return event;
    });

    const isFullDayEvent = !updatedEvent.startTime && !updatedEvent.endTime;

    // Fetch and return the updated event with all relations
    const completeEvent = await prisma.event.findUnique({
      where: { id: updatedEvent.id },
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

    // Return event with additional metadata
    return NextResponse.json({
      ...completeEvent,
      timeIncrement,
      isFullDayEvent,
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  // res: NextResponse,
  context: { params: Promise<{ shortcode: string }> },
) {
  try {
    const { shortcode } = await context.params;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { shortCode: shortcode },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: StatusCodes.NOT_FOUND },
      );
    }

    // Delete event (cascade will handle related records)
    await prisma.event.delete({
      where: { shortCode: shortcode },
    });

    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: StatusCodes.OK },
    );
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
