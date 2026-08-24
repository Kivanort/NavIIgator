"use client";

import Link from "next/link";
import { PageTransition } from "@/components/PageTransition";
import { RouteCard } from "@/components/RouteCard";
import { StyleToggle } from "@/components/StyleToggle";
import { Button } from "@/components/Button";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";

export default function RoutesPage() {
  const { profile, updateProfile, routes, isProfileComplete } = useApp();
  const { t } = useLanguage();

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl dark:text-dark-text">{t("routes.title")}</h1>
            <p className="mt-2 text-yandex-gray-500 dark:text-dark-muted">
              {isProfileComplete
                ? t("routes.profileHint", { name: profile.name })
                : t("routes.noProfileHint")}
            </p>
          </div>
          <div className="w-full shrink-0 md:w-auto">
            <StyleToggle
              style={profile.style}
              onChange={(style) => updateProfile({ style })}
            />
          </div>
        </div>

        {!isProfileComplete && (
          <div className="mb-8 rounded-2xl border border-yandex-red/20 bg-yandex-red-light dark:bg-red-500/10 dark:shadow-dark-glow p-6 text-center transition-colors duration-300">
            <p className="text-base font-semibold text-yandex-dark dark:text-dark-text">
              {t("routes.quizBanner")}
            </p>
            <p className="mt-1 text-sm text-yandex-gray-500 dark:text-dark-muted">
              {t("routes.quizBannerHint")}
            </p>
            <Link href="/quiz" className="mt-4 inline-block">
              <Button>{t("routes.quizBannerCta")}</Button>
            </Link>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
