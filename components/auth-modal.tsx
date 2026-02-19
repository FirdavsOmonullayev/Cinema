"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AuthModal({ open, onClose }: Props) {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auth error");
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
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="panel w-full max-w-md p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {mode === "login" ? t("auth_sign_in") : t("auth_create_account")}
              </h3>
              <button onClick={onClose} className="rounded-lg p-1 text-muted hover:bg-white/5">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              {mode === "register" && (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-panelSoft px-4 py-3 text-sm outline-none focus:border-accent"
                  placeholder={t("auth_name")}
                  required
                />
              )}
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full rounded-xl border border-white/15 bg-panelSoft px-4 py-3 text-sm outline-none focus:border-accent"
                placeholder={t("auth_email")}
                required
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full rounded-xl border border-white/15 bg-panelSoft px-4 py-3 text-sm outline-none focus:border-accent"
                placeholder={t("auth_password")}
                required
              />
              {error && <p className="text-sm text-rose-400">{error}</p>}
              <button disabled={loading} type="submit" className="button-primary w-full disabled:opacity-60">
                {loading ? t("auth_loading") : mode === "login" ? t("auth_login_btn") : t("auth_register_btn")}
              </button>
            </form>
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="mt-4 text-sm text-muted hover:text-text"
            >
              {mode === "login" ? t("auth_switch_to_register") : t("auth_switch_to_login")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


