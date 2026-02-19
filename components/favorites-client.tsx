"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { fetchApi } from "@/lib/client-api";

type Favorite = {
  id: string;
  movieId: string;
  mediaType: "movie" | "tv";
  title: string;
  year?: string | null;
  platform?: string | null;
};

export function FavoritesClient() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [items, setItems] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi<{ items: Favorite[] }>("/api/favorites");
      setItems(res.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failed_load"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    load();
  }, [user]);

  const remove = async (movieId: string, mediaType: "movie" | "tv") => {
    await fetchApi(`/api/favorites?movieId=${movieId}&mediaType=${mediaType}`, { method: "DELETE" });
    setItems((old) => old.filter((x) => !(x.movieId === movieId && x.mediaType === mediaType)));
  };

  if (!user) {
    return <div className="panel p-6 text-muted">{t("favorites_need_login")}</div>;
  }

  if (loading) {
    return <div className="skeleton h-40 w-full rounded-2xl" />;
  }

  if (error) {
    return <div className="panel p-6 text-rose-300">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{t("favorites_title")}</h1>
      {!items.length ? (
        <div className="panel p-6 text-muted">{t("favorites_empty")}</div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <div key={item.id} className="panel flex items-center justify-between p-4">
              <div>
                <Link className="font-semibold hover:text-accent" href={`/title/${item.mediaType}/${item.movieId}`}>
                  {item.title}
                </Link>
                <p className="text-sm text-muted">
                  {item.year ?? t("na")} | {item.platform ?? t("unknown_platform")} | {item.mediaType}
                </p>
              </div>
              <button
                onClick={() => remove(item.movieId, item.mediaType)}
                className="rounded-lg p-2 text-muted transition hover:bg-white/5 hover:text-rose-300"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


