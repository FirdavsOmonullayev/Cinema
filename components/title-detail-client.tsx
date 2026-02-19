"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Heart, Star } from "lucide-react";

import { RatingModal } from "@/components/rating-modal";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { fetchApi } from "@/lib/client-api";
import type { MediaType, MovieDetail } from "@/lib/types";

type Props = {
  id: string;
  mediaType: MediaType;
};

type RatingPayload = {
  average: number | null;
  votes: number;
  myRating: number | null;
};

export function TitleDetailClient({ id, mediaType }: Props) {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [item, setItem] = useState<MovieDetail | null>(null);
  const [ratingMeta, setRatingMeta] = useState<RatingPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openRate, setOpenRate] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [busyFavorite, setBusyFavorite] = useState(false);

  const load = useMemo(
    () => async () => {
      setLoading(true);
      setError(null);
      try {
        const [detailRes, rateRes] = await Promise.all([
          fetchApi<{ item: MovieDetail }>(`/api/movies/${mediaType}/${id}?lang=${language}`),
          fetchApi<RatingPayload>(`/api/ratings/${id}?mediaType=${mediaType}`)
        ]);
        setItem(detailRes.item);
        setRatingMeta(rateRes);
        if (user) {
          const fav = await fetchApi<{ items: { movieId: string; mediaType: string }[] }>("/api/favorites");
          const exists = fav.items.some((x) => x.movieId === id && x.mediaType === mediaType);
          setIsFavorite(exists);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t("failed_load"));
      } finally {
        setLoading(false);
      }
    },
    [id, mediaType, user, language, t]
  );

  useEffect(() => {
    load();
  }, [load]);

  const submitRating = async (value: number) => {
    if (!item) return;
    await fetchApi("/api/ratings", {
      method: "POST",
      body: JSON.stringify({
        movieId: item.id,
        mediaType: item.mediaType,
        value,
        movieTitle: item.title,
        posterPath: item.poster,
        year: item.year,
        platform: item.platform
      })
    });
    const rateRes = await fetchApi<RatingPayload>(`/api/ratings/${id}?mediaType=${mediaType}`);
    setRatingMeta(rateRes);
  };

  const toggleFavorite = async () => {
    if (!item) return;
    setBusyFavorite(true);
    try {
      if (isFavorite) {
        await fetchApi(`/api/favorites?movieId=${item.id}&mediaType=${item.mediaType}`, {
          method: "DELETE"
        });
        setIsFavorite(false);
      } else {
        await fetchApi("/api/favorites", {
          method: "POST",
          body: JSON.stringify({
            movieId: item.id,
            mediaType: item.mediaType,
            title: item.title,
            posterPath: item.poster,
            year: item.year,
            platform: item.platform
          })
        });
        setIsFavorite(true);
      }
    } finally {
      setBusyFavorite(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-64 w-full rounded-3xl" />
        <div className="skeleton h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="panel p-8">
        <p className="text-rose-300">{error ?? t("not_found")}</p>
        <Link className="mt-4 inline-block text-accent" href="/">
          {t("back_home")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10">
        {item.backdrop ? (
          <Image src={item.backdrop} alt={item.title} width={1600} height={900} className="h-[320px] w-full object-cover md:h-[420px]" />
        ) : (
          <div className="skeleton h-[320px] w-full md:h-[420px]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <p className="mb-2 text-sm text-muted">{item.mediaType.toUpperCase()}</p>
          <h1 className="text-3xl font-bold md:text-5xl">{item.title}</h1>
          <p className="mt-3 line-clamp-3 max-w-3xl text-sm text-slate-200 md:text-base">{item.overview}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/15 px-3 py-1">{item.year}</span>
            <span className="rounded-full bg-white/15 px-3 py-1">{item.runtime ?? t("na")}</span>
            <span className="rounded-full bg-white/15 px-3 py-1">{item.platform ?? t("platform_na")}</span>
            <span className="rounded-full bg-white/15 px-3 py-1">{item.studio ?? t("studio_na")}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="panel p-6">
          <h2 className="text-xl font-semibold">{t("details")}</h2>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div>
              <span className="text-muted">{t("genres")}:</span> {item.genres.join(", ") || t("na")}
            </div>
            <div>
              <span className="text-muted">{t("release_date")}:</span> {item.releaseDate ?? t("na")}
            </div>
            <div>
              <span className="text-muted">IMDb:</span> {item.imdbRating ?? t("na")}
            </div>
            <div>
              <span className="text-muted">TMDb:</span> {item.tmdbRating ?? t("na")}
            </div>
            <div>
              <span className="text-muted">{t("community_rating")}:</span>{" "}
              {ratingMeta?.average ? ratingMeta.average.toFixed(1) : t("na")} ({ratingMeta?.votes ?? 0} {t("votes")})
            </div>
            <div>
              <span className="text-muted">{t("your_rating")}:</span> {ratingMeta?.myRating ?? t("na")}
            </div>
          </div>
          {item.trailerKey && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <iframe
                width="100%"
                height="340"
                src={`https://www.youtube.com/embed/${item.trailerKey}`}
                title={`${item.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>

        <aside className="panel p-6">
          <h3 className="text-lg font-semibold">{t("actions")}</h3>
          <div className="mt-4 space-y-3">
            <button
              onClick={() => setOpenRate(true)}
              disabled={!user}
              className="button-primary inline-flex w-full items-center justify-center gap-2 disabled:opacity-60"
            >
              <Star size={15} />
              {user ? t("rate_this") : t("signin_to_rate")}
            </button>
            <button
              onClick={toggleFavorite}
              disabled={!user || busyFavorite}
              className="button-secondary inline-flex w-full items-center justify-center gap-2 disabled:opacity-60"
            >
              <Heart size={15} className={isFavorite ? "fill-accent text-accent" : ""} />
              {isFavorite ? t("remove_favorite") : user ? t("add_favorite") : t("signin_for_fav")}
            </button>
          </div>
          <div className="mt-6 border-t border-white/10 pt-4 text-sm text-muted">
            {t("data_source")}
          </div>
        </aside>
      </section>
      <RatingModal
        open={openRate}
        onClose={() => setOpenRate(false)}
        initialValue={ratingMeta?.myRating ?? undefined}
        onSubmit={submitRating}
      />
    </div>
  );
}


