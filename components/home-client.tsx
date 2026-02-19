"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { MovieGrid } from "@/components/movie-grid";
import { SearchToolbar } from "@/components/search-toolbar";
import { SkeletonGrid } from "@/components/skeleton-grid";
import { useLanguage } from "@/contexts/language-context";
import { fetchApi } from "@/lib/client-api";
import type { MovieSummary } from "@/lib/types";

const QUICK_TOPICS = ["Avatar", "Marvel", "DC", "Netflix", "Uzbek", "Qazaq", "Russia"];

export function HomeClient() {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"imdb" | "userRating">("imdb");
  const [items, setItems] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endpoint = useMemo(() => {
    if (query.trim().length < 2) return `/api/movies/trending?sort=${sort}&lang=${language}`;
    return `/api/movies/search?q=${encodeURIComponent(query.trim())}&sort=${sort}&lang=${language}`;
  }, [query, sort, language]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchApi<{ items: MovieSummary[] }>(endpoint);
        setItems(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("failed_load"));
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [endpoint, t]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 md:p-10">
        <div className="absolute -left-20 top-0 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -right-16 -top-10 h-52 w-52 rounded-full bg-accentAlt/20 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl"
        >
          <p className="mb-2 inline-flex rounded-full border border-white/20 px-3 py-1 text-xs uppercase text-muted">
            {t("hero_badge")}
          </p>
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            {t("hero_title_1")}
            <span className="text-accent"> {t("hero_title_2")}</span>
          </h1>
          <p className="mt-4 text-sm text-muted md:text-base">{t("hero_desc")}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {QUICK_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => setQuery(topic)}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-muted transition hover:border-white/30 hover:text-white"
              >
                {topic}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      <SearchToolbar query={query} onQueryChange={setQuery} sort={sort} onSortChange={setSort} />

      {error && <p className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p>}
      {loading ? <SkeletonGrid /> : <MovieGrid items={items} />}
    </div>
  );
}


