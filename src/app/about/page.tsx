"use client";

import { useLanguage } from "@/context/LanguageContext";
import { PageTransition } from "@/components/PageTransition";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl dark:text-dark-text">
          {t("about.title")}
        </h1>

        <div className="space-y-8 text-base leading-relaxed text-yandex-gray-600 dark:text-dark-muted">
          <section>
            <h2 className="mb-3 text-xl font-bold text-yandex-dark dark:text-dark-text">
              {t("about.missionTitle")}
            </h2>
            <p>{t("about.missionText")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-yandex-dark dark:text-dark-text">
              {t("about.historyTitle")}
            </h2>
            <p>{t("about.historyText")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-yandex-dark dark:text-dark-text">
              {t("about.exhibitsTitle")}
            </h2>
            <p>{t("about.exhibitsText")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-yandex-dark dark:text-dark-text">
              {t("about.aiTitle")}
            </h2>
            <p>{t("about.aiText")}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-yandex-dark dark:text-dark-text">
              {t("about.contactsTitle")}
            </h2>
            <p>{t("about.contactsText")}</p>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
