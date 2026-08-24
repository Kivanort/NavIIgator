"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";

export function InteractiveBlock({
  items,
}: {
  items: { id: string; label: string; content: string }[];
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-wider text-yandex-gray-400 dark:text-dark-muted">Интерактив</p>
      {items.map((item) => (
        <div key={item.id}>
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setOpen(open === item.id ? null : item.id)}>
            {item.label}
          </Button>
          <AnimatePresence>
            {open === item.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 overflow-hidden rounded-xl border-l-4 border-yandex-red bg-yandex-red-light dark:bg-red-500/10 dark:shadow-dark-glow p-4 text-sm text-yandex-gray-600 dark:text-dark-muted transition-colors duration-300"
              >
                {item.content}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
