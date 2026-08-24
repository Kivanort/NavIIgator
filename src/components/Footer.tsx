"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-gray-200 dark:border-dark-border/40 bg-white dark:bg-dark-bg py-6 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-dark-muted">
        <p>
          © {new Date().getFullYear()} NavIIgator — {t("footer.about")}
        </p>
        <div className="mt-2 flex justify-center gap-4">
          <Link href="/about" className="hover:text-yandex-red transition-colors">
            {t("nav.about")}
          </Link>
          <Link href="/address" className="hover:text-yandex-red transition-colors">
            {t("nav.address")}
          </Link>
          <Link href="/support" className="hover:text-yandex-red transition-colors">
            {t("nav.supportDevs")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
