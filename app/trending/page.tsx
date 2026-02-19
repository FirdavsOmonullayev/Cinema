"use client";

import { useEffect, useState } from "react";

import { MovieGrid } from "@/components/movie-grid";
import { SkeletonGrid } from "@/components/skeleton-grid";
import { useLanguage } from "@/contexts/language-context";
import { fetchApi } from "@/lib/client-api";
import type { MovieSummary } from "@/lib/types";

export default function TrendingPage() {
  const { language, t } = useLanguage();
  const [sort, setSort] = useState<"imdb" | "userRating">("imdb");
  const [items, setItems] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchApi<{ items: MovieSummary[] }>(
          `/api/movies/trending?sort=${sort}&lang=${language}`
        );
        setItems(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("failed_load"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sort, language, t]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("trend_title")}</h1>
          <p className="mt-2 text-sm text-muted">{t("trend_sub")}</p>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "imdb" | "userRating")}
          className="rounded-xl border border-white/15 bg-panelSoft px-4 py-2 text-sm outline-none focus:border-accent"
        >
          <option value="imdb">{t("sort_imdb")}</option>
          <option value="userRating">{t("sort_user")}</option>
        </select>
      </div>

      {error && <p className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p>}
      {loading ? <SkeletonGrid /> : <MovieGrid items={items} />}
    </div>
  );
}


