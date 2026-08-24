"use client";

import { motion } from "framer-motion";
import type { Reward } from "@/types";

export function RewardCard({ reward, index }: { reward: Reward; index: number }) {
  const labels = { sticker: "Стикер музея", badge: "Значок", avatar: "Аватар" };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-2xl border border-yandex-gray-200 dark:border-dark-border/50 bg-white dark:bg-dark-card p-6 text-center shadow-card dark:shadow-dark-card transition-colors duration-300"
    >
      <div className="text-5xl mb-3">{reward.emoji}</div>
      <p className="text-xs font-bold uppercase tracking-wider text-yandex-red">{labels[reward.type]}</p>
      <h3 className="mt-1 text-lg font-extrabold dark:text-dark-text">{reward.title}</h3>
      <p className="mt-2 text-sm text-yandex-gray-500 dark:text-dark-muted">{reward.description}</p>
    </motion.div>
  );
}
