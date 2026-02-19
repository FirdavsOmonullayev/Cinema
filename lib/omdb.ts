import { getMockByImdbId } from "@/lib/mock-data";

type OMDbResponse = {
  Response: "True" | "False";
  imdbRating?: string;
  Runtime?: string;
  Genre?: string;
  Plot?: string;
  Title?: string;
  Year?: string;
  Error?: string;
};

export async function getOMDbByImdbId(imdbId: string) {
  const key = process.env.OMDB_API_KEY;
  if (!key || key === "your_omdb_api_key") {
    const match = getMockByImdbId(imdbId);
    if (!match) return null;
    return {
      Response: "True",
      imdbRating: match.imdbRating ?? "N/A",
      Runtime: match.runtime ?? "N/A",
      Genre: match.genres.join(", "),
      Plot: match.overview,
      Title: match.title,
      Year: match.year
    } as OMDbResponse;
  }
  if (!key || !imdbId) return null;

  const params = new URLSearchParams({
    apikey: key,
    i: imdbId,
    plot: "full"
  });
  const res = await fetch(`https://www.omdbapi.com/?${params.toString()}`, {
    next: { revalidate: 3600 }
  });
  if (!res.ok) return null;

  const data = (await res.json()) as OMDbResponse;
  if (data.Response === "False") return null;
  return data;
}


