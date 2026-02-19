"use client";

import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

type Props = {
  query: string;
  sort: "imdb" | "userRating";
  onQueryChange: (value: string) => void;
  onSortChange: (value: "imdb" | "userRating") => void;
};

export function SearchToolbar({ query, sort, onQueryChange, onSortChange }: Props) {
  const { t } = useLanguage();

  return (
    <div className="panel mb-6 flex flex-col gap-3 p-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={17} />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t("search_placeholder")}
          className="w-full rounded-xl border border-white/15 bg-panelSoft py-3 pl-10 pr-4 text-sm outline-none focus:border-accent"
        />
      </div>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as "imdb" | "userRating")}
        className="rounded-xl border border-white/15 bg-panelSoft px-4 py-3 text-sm outline-none focus:border-accent md:w-52"
      >
        <option value="imdb">{t("sort_imdb")}</option>
        <option value="userRating">{t("sort_user")}</option>
      </select>
    </div>
  );
}


