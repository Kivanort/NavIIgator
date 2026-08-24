"use client";

import { useEffect, useState, useCallback } from "react";
import { formatTime } from "@/lib/utils";

export function ExhibitTimer({
  durationSec,
  onComplete,
}: {
  durationSec: number;
  onComplete?: () => void;
}) {
  const [remaining, setRemaining] = useState(durationSec);

  useEffect(() => setRemaining(durationSec), [durationSec]);

  const tick = useCallback(() => {
    setRemaining((prev) => {
      if (prev <= 1) {
        onComplete?.();
        return 0;
      }
      return prev - 1;
    });
  }, [onComplete]);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [remaining, tick]);

  const progress = ((durationSec - remaining) / durationSec) * 100;

  return (
    <div className="rounded-2xl border border-yandex-gray-200 dark:border-dark-border/50 bg-yandex-gray-50 dark:bg-dark-card p-5 transition-colors duration-300">
      <div className="mb-2 flex justify-between">
        <span className="text-sm font-medium text-yandex-gray-500 dark:text-dark-muted">Время на экспонат</span>
        <span className={`font-mono text-2xl font-bold dark:text-dark-text ${remaining <= 15 && remaining > 0 ? "text-yandex-red" : ""}`}>
          {formatTime(remaining)}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-yandex-gray-200 dark:bg-dark-input">
        <div
          className="h-full rounded-full bg-yandex-red transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
