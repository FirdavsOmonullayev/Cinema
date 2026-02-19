import { AppLanguage } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { getOMDbByImdbId } from "@/lib/omdb";
import { getTMDbDetails, getTrendingTMDb, searchTMDb } from "@/lib/tmdb";
import type { MediaType, MovieDetail, MovieSummary } from "@/lib/types";

type SortMode = "imdb" | "userRating";

function imdbToNumber(value: string | null) {
  if (!value || value === "N/A") return -1;
  const num = Number(value);
  return Number.isFinite(num) ? num : -1;
}

function userToNumber(value: number | null) {
  if (typeof value !== "number") return -1;
  return value;
}

async function attachRatings(items: MovieSummary[]) {
  if (!items.length) return items;
  const grouped = await prisma.rating.groupBy({
    by: ["movieId", "mediaType"],
    _avg: { value: true },
    where: {
      OR: items.map((item) => ({
        movieId: item.id,
        mediaType: item.mediaType
      }))
    }
  });
  const ratingMap = new Map(
    grouped.map((g) => [`${g.movieId}:${g.mediaType}`, g._avg.value ?? null])
  );
  return items.map((item) => ({
    ...item,
    userAverageRating: ratingMap.get(`${item.id}:${item.mediaType}`) ?? null
  }));
}

function sortMovies(movies: MovieSummary[], sort: SortMode) {
  if (sort === "userRating") {
    return [...movies].sort(
      (a, b) => userToNumber(b.userAverageRating) - userToNumber(a.userAverageRating)
    );
  }
  return [...movies].sort((a, b) => imdbToNumber(b.imdbRating) - imdbToNumber(a.imdbRating));
}

export async function getSearchMovies(
  query: string,
  sort: SortMode = "imdb",
  lang: AppLanguage = "uz"
) {
  const raw = await searchTMDb(query, lang);
  const summary: MovieSummary[] = raw.map((item) => ({
    ...item,
    platform: item.platform ?? null,
    imdbRating: item.imdbRating ?? null,
    imdbId: item.imdbId ?? null,
    userAverageRating: null
  }));
  const withRating = await attachRatings(summary);
  return sortMovies(withRating, sort);
}

export async function getTrendingMovies(sort: SortMode = "imdb", lang: AppLanguage = "uz") {
  const raw = await getTrendingTMDb(lang);
  const summary: MovieSummary[] = raw.map((item) => ({
    ...item,
    platform: item.platform ?? null,
    imdbRating: item.imdbRating ?? null,
    imdbId: item.imdbId ?? null,
    userAverageRating: null
  }));
  const withRating = await attachRatings(summary);
  return sortMovies(withRating, sort);
}

export async function getMovieDetail(
  mediaType: MediaType,
  id: string,
  lang: AppLanguage = "uz"
): Promise<MovieDetail> {
  const detail = await getTMDbDetails(mediaType, id, lang);
  const omdb = detail.imdbId ? await getOMDbByImdbId(detail.imdbId) : null;
  const avg = await prisma.rating.aggregate({
    _avg: { value: true },
    where: { movieId: id, mediaType }
  });
  return {
    ...detail,
    imdbRating: omdb?.imdbRating ?? null,
    runtime: omdb?.Runtime && omdb.Runtime !== "N/A" ? omdb.Runtime : detail.runtime,
    userAverageRating: avg._avg.value ?? null
  };
}


