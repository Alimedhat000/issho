import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: StatusCodes.UNAUTHORIZED },
      );
    }

    const folders = await prisma.folder.findMany({
      where: { userId: currentUser.userId },
      include: {
        _count: {
          select: { events: true },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(folders, { status: StatusCodes.OK });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: StatusCodes.UNAUTHORIZED },
      );
    }

    const body = await req.json();
    const { name, color } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    const trimmedName = name.trim();

    // Check if folder name already exists for this user
    const existingFolder = await prisma.folder.findUnique({
      where: {
        name_userId: {
          name: trimmedName,
          userId: currentUser.userId,
        },
      },
    });

    if (existingFolder) {
      return NextResponse.json(
        { error: 'Folder name already exists' },
        { status: StatusCodes.CONFLICT },
      );
    }

    const folder = await prisma.folder.create({
      data: {
        name: trimmedName,
        color: color || '#a9a9f1',
        userId: currentUser.userId,
      },
      include: {
        _count: {
          select: { events: true },
        },
      },
    });
    return NextResponse.json(folder, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
