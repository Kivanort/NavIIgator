"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/Button";
import {
  calcQuizRewards,
  loadQuizResult,
  saveQuizResult,
} from "@/lib/utils";
import type { QuizResult, TourQuestion } from "@/types";

import appleQuiz from "@/data/quizzes/apple.json";
import programmersQuiz from "@/data/quizzes/programmers.json";
import entrepreneursQuiz from "@/data/quizzes/entrepreneurs.json";
import gamersQuiz from "@/data/quizzes/gamers.json";
import beginnerQuiz from "@/data/quizzes/beginner.json";
import allQuiz from "@/data/quizzes/all.json";

const STICKER_URL = "https://t.me/addstickers/navIIgator";

const quizByRoute: Record<string, TourQuestion[]> = {
  apple: appleQuiz as TourQuestion[],
  programmers: programmersQuiz as TourQuestion[],
  entrepreneurs: entrepreneursQuiz as TourQuestion[],
  gamers: gamersQuiz as TourQuestion[],
  beginner: beginnerQuiz as TourQuestion[],
  all: allQuiz as TourQuestion[],
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();

  const routeId = searchParams.get("route") ?? "";
  const visitedStr = searchParams.get("exhibits") ?? "0";
  const totalStr = searchParams.get("total") ?? "0";
  const visited = parseInt(visitedStr, 10) || 0;
  const total = parseInt(totalStr, 10) || 0;
  const completionPct = total > 0 ? Math.round((visited / total) * 100) : 0;

  const questions = useMemo(() => {
    return quizByRoute[routeId] ?? (allQuiz as TourQuestion[]);
  }, [routeId]);

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [saved, setSaved] = useState<QuizResult | null>(null);
  const [showQuiz, setShowQuiz] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const allAnswered = questions.every((_, i) => answers[i] !== undefined);

  useEffect(() => {
    if (routeId) {
      const existing = loadQuizResult(routeId);
      if (existing) {
        setSaved(existing);
        setShowQuiz(false);
      }
    }
    setHydrated(true);
  }, [routeId]);

  useEffect(() => {
    return () => {
      if (routeId) {
        const key = `quizResult:${routeId}`;
        sessionStorage.removeItem(key);
      }
    };
  }, [routeId]);

  function handleSubmit() {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    const score = Math.round((correct / questions.length) * 100);
    const rewards = calcQuizRewards(score);
    const result: QuizResult = {
      score,
      correct,
      total: questions.length,
      rewards,
      completedAt: new Date().toISOString(),
    };
    saveQuizResult(routeId, result);
    setSaved(result);
    setShowQuiz(false);
  }

  function handleRetake() {
    setAnswers({});
    setSaved(null);
    setShowQuiz(true);
  }

  if (!hydrated) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-xl px-4 py-8 text-center">
          <div className="h-8 w-32 mx-auto animate-pulse rounded bg-yandex-gray-200 dark:bg-dark-input" />
        </div>
      </PageTransition>
    );
  }

  if (showQuiz) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-xl px-4 py-8 sm:py-10">
          {total > 0 && (
            <div className="mb-8 rounded-2xl border border-yandex-gray-200 dark:border-dark-border/50 bg-white dark:bg-dark-card p-6 text-center shadow-card dark:shadow-dark-card transition-colors duration-300">
              <p className="text-sm text-yandex-gray-400 dark:text-dark-muted">
                {t("results.visitedExhibits")
                  .replace("{visited}", String(visited))
                  .replace("{total}", String(total))}
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-3xl font-extrabold text-yandex-red">{completionPct}%</span>
                <span className="text-sm text-yandex-gray-400 dark:text-dark-muted">
                  {t("results.routeComplete")}
                </span>
              </div>
              {visited < total && (
                <p className="mt-2 text-xs text-yandex-gray-400 dark:text-dark-muted">
                  {t("results.partialQuizWarning")}
                </p>
              )}
            </div>
          )}

          <h1 className="text-3xl font-extrabold tracking-tight dark:text-dark-text">
            {t("results.quizTitle")}
          </h1>
          <p className="mt-2 mb-8 text-yandex-gray-500 dark:text-dark-muted">
            {t("results.quizHintInformal")}
          </p>

          <div className="space-y-6">
            {questions.map((q, i) => (
              <div
                key={i}
                className="rounded-2xl border border-yandex-gray-200 dark:border-dark-border/50 bg-white dark:bg-dark-card p-6 shadow-card dark:shadow-dark-card transition-colors duration-300"
              >
                <p className="mb-4 font-bold dark:text-dark-text">
                  {i + 1}. {q.question}
                </p>
                {q.options.map((optText, optIdx) => (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [i]: optIdx }))
                    }
                    className={`mb-2 flex w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all last:mb-0 ${
                      answers[i] === optIdx
                        ? "border-yandex-red bg-yandex-red-light dark:bg-red-500/10 dark:shadow-dark-glow"
                        : "border-yandex-gray-200 dark:border-dark-border hover:border-yandex-gray-300 dark:hover:border-dark-muted"
                    }`}
                  >
                    <span className="dark:text-dark-text">{optText}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          <Button
            className="mt-8 w-full"
            size="lg"
            disabled={!allAnswered}
            onClick={handleSubmit}
          >
            {t("results.getRewards")}
          </Button>

          <button
            type="button"
            onClick={() => router.push("/routes")}
            className="mt-4 w-full text-center text-sm font-medium text-yandex-gray-400 dark:text-dark-muted hover:text-yandex-red dark:hover:text-yandex-red transition-colors"
          >
            {t("results.skipQuiz")}
          </button>
        </div>
      </PageTransition>
    );
  }

  if (!saved) return null;

  const hasRewards = saved.rewards.length > 0;
  const isExpert = saved.rewards.includes("badge-expert");

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-10 rounded-2xl bg-yandex-gray-50 dark:bg-dark-card p-8 text-center shadow-card dark:shadow-dark-card transition-colors duration-300"
        >
          <div className="text-5xl mb-4">
            {isExpert ? "🏆" : hasRewards ? "🎉" : "📊"}
          </div>
          <h1 className="text-3xl font-extrabold dark:text-dark-text">
            {t("results.thanks")}
          </h1>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="text-5xl font-extrabold text-yandex-red">
              {saved.score}%
            </span>
          </div>
          <p className="mt-2 text-sm text-yandex-gray-500 dark:text-dark-muted">
            {saved.correct} / {saved.total} {t("results.percentCorrect")}
          </p>
        </motion.div>

        {hasRewards ? (
          <>
            <h2 className="mb-6 text-center text-xl font-extrabold dark:text-dark-text">
              {t("results.yourRewards")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              {saved.rewards.includes("badge-expert") && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border-2 border-yellow-400/50 dark:border-yellow-500/30 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-500/10 dark:to-amber-500/10 p-6 text-center shadow-card dark:shadow-dark-card transition-colors duration-300"
                >
                  <div className="text-5xl mb-3">🏆</div>
                  <p className="text-xs font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                    {t("results.badgeTitle")}
                  </p>
                  <p className="mt-2 text-sm text-yandex-gray-500 dark:text-dark-muted">
                    {t("results.badgeDesc")}
                  </p>
                </motion.div>
              )}
              {saved.rewards.includes("avatar") && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-2xl border border-yandex-gray-200 dark:border-dark-border/50 bg-white dark:bg-dark-card p-6 text-center shadow-card dark:shadow-dark-card transition-colors duration-300"
                >
                  <div className="text-5xl mb-3">🧠</div>
                  <p className="text-xs font-bold uppercase tracking-wider text-yandex-red">
                    {t("results.avatarTitle")}
                  </p>
                  <p className="mt-2 text-sm text-yandex-gray-500 dark:text-dark-muted">
                    {t("results.avatarDesc")}
                  </p>
                </motion.div>
              )}
              {saved.rewards.includes("sticker") && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-yandex-gray-200 dark:border-dark-border/50 bg-white dark:bg-dark-card p-6 text-center shadow-card dark:shadow-dark-card transition-colors duration-300 sm:col-span-2"
                >
                  <div className="text-5xl mb-3">🎨</div>
                  <p className="text-xs font-bold uppercase tracking-wider text-yandex-red">
                    {t("results.stickerTitle")}
                  </p>
                  <a
                    href={STICKER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0088cc] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#006daa] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                    </svg>
                    {t("results.getStickers")}
                  </a>
                </motion.div>
              )}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-yandex-gray-200 dark:border-dark-border/50 bg-white dark:bg-dark-card p-8 text-center shadow-card dark:shadow-dark-card mb-8 transition-colors duration-300"
          >
            <div className="text-5xl mb-4">💪</div>
            <p className="text-lg font-bold dark:text-dark-text">
              {t("results.correctCount")
                .replace("{correct}", String(saved.correct))
                .replace("{total}", String(saved.total))}
            </p>
            <p className="mt-2 text-yandex-gray-500 dark:text-dark-muted">
              {t("results.tryAgain")}
            </p>
          </motion.div>
        )}

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button size="lg">{t("results.home")}</Button>
          </Link>
          <Button variant="outline" size="lg" onClick={handleRetake}>
            {t("results.retakeQuiz")}
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center dark:text-dark-muted">...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
