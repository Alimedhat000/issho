import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Update folder
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: StatusCodes.UNAUTHORIZED },
      );
    }

    const { id } = await context.params;
    const body = await req.json();
    const { name, color } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    if (!color || typeof color !== 'string') {
      return NextResponse.json(
        { error: 'Folder color is required' },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    const trimmedName = name.trim();

    // Check if folder exists and belongs to current user
    const existingFolder = await prisma.folder.findUnique({
      where: { id },
    });

    if (!existingFolder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: StatusCodes.NOT_FOUND },
      );
    }

    if (existingFolder.userId !== currentUser.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: StatusCodes.FORBIDDEN },
      );
    }

    // Check if new name conflicts with another folder
    if (trimmedName !== existingFolder.name) {
      const conflictingFolder = await prisma.folder.findUnique({
        where: {
          name_userId: {
            name: trimmedName,
            userId: currentUser.userId,
          },
        },
      });

      if (conflictingFolder) {
        return NextResponse.json(
          { error: 'Folder name already exists' },
          { status: StatusCodes.CONFLICT },
        );
      }
    }

    const updatedFolder = await prisma.folder.update({
      where: { id },
      data: { name: trimmedName, color },
      include: {
        _count: {
          select: { events: true },
        },
      },
    });

    return NextResponse.json(updatedFolder, { status: StatusCodes.OK });
  } catch (error) {
    console.error('Error updating folder:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}

// Delete folder
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: StatusCodes.UNAUTHORIZED },
      );
    }

    const { id } = await context.params;

    // Check if folder exists and belongs to current user
    const existingFolder = await prisma.folder.findUnique({
      where: { id },
      include: {
        _count: {
          select: { events: true },
        },
      },
    });

    if (!existingFolder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: StatusCodes.NOT_FOUND },
      );
    }

    if (existingFolder.userId !== currentUser.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: StatusCodes.FORBIDDEN },
      );
    }

    // Move all events in this folder to no folder (folderId = null)
    await prisma.event.updateMany({
      where: { folderId: id },
      data: { folderId: null },
    });

    // Delete the folder
    await prisma.folder.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Folder deleted successfully' },
      { status: StatusCodes.OK },
    );
  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
