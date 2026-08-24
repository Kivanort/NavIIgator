"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { PageTransition } from "@/components/PageTransition";
import { ExhibitTimer } from "@/components/ExhibitTimer";
import { StyleToggle } from "@/components/StyleToggle";
import { ExhibitPlaceholder } from "@/components/Icons";
import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import { getExhibitText, getExhibitDurationSec, getLocalizedExhibit } from "@/lib/utils";

function TourContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const routeId = searchParams.get("route") ?? "";
  const { t, lang } = useLanguage();

  const {
    profile,
    updateProfile,
    routes,
    tour,
    startTour,
    nextExhibit,
    prevExhibit,
    setTimerDone,
    getRouteExhibits,
    finishTour,
  } = useApp();

  const [showFinishModal, setShowFinishModal] = useState(false);

  const route = routes.find((r) => r.id === routeId);
  const exhibits = route ? getRouteExhibits(routeId) : [];
  const idx = tour?.routeId === routeId ? tour.exhibitIndex : 0;
  const exhibit = exhibits[idx];
  const durationSec = getExhibitDurationSec(profile.tourTime);

  useEffect(() => {
    if (routeId && (!tour || tour.routeId !== routeId)) {
      startTour(routeId);
    }
  }, [routeId, tour, startTour]);

  const goToResults = () => {
    const visited = tour?.visitedExhibits ?? idx + 1;
    finishTour();
    router.push(`/results?route=${routeId}&exhibits=${visited}&total=${exhibits.length}`);
  };

  if (!route || !exhibit) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold dark:text-dark-text">{t("tour.routeNotFound")}</h1>
        <Link href="/routes" className="mt-6 inline-block">
          <Button>{t("tour.selectRoute")}</Button>
        </Link>
      </div>
    );
  }

  const isLast = idx >= exhibits.length - 1;
  const localizedExhibit = getLocalizedExhibit(exhibit.id, lang) || exhibit;
  const text = getExhibitText(exhibit, profile, lang);
  const progress = ((idx + 1) / exhibits.length) * 100;
  const visited = tour?.visitedExhibits ?? idx + 1;
  const textTone =
    profile.style === "formal"
      ? "border-l-4 border-yandex-gray-300 dark:border-dark-border pl-4"
      : "border-l-4 border-yandex-red pl-4";

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-yandex-gray-400 dark:text-dark-muted">{route.title}</p>
            <p className="text-sm font-semibold dark:text-dark-text">
              {t("tour.exhibitCounter", { current: idx + 1, total: exhibits.length })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StyleToggle
              style={profile.style}
              onChange={(style) => updateProfile({ style })}
            />
            {!isLast && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFinishModal(true)}
              >
                {t("tour.finishEarly")}
              </Button>
            )}
          </div>
        </div>

        <ProgressBar value={progress} className="mb-8" />

        <motion.article
          key={exhibit.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-yandex-gray-200 dark:border-dark-border/50 bg-white dark:bg-dark-card shadow-card dark:shadow-dark-card transition-colors duration-300"
        >
          <ExhibitPlaceholder title={t("tour.exhibitPlaceholder")} />
          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl dark:text-dark-text">{localizedExhibit.name}</h1>
            <p className="mt-2 text-sm text-yandex-gray-400 dark:text-dark-muted">
              {localizedExhibit.year} · {localizedExhibit.country}
            </p>
            <p className={`mt-6 whitespace-pre-line text-base leading-relaxed text-yandex-gray-600 dark:text-dark-muted ${textTone}`}>
              {text}
            </p>

            {localizedExhibit.category.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {localizedExhibit.category.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full bg-yandex-gray-100 dark:bg-dark-input px-3 py-1 text-xs font-medium text-yandex-gray-500 dark:text-dark-muted"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8">
              <ExhibitTimer
                key={exhibit.id}
                durationSec={durationSec}
                onComplete={() => setTimerDone(true)}
              />
            </div>
          </div>
        </motion.article>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button
            variant="outline"
            size="lg"
            disabled={idx === 0}
            onClick={prevExhibit}
          >
            {t("quiz.back")}
          </Button>

          {isLast ? (
            <Button size="lg" onClick={goToResults}>
              {t("tour.finish")}
            </Button>
          ) : (
            <Button size="lg" onClick={nextExhibit}>
              {t("tour.nextExhibit")}
            </Button>
          )}
        </div>
      </div>

      {/* Early Finish Confirmation Modal */}
      <AnimatePresence>
        {showFinishModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowFinishModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-yandex-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-6 shadow-xl dark:shadow-dark-card transition-colors duration-300"
            >
              <h2 className="text-xl font-extrabold dark:text-dark-text">
                {t("tour.finishEarlyTitle")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-yandex-gray-500 dark:text-dark-muted">
                {t("tour.finishEarlyDesc")
                  .replace("{visited}", String(visited))
                  .replace("{total}", String(exhibits.length))}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" size="lg" onClick={() => setShowFinishModal(false)}>
                  {t("tour.finishEarlyReturn")}
                </Button>
                <Button size="lg" onClick={goToResults}>
                  {t("tour.finishEarlyConfirm")}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

export default function TourPage() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={<div className="py-20 text-center dark:text-dark-muted">{t("tour.loading")}</div>}>
      <TourContent />
    </Suspense>
  );
}
