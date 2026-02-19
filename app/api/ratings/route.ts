import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/request-auth";

const schema = z.object({
  movieId: z.string(),
  mediaType: z.enum(["movie", "tv"]),
  value: z.number().int().min(1).max(10),
  movieTitle: z.string().optional(),
  posterPath: z.string().nullable().optional(),
  year: z.string().optional(),
  platform: z.string().nullable().optional()
});

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const rating = await prisma.rating.upsert({
      where: {
        userId_movieId_mediaType: {
          userId: auth.userId,
          movieId: parsed.data.movieId,
          mediaType: parsed.data.mediaType
        }
      },
      update: {
        value: parsed.data.value,
        movieTitle: parsed.data.movieTitle,
        posterPath: parsed.data.posterPath,
        year: parsed.data.year,
        platform: parsed.data.platform
      },
      create: {
        userId: auth.userId,
        movieId: parsed.data.movieId,
        mediaType: parsed.data.mediaType,
        value: parsed.data.value,
        movieTitle: parsed.data.movieTitle,
        posterPath: parsed.data.posterPath,
        year: parsed.data.year,
        platform: parsed.data.platform
      }
    });
    return NextResponse.json({ rating });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}


