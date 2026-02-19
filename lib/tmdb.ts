import { AppLanguage } from "@/lib/i18n";
import { getMockDetail, getMockTrending, searchMock } from "@/lib/mock-data";
import { MediaType } from "@/lib/types";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";
const REGION = "US";

const TMDB_LANG_MAP: Record<AppLanguage, string> = {
  uz: "en-US",
  ru: "ru-RU",
  en: "en-US"
};

type TMDbResult = {
  id: number;
  media_type: MediaType;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  vote_average?: number;
};

const genreCache = new Map<string, Record<number, string>>();

async function tmdbFetch<T>(
  path: string,
  params?: Record<string, string | number>,
  lang: AppLanguage = "en"
) {
  const key = process.env.TMDB_API_KEY;
  if (!key || key === "your_tmdb_api_key") {
    throw new Error("TMDB API key is missing");
  }

  const search = new URLSearchParams({
    api_key: key,
    language: TMDB_LANG_MAP[lang],
    ...Object.fromEntries(Object.entries(params ?? {}).map(([k, v]) => [k, String(v)]))
  });

  const res = await fetch(`${TMDB_BASE_URL}${path}?${search.toString()}`, {
    next: { revalidate: 300 }
  });
  if (!res.ok) {
    throw new Error(`TMDb request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

async function loadGenres(mediaType: MediaType, lang: AppLanguage) {
  const cacheKey = `${mediaType}:${lang}`;
  const cached = genreCache.get(cacheKey);
  if (cached) return cached;

  const data = await tmdbFetch<{ genres: { id: number; name: string }[] }>(
    `/genre/${mediaType}/list`,
    undefined,
    lang
  );
  const map = data.genres.reduce<Record<number, string>>((acc, g) => {
    acc[g.id] = g.name;
    return acc;
  }, {});
  genreCache.set(cacheKey, map);
  return map;
}

export function buildPosterUrl(path: string | null | undefined) {
  return path ? `${IMAGE_BASE_URL}${path}` : null;
}

export function buildBackdropUrl(path: string | null | undefined) {
  return path ? `${BACKDROP_BASE_URL}${path}` : null;
}

export async function searchTMDb(query: string, lang: AppLanguage = "uz") {
  if (!process.env.TMDB_API_KEY || process.env.TMDB_API_KEY === "your_tmdb_api_key") {
    return searchMock(query, lang).map((item) => ({
      id: item.id,
      mediaType: item.mediaType,
      title: item.title,
      overview: item.overview,
      poster: item.poster,
      backdrop: item.backdrop,
      year: item.year,
      genres: item.genres,
      tmdbRating: item.tmdbRating,
      platform: item.platform,
      imdbRating: item.imdbRating,
      imdbId: item.imdbId
    }));
  }

  const data = await tmdbFetch<{ results: TMDbResult[] }>(
    "/search/multi",
    {
      query,
      include_adult: "false",
      page: 1
    },
    lang
  );

  const results = data.results
    .filter((r) => r.media_type === "movie" || r.media_type === "tv")
    .slice(0, 30);

  const [movieGenres, tvGenres] = await Promise.all([loadGenres("movie", lang), loadGenres("tv", lang)]);

  return results.map((r) => {
    const mediaType = r.media_type;
    const title = mediaType === "movie" ? r.title : r.name;
    const date = mediaType === "movie" ? r.release_date : r.first_air_date;
    const genres =
      (r.genre_ids ?? [])
        .map((id) => (mediaType === "movie" ? movieGenres[id] : tvGenres[id]))
        .filter(Boolean) ?? [];

    return {
      id: String(r.id),
      mediaType,
      title: title ?? "Unknown",
      overview: r.overview ?? "",
      poster: buildPosterUrl(r.poster_path),
      backdrop: buildBackdropUrl(r.backdrop_path),
      year: date ? date.slice(0, 4) : "N/A",
      genres,
      tmdbRating: typeof r.vote_average === "number" ? Number(r.vote_average.toFixed(1)) : null,
      platform: null,
      imdbRating: null,
      imdbId: null
    };
  });
}

export async function getTrendingTMDb(lang: AppLanguage = "uz") {
  if (!process.env.TMDB_API_KEY || process.env.TMDB_API_KEY === "your_tmdb_api_key") {
    return getMockTrending(lang).map((item) => ({
      id: item.id,
      mediaType: item.mediaType,
      title: item.title,
      overview: item.overview,
      poster: item.poster,
      backdrop: item.backdrop,
      year: item.year,
      genres: item.genres,
      tmdbRating: item.tmdbRating,
      platform: item.platform,
      imdbRating: item.imdbRating,
      imdbId: item.imdbId
    }));
  }

  const data = await tmdbFetch<{ results: TMDbResult[] }>("/trending/all/week", undefined, lang);
  const results = data.results
    .filter((r) => r.media_type === "movie" || r.media_type === "tv")
    .slice(0, 40);

  const [movieGenres, tvGenres] = await Promise.all([loadGenres("movie", lang), loadGenres("tv", lang)]);

  return results.map((r) => {
    const mediaType = r.media_type;
    const title = mediaType === "movie" ? r.title : r.name;
    const date = mediaType === "movie" ? r.release_date : r.first_air_date;

    return {
      id: String(r.id),
      mediaType,
      title: title ?? "Unknown",
      overview: r.overview ?? "",
      poster: buildPosterUrl(r.poster_path),
      backdrop: buildBackdropUrl(r.backdrop_path),
      year: date ? date.slice(0, 4) : "N/A",
      genres: (r.genre_ids ?? [])
        .map((id) => (mediaType === "movie" ? movieGenres[id] : tvGenres[id]))
        .filter(Boolean),
      tmdbRating: typeof r.vote_average === "number" ? Number(r.vote_average.toFixed(1)) : null,
      platform: null,
      imdbRating: null,
      imdbId: null
    };
  });
}

type TMDbDetails = {
  id: number;
  name?: string;
  title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  runtime?: number | null;
  episode_run_time?: number[];
  genres?: { id: number; name: string }[];
  production_companies?: { id: number; name: string }[];
  networks?: { id: number; name: string }[];
};

export async function getTMDbDetails(mediaType: MediaType, id: string, lang: AppLanguage = "uz") {
  if (!process.env.TMDB_API_KEY || process.env.TMDB_API_KEY === "your_tmdb_api_key") {
    const item = getMockDetail(mediaType, id, lang);
    if (!item) {
      throw new Error("Movie not found");
    }
    return {
      id: item.id,
      mediaType: item.mediaType,
      title: item.title,
      overview: item.overview,
      poster: item.poster,
      backdrop: item.backdrop,
      year: item.year,
      genres: item.genres,
      tmdbRating: item.tmdbRating,
      runtime: item.runtime,
      studio: item.studio,
      releaseDate: item.releaseDate,
      platform: item.platform,
      imdbId: item.imdbId,
      trailerKey: item.trailerKey
    };
  }

  const detail = await tmdbFetch<TMDbDetails>(`/${mediaType}/${id}`, undefined, lang);
  const videos = await tmdbFetch<{
    results: { key: string; site: string; type: string; official: boolean }[];
  }>(`/${mediaType}/${id}/videos`, undefined, lang);
  const providers = await tmdbFetch<{
    results: Record<
      string,
      {
        flatrate?: { provider_name: string }[];
      }
    >;
  }>(`/${mediaType}/${id}/watch/providers`, undefined, lang);
  const external = await tmdbFetch<{ imdb_id?: string }>(`/${mediaType}/${id}/external_ids`, undefined, lang);

  const runtimeMinutes =
    mediaType === "movie" ? detail.runtime ?? null : detail.episode_run_time?.[0] ?? null;

  const studio =
    mediaType === "movie"
      ? detail.production_companies?.[0]?.name ?? null
      : detail.networks?.[0]?.name ?? null;

  const trailer = videos.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
  );
  const fallbackTrailer = videos.results.find((v) => v.site === "YouTube" && v.type === "Trailer");
  const regionProviders = providers.results[REGION]?.flatrate ?? [];

  return {
    id: String(detail.id),
    mediaType,
    title: mediaType === "movie" ? detail.title ?? "Unknown" : detail.name ?? "Unknown",
    overview: detail.overview ?? "",
    poster: buildPosterUrl(detail.poster_path),
    backdrop: buildBackdropUrl(detail.backdrop_path),
    year:
      mediaType === "movie"
        ? detail.release_date?.slice(0, 4) ?? "N/A"
        : detail.first_air_date?.slice(0, 4) ?? "N/A",
    genres: detail.genres?.map((g) => g.name) ?? [],
    tmdbRating: typeof detail.vote_average === "number" ? Number(detail.vote_average.toFixed(1)) : null,
    runtime: runtimeMinutes ? `${runtimeMinutes} min` : null,
    studio,
    releaseDate: mediaType === "movie" ? detail.release_date ?? null : detail.first_air_date ?? null,
    platform: regionProviders[0]?.provider_name ?? null,
    imdbId: external.imdb_id ?? null,
    trailerKey: trailer?.key ?? fallbackTrailer?.key ?? null
  };
}
