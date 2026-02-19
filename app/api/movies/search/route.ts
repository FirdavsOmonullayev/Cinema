import { NextRequest, NextResponse } from "next/server";

import { parseLanguage } from "@/lib/i18n";
import { getSearchMovies } from "@/lib/movie-service";
import { prisma } from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/request-auth";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("q")?.trim() ?? "";
    const sort = req.nextUrl.searchParams.get("sort") === "userRating" ? "userRating" : "imdb";
    const lang = parseLanguage(req.nextUrl.searchParams.get("lang"));
    if (!query || query.length < 2) {
      return NextResponse.json({ items: [] });
    }
    const items = await getSearchMovies(query, sort, lang);
    const auth = getAuthFromRequest(req);
    if (auth) {
      const latest = (await prisma.searchHistory.findFirst({
        where: { userId: auth.userId },
        orderBy: { createdAt: "desc" }
      })) as { query: string } | null;
      if (!latest || latest.query.toLowerCase() !== query.toLowerCase()) {
        await prisma.searchHistory.create({
          data: {
            userId: auth.userId,
            query
          }
        });
      }
    }
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}


