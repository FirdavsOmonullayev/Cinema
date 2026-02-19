import type { Metadata } from "next";
import { Space_Grotesk, Sora } from "next/font/google";

import "@/app/globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { LanguageProvider } from "@/contexts/language-context";
import { SiteHeader } from "@/components/site-header";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const bodyFont = Sora({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Global Cinema Platform",
  description: "Global kino va seriallar uchun zamonaviy platforma"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} bg-bg text-text antialiased`}>
        <LanguageProvider>
          <AuthProvider>
            <div className="min-h-screen bg-hero-gradient">
              <SiteHeader />
              <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
                {children}
              </main>
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}


