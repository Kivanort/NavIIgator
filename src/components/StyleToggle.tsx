"use client";

import type { CommunicationStyle } from "@/types";

export function StyleToggle({
  style,
  onChange,
  className = "",
}: {
  style: CommunicationStyle;
  onChange: (s: CommunicationStyle) => void;
  className?: string;
}) {
  return (
    <div
      className={`flex w-full rounded-full border border-yandex-gray-200 dark:border-dark-border bg-yandex-gray-50 dark:bg-dark-card p-1 sm:inline-flex sm:w-auto transition-colors duration-300 ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange("formal")}
        className={`min-h-[44px] flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-all sm:flex-none sm:px-4 ${
          style === "formal"
            ? "bg-white dark:bg-dark-input text-yandex-dark dark:text-dark-text shadow-sm"
            : "text-yandex-gray-500 dark:text-dark-muted hover:text-yandex-dark dark:hover:text-dark-text"
        }`}
      >
        📋 Формальный
      </button>
      <button
        type="button"
        onClick={() => onChange("informal")}
        className={`min-h-[44px] flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-all sm:flex-none sm:px-4 ${
          style === "informal"
            ? "bg-white dark:bg-dark-input text-yandex-red shadow-sm"
            : "text-yandex-gray-500 dark:text-dark-muted hover:text-yandex-dark dark:hover:text-dark-text"
        }`}
      >
        😄 Неформальный
      </button>
    </div>
  );
}
