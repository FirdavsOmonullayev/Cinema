import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/request-auth";

const schema = z.object({
  movieId: z.string(),
  mediaType: z.enum(["movie", "tv"]),
  title: z.string(),
  posterPath: z.string().nullable().optional(),
  year: z.string().optional(),
  platform: z.string().nullable().optional()
});

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const favorites = await prisma.favorite.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ items: favorites });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}

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
    const item = await prisma.favorite.upsert({
      where: {
        userId_movieId_mediaType: {
          userId: auth.userId,
          movieId: parsed.data.movieId,
          mediaType: parsed.data.mediaType
        }
      },
      update: {
        title: parsed.data.title,
        posterPath: parsed.data.posterPath,
        year: parsed.data.year,
        platform: parsed.data.platform
      },
      create: {
        userId: auth.userId,
        movieId: parsed.data.movieId,
        mediaType: parsed.data.mediaType,
        title: parsed.data.title,
        posterPath: parsed.data.posterPath,
        year: parsed.data.year,
        platform: parsed.data.platform
      }
    });
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const movieId = req.nextUrl.searchParams.get("movieId");
    const mediaType = req.nextUrl.searchParams.get("mediaType") === "tv" ? "tv" : "movie";
    if (!movieId) {
      return NextResponse.json({ message: "movieId is required" }, { status: 400 });
    }
    await prisma.favorite.delete({
      where: {
        userId_movieId_mediaType: {
          userId: auth.userId,
          movieId,
          mediaType
        }
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}


