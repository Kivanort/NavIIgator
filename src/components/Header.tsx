"use client";

import Link from "next/link";
import { useLanguage, Lang } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

const LANGUAGES: { lang: Lang; label: string; flag: string }[] = [
  { lang: "ru", label: "Русский", flag: "\uD83C\uDDF7\uD83C\uDDFA" },
  { lang: "en", label: "English", flag: "\uD83C\uDDEC\uD83C\uDDE7" },
  { lang: "kk", label: "\u049A\u0430\u0437\u0430\u049B \u0442\u0456\u043B\u0456", flag: "\uD83C\uDDF0\uD83C\uDDFF" },
  { lang: "sr", label: "\u0421\u0440\u043F\u0441\u043A\u0438", flag: "\uD83C\uDDF7\uD83C\uDDF8" },
];

const NAV_ITEMS = [
  { key: "nav.about", href: "/about" },
  { key: "nav.address", href: "/address" },
  { key: "nav.quiz", href: "/quiz" },
  { key: "nav.routes", href: "/routes" },
  { key: "nav.chat", href: "/chat" },
  { key: "nav.supportDevs", href: "/support" },
];

function GlobeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
    </svg>
  );
}

function CompassIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="currentColor" opacity="0.85" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default function Header() {
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-yandex-gray-200 dark:border-dark-border/50 bg-white dark:bg-dark-bg/80 shadow-header dark:shadow-dark-header backdrop-blur-xl dark:backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-4 md:h-16 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-yandex-dark dark:text-dark-text transition-opacity hover:opacity-70"
          onClick={() => setMobileOpen(false)}
        >
          <CompassIcon className="h-7 w-7 text-yandex-red md:h-8 md:w-8" />
          <span className="text-lg font-extrabold tracking-tight md:text-xl">
            {"Яндекс"}
          </span>
          <span className="text-sm font-medium text-yandex-gray-400 dark:text-dark-muted">{"\u00D7"}</span>
          <span className="text-lg font-extrabold tracking-tight md:text-xl">
            <span className="text-yandex-dark dark:text-dark-text">{"\u041D\u0430\u0432"}</span>
            <span className="text-yandex-red">{"\u0418\u0418"}</span>
            <span className="text-yandex-dark dark:text-dark-text">{"\u0433\u0430\u0442\u043E\u0440"}</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center gap-1 pl-6 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "text-yandex-red bg-yandex-red-light dark:bg-red-500/10 dark:shadow-dark-glow"
                  : "text-yandex-gray-600 dark:text-dark-muted hover:text-yandex-red hover:bg-yandex-gray-50 dark:hover:bg-dark-card"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Right side: globe + burger */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme toggle */}
          <button
            type="button"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full text-yandex-gray-600 dark:text-dark-muted transition-colors hover:bg-yandex-gray-100 dark:hover:bg-dark-card hover:text-yandex-dark dark:hover:text-dark-text"
          >
            {theme === "dark" ? (
              <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          {/* Globe language picker */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              aria-label={t("nav.ariaLangPicker")}
              aria-expanded={langOpen}
              onClick={() => setLangOpen(!langOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-yandex-gray-600 dark:text-dark-muted transition-colors hover:bg-yandex-gray-100 dark:hover:bg-dark-card hover:text-yandex-dark dark:hover:text-dark-text"
            >
              <GlobeIcon className="h-5 w-5" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-yandex-gray-200 dark:border-dark-border/50 bg-white dark:bg-dark-card py-1 shadow-card-hover dark:shadow-dark-card-hover transition-colors">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.lang}
                    type="button"
                    onClick={() => {
                      setLang(l.lang);
                      setLangOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-yandex-gray-50 dark:hover:bg-dark-input ${
                      lang === l.lang
                        ? "font-bold text-yandex-red"
                        : "text-yandex-dark dark:text-dark-text"
                    }`}
                  >
                    <span className="text-base leading-none">{l.flag}</span>
                    <span>{l.label}</span>
                    {lang === l.lang && (
                      <span className="ml-auto text-xs text-yandex-red">{"\u2713"}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Animated burger */}
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-lg transition-colors hover:bg-yandex-gray-100 dark:hover:bg-dark-card md:hidden"
          >
            <span
              className={`block h-[2px] w-5 rounded-full bg-yandex-dark dark:bg-dark-text transition-all duration-300 ease-in-out ${
                mobileOpen
                  ? "translate-y-[7px] rotate-45"
                  : ""
              }`}
            />
            <span
              className={`block h-[2px] w-5 rounded-full bg-yandex-dark dark:bg-dark-text transition-all duration-300 ease-in-out ${
                mobileOpen
                  ? "scale-x-0 opacity-0"
                  : "opacity-100"
              }`}
            />
            <span
              className={`block h-[2px] w-5 rounded-full bg-yandex-dark dark:bg-dark-text transition-all duration-300 ease-in-out ${
                mobileOpen
                  ? "-translate-y-[7px] -rotate-45"
                  : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          mobileOpen ? "max-h-[500px] border-t border-yandex-gray-200 dark:border-dark-border/30" : "max-h-0"
        }`}
      >
        <nav className="mx-auto max-w-[1400px] px-4 py-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block border-b border-yandex-gray-100 dark:border-dark-border/30 py-3 text-base font-medium transition-colors ${
                pathname === item.href
                  ? "text-yandex-red"
                  : "text-yandex-gray-600 dark:text-dark-muted"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
