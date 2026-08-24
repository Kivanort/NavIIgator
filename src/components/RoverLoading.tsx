"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLoadingImage } from "@/hooks/useLoadingImage";

export function RoverLoading() {
  const { src, alt } = useLoadingImage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center gap-6 py-16"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={src}
          alt={alt}
          width={160}
          height={160}
          className="h-36 w-36 object-contain sm:h-44 sm:w-44"
          priority
        />
      </motion.div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-bold text-yandex-dark dark:text-dark-text">
          Загрузка...
        </p>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-yandex-red"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
