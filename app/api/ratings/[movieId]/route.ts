import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/request-auth";

type Params = {
  params: {
    movieId: string;
  };
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const mediaType = req.nextUrl.searchParams.get("mediaType") === "tv" ? "tv" : "movie";
    const movieId = params.movieId;

    const [avg, count] = await Promise.all([
      prisma.rating.aggregate({
        _avg: { value: true },
        where: { movieId, mediaType }
      }),
      prisma.rating.count({
        where: { movieId, mediaType }
      })
    ]);

    let myRating: number | null = null;
    const auth = getAuthFromRequest(req);
    if (auth) {
      const mine = (await prisma.rating.findUnique({
        where: {
          userId_movieId_mediaType: {
            userId: auth.userId,
            movieId,
            mediaType
          }
        }
      })) as { value: number } | null;
      myRating = mine?.value ?? null;
    }

    return NextResponse.json({
      average: avg._avg.value ?? null,
      votes: count,
      myRating
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

