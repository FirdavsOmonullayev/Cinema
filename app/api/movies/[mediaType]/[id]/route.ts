import { NextRequest, NextResponse } from "next/server";

import { parseLanguage } from "@/lib/i18n";
import { getMovieDetail } from "@/lib/movie-service";
import type { MediaType } from "@/lib/types";

type Params = {
  params: {
    mediaType: string;
    id: string;
  };
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const mediaType = params.mediaType === "tv" ? "tv" : "movie";
    const lang = parseLanguage(req.nextUrl.searchParams.get("lang"));
    const item = await getMovieDetail(mediaType as MediaType, params.id, lang);
    return NextResponse.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

