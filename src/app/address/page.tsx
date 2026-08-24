"use client";

import { useLanguage } from "@/context/LanguageContext";
import { PageTransition } from "@/components/PageTransition";

export default function AddressPage() {
  const { t } = useLanguage();

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl dark:text-dark-text">
          {t("address.title")}
        </h1>

        <div className="space-y-8 text-base leading-relaxed text-yandex-gray-600 dark:text-dark-muted">
          <section className="rounded-2xl border border-yandex-gray-200 dark:border-dark-border/50 bg-white dark:bg-dark-card p-6 shadow-card dark:shadow-dark-card transition-colors duration-300">
            <h2 className="mb-2 text-xl font-bold text-yandex-dark dark:text-dark-text">
              {t("address.mainTitle")}
            </h2>
            <p className="mb-4">{t("address.mainAddr")}</p>
            <div className="overflow-hidden rounded-xl border border-yandex-gray-200 dark:border-dark-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.4!2d37.587!3d55.755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDQ1JzE4LjAiTiAzN8KwMzUnMTMuMiJF!5e0!3m2!1sru!2sru!4v1"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t("address.mainTitle")}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-yandex-gray-200 dark:border-dark-border/50 bg-white dark:bg-dark-card p-6 shadow-card dark:shadow-dark-card transition-colors duration-300">
            <h2 className="mb-2 text-xl font-bold text-yandex-dark dark:text-dark-text">
              {t("address.hoursTitle")}
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t("address.weekdays")}</span>
                <span className="font-semibold text-yandex-dark dark:text-dark-text">{t("address.weekdaysHours")}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("address.weekends")}</span>
                <span className="font-semibold text-yandex-dark dark:text-dark-text">{t("address.weekendsHours")}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("address.holidays")}</span>
                <span className="font-semibold text-yandex-dark dark:text-dark-text">{t("address.holidaysHours")}</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-yandex-gray-200 dark:border-dark-border/50 bg-white dark:bg-dark-card p-6 shadow-card dark:shadow-dark-card transition-colors duration-300">
            <h2 className="mb-2 text-xl font-bold text-yandex-dark dark:text-dark-text">
              {t("address.howToTitle")}
            </h2>
            <p>{t("address.howToText")}</p>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
