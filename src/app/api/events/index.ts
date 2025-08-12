import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { prisma } from "@/lib/prisma";
import { sqids } from "@/lib/sqids";

async function generateUniqueSqid(numbers: number[]): Promise<string> {
  let sqid = sqids.encode(numbers);
  let exists = await prisma.event.findUnique({ where: { sqid } });
  let attempt = 1;
  // On conflict, vary numbers input (e.g. add attempt count) to get new code
  while (exists) {
    sqid = sqids.encode([...numbers, attempt]);
    exists = await prisma.event.findUnique({ where: { sqid } });
    attempt++;
  }
  return sqid;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();

  const { title, description, startDate, endDate, creatorId } = req.body;

  if (!title || !startDate || !endDate) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Missing required fields" });
  }

  // Use timestamp + creatorId length or something numeric as base numbers for sqid
  const baseNumbers = [Date.now(), creatorId ? creatorId.length : 0];

  try {
    const sqid = await generateUniqueSqid(baseNumbers);

    const event = await prisma.event.create({
      data: {
        title,
        description,
        shortCode: sqid,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        creatorId,
      },
    });
    res.status(StatusCodes.CREATED).json(event);
  } catch {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to create event" });
  }
}
