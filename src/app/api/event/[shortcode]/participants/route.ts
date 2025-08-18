import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

type CreateParticipantRequest = {
  userId?: string; // optional for guests
  name: string; // required (guest or user display name)
};

export async function POST(
  req: NextRequest,
  context: {
    params: Promise<{ shortcode: string }>;
  },
) {
  try {
    const { shortcode } = await context.params;
    const body: CreateParticipantRequest = await req.json();
    const { userId, name } = body;

    const event = await prisma.event.findUnique({
      where: { shortCode: shortcode },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: StatusCodes.NOT_FOUND },
      );
    }

    // if userId exists, check if already participant
    if (userId) {
      const existing = await prisma.participant.findFirst({
        where: {
          eventId: event.id,
          userId,
        },
      });

      if (existing) {
        return NextResponse.json(existing, { status: StatusCodes.OK });
      }
    }

    // create participant
    const participant = await prisma.participant.create({
      data: {
        name,
        userId: userId ?? null,
        eventId: event.id,
      },
    });

    return NextResponse.json(participant, { status: StatusCodes.CREATED });

    // create participant
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
