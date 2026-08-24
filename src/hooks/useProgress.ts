"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseProgressOptions {
  /** Target progress value (0–100) */
  target: number;
  /** Animation speed in ms (lower = faster). Default 600 */
  duration?: number;
  /** Delay before animation starts in ms. Default 0 */
  delay?: number;
}

export function useProgress({ target, duration = 600, delay = 0 }: UseProgressOptions) {
  const [display, setDisplay] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const rafRef = useRef<number>(0);
  const fromRef = useRef(0);
  const startRef = useRef(0);

  const animate = useCallback(
    (from: number, to: number) => {
      fromRef.current = from;
      startRef.current = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = from + (to - from) * eased;
        setDisplay(Math.round(current));

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplay(to);
          setIsDone(to >= 100);
        }
      };

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    },
    [duration]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      animate(fromRef.current, target);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, delay, animate]);

  const reset = useCallback(() => {
    setDisplay(0);
    setIsDone(false);
    fromRef.current = 0;
  }, []);

  return { display, isDone, reset };
}
