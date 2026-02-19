"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Tv2 } from "lucide-react";

import { useLanguage } from "@/contexts/language-context";
import type { MovieSummary } from "@/lib/types";

type Props = {
  item: MovieSummary;
};

export function MovieCard({ item }: Props) {
  const { t } = useLanguage();
  const unoptimized = item.poster?.startsWith("/api/mock-image") ?? false;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-xl transition"
    >
      <Link href={`/title/${item.mediaType}/${item.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          {item.poster ? (
            <Image
              src={item.poster}
              alt={item.title}
              fill
              unoptimized={unoptimized}
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            />
          ) : (
            <div className="skeleton h-full w-full" />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3">
            <span className="rounded-md bg-black/50 px-2 py-1 text-xs uppercase tracking-wide">
              {item.mediaType}
            </span>
          </div>
        </div>
        <div className="space-y-2 p-4">
          <h3 className="line-clamp-1 text-base font-semibold">{item.title}</h3>
          <p className="line-clamp-1 text-xs text-muted">
            {item.genres.join(", ") || t("label_unknown_genre")}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-white/5 px-2 py-1">
              <span className="text-muted">{t("label_year")}:</span> {item.year}
            </div>
            <div className="rounded-lg bg-white/5 px-2 py-1">
              <span className="text-muted">{t("label_platform")}:</span> {item.platform ?? t("na")}
            </div>
            <div className="rounded-lg bg-white/5 px-2 py-1">
              <span className="inline-flex items-center gap-1">
                <Star size={12} className="text-yellow-400" />
                IMDb: {item.imdbRating ?? t("na")}
              </span>
            </div>
            <div className="rounded-lg bg-white/5 px-2 py-1">
              <span className="inline-flex items-center gap-1">
                <Tv2 size={12} className="text-accentAlt" />
                {t("label_user")}: {item.userAverageRating ? item.userAverageRating.toFixed(1) : t("na")}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}


