"use client";

import { useLanguage } from "@/context/LanguageContext";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/Button";

export default function SupportPage() {
  const { t } = useLanguage();

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl dark:text-dark-text">
          {t("support.title")}
        </h1>

        <div className="space-y-8 text-base leading-relaxed text-yandex-gray-600 dark:text-dark-muted">
          <section>
            <p className="text-lg">{t("support.intro")}</p>
          </section>

          <section className="rounded-2xl border border-yandex-gray-200 dark:border-dark-border/50 bg-white dark:bg-dark-card p-6 shadow-card dark:shadow-dark-card transition-colors duration-300">
            <h2 className="mb-4 text-xl font-bold text-yandex-dark dark:text-dark-text">
              {t("support.donateTitle")}
            </h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-yandex-gray-200 dark:border-dark-border bg-yandex-gray-50 dark:bg-dark-input p-4 transition-colors duration-300">
                <p className="mb-1 text-sm font-semibold text-yandex-dark dark:text-dark-text">
                  {t("support.cardTitle")}
                </p>
                <p className="text-sm text-yandex-gray-500 dark:text-dark-muted">
                  {t("support.cardNumber")}
                </p>
              </div>
              <div className="rounded-xl border border-yandex-gray-200 dark:border-dark-border bg-yandex-gray-50 dark:bg-dark-input p-4 transition-colors duration-300">
                <p className="mb-1 text-sm font-semibold text-yandex-dark dark:text-dark-text">
                  {t("support.walletTitle")}
                </p>
                <p className="text-sm text-yandex-gray-500 dark:text-dark-muted">
                  {t("support.walletNumber")}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-yandex-gray-200 dark:border-dark-border/50 bg-white dark:bg-dark-card p-6 shadow-card dark:shadow-dark-card transition-colors duration-300">
            <h2 className="mb-4 text-xl font-bold text-yandex-dark dark:text-dark-text">
              {t("support.otherTitle")}
            </h2>
            <p>{t("support.otherText")}</p>
          </section>

          <section>
            <p className="text-center text-sm text-yandex-gray-400 dark:text-dark-muted">
              {t("support.thanks")}
            </p>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
