"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { fetchApi } from "@/lib/client-api";

type HistoryItem = {
  id: string;
  query: string;
  createdAt: string;
};

export function HistoryClient() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await fetchApi<{ items: HistoryItem[] }>("/api/history");
        setItems(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("failed_load"));
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user, t]);

  if (!user) {
    return <div className="panel p-6 text-muted">{t("history_need_login")}</div>;
  }
  if (loading) {
    return <div className="skeleton h-40 w-full rounded-2xl" />;
  }
  if (error) {
    return <div className="panel p-6 text-rose-300">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{t("history_title")}</h1>
      {!items.length ? (
        <div className="panel p-6 text-muted">{t("history_empty")}</div>
      ) : (
        <div className="grid gap-2">
          {items.map((item) => (
            <div key={item.id} className="panel flex items-center justify-between p-4">
              <span className="font-medium">{item.query}</span>
              <span className="text-xs text-muted">{new Date(item.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


