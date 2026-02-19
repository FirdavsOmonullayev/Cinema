"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { useLanguage } from "@/contexts/language-context";

type Props = {
  open: boolean;
  initialValue?: number | null;
  onClose: () => void;
  onSubmit: (value: number) => Promise<void>;
};

export function RatingModal({ open, initialValue, onClose, onSubmit }: Props) {
  const { t } = useLanguage();
  const [value, setValue] = useState<number>(initialValue ?? 8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValue(initialValue ?? 8);
    }
  }, [open, initialValue]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(value);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failed_load"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
        >
          <motion.form
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onSubmit={submit}
            className="panel w-full max-w-sm space-y-4 p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t("rate_modal_title")}</h3>
              <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-muted">{t("rate_modal_help")}</p>
            <input
              type="range"
              min={1}
              max={10}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="rounded-xl bg-white/5 p-3 text-center text-2xl font-bold">{value}</div>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button disabled={loading} className="button-primary w-full">
              {loading ? t("saving") : t("rate_modal_save")}
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

