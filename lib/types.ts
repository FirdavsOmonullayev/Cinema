export type MediaType = "movie" | "tv";

export type MovieSummary = {
  id: string;
  mediaType: MediaType;
  title: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  year: string;
  genres: string[];
  platform: string | null;
  imdbRating: string | null;
  imdbId: string | null;
  tmdbRating: number | null;
  userAverageRating: number | null;
};

export type MovieDetail = MovieSummary & {
  runtime: string | null;
  studio: string | null;
  releaseDate: string | null;
  trailerKey: string | null;
};


