"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Film, Flame, Heart, History, LogOut } from "lucide-react";

import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { LANGUAGE_OPTIONS } from "@/lib/i18n";

const NAV = [
  { href: "/", labelKey: "nav_home", icon: Film },
  { href: "/trending", labelKey: "nav_trending", icon: Flame },
  { href: "/favorites", labelKey: "nav_favorites", icon: Heart },
  { href: "/history", labelKey: "nav_history", icon: History }
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [openAuth, setOpenAuth] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-accent to-accentAlt text-white">
              <Film size={18} />
            </div>
            <span className="font-semibold tracking-wide">Global Cinema</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-3 py-2 text-sm transition ${
                    active ? "bg-white/12 text-white" : "text-muted hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon size={14} />
                    {t(item.labelKey)}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "uz" | "ru" | "en")}
              className="rounded-xl border border-white/15 bg-panelSoft px-3 py-2 text-xs outline-none"
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
            {!loading && user ? (
              <>
                <span className="hidden text-sm text-muted sm:block">{user.name}</span>
                <button onClick={logout} className="button-secondary inline-flex items-center gap-2">
                  <LogOut size={14} />
                  {t("auth_logout")}
                </button>
              </>
            ) : (
              <button onClick={() => setOpenAuth(true)} className="button-primary">
                {t("auth_sign_in")}
              </button>
            )}
          </div>
        </div>
        <div className="border-t border-white/10 px-4 pb-3 pt-2 md:hidden">
          <nav className="flex gap-1 overflow-x-auto">
            {NAV.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs transition ${
                    active ? "bg-white/12 text-white" : "text-muted hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Icon size={12} />
                    {t(item.labelKey)}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <AuthModal open={openAuth} onClose={() => setOpenAuth(false)} />
    </>
  );
}
