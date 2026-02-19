"use client";

import { MovieCard } from "@/components/movie-card";
import { useLanguage } from "@/contexts/language-context";
import type { MovieSummary } from "@/lib/types";

type Props = {
  items: MovieSummary[];
};

export function MovieGrid({ items }: Props) {
  const { t } = useLanguage();
  if (!items.length) {
    return (
      <div className="panel p-6 text-center text-muted">
        {t("no_results")}
      </div>
    );
  }

  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <MovieCard key={`${item.mediaType}:${item.id}`} item={item} />
      ))}
    </section>
  );
}


