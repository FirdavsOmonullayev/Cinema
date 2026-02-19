import { NextRequest, NextResponse } from "next/server";

import { parseLanguage } from "@/lib/i18n";
import { getTrendingMovies } from "@/lib/movie-service";

export async function GET(req: NextRequest) {
  try {
    const sort = req.nextUrl.searchParams.get("sort") === "userRating" ? "userRating" : "imdb";
    const lang = parseLanguage(req.nextUrl.searchParams.get("lang"));
    const items = await getTrendingMovies(sort, lang);
    return NextResponse.json({ items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}


