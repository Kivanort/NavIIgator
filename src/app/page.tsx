"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { NavBrand } from "@/components/NavBrand";
import { Button } from "@/components/Button";
import { PageTransition } from "@/components/PageTransition";
import { useLanguage } from "@/context/LanguageContext";

const FEATURES = [
  {
    num: "01",
    icon: "🗺️",
    titleKey: "home.editorial1Title",
    textKey: "home.editorial1Text",
  },
  {
    num: "02",
    icon: "🗣️",
    titleKey: "home.editorial2Title",
    textKey: "home.editorial2Text",
  },
  {
    num: "03",
    icon: "🏆",
    titleKey: "home.editorial3Title",
    textKey: "home.editorial3Text",
  },
];

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-12 text-center sm:pt-24 sm:pb-16 md:pt-32 md:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(252,63,29,0.08),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(252,63,29,0.12),transparent_60%)]" />

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-4 text-xs font-bold uppercase tracking-[0.2em] text-yandex-red"
        >
          {t("home.badge")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <NavBrand className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl" />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto mb-10 max-w-2xl text-base leading-relaxed text-yandex-gray-500 dark:text-dark-muted sm:mb-12 sm:text-lg md:text-xl"
        >
          {t("home.heroTitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/quiz">
            <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-5 shadow-lg shadow-yandex-red/25 hover:shadow-xl hover:shadow-yandex-red/30">
              {t("home.takeQuiz")}
            </Button>
          </Link>
          <Link href="/routes">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 py-5">
              {t("home.chooseRoutes")}
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="border-t border-yandex-gray-200 dark:border-dark-border/40 py-16 md:py-20 transition-colors duration-300">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-2 md:grid-cols-3 md:gap-12">
          {FEATURES.map((item, i) => (
            <motion.div
              key={item.titleKey}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.12 }}
              className="group relative rounded-2xl border border-yandex-gray-200 dark:border-dark-border/50 bg-white dark:bg-dark-card p-8 shadow-card dark:shadow-dark-card hover:shadow-card-hover dark:hover:shadow-dark-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <span className="absolute top-4 right-6 text-5xl font-extrabold text-yandex-gray-100 dark:text-dark-border/40 select-none transition-colors duration-300">
                {item.num}
              </span>
              <div className="relative mb-5 text-4xl">
                {item.icon}
              </div>
              <h3 className="relative mb-2 text-lg font-extrabold tracking-tight dark:text-dark-text">
                {t(item.titleKey)}
              </h3>
              <p className="relative text-sm leading-relaxed text-yandex-gray-500 dark:text-dark-muted">
                {t(item.textKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
