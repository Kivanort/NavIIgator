"use client";

import { motion } from "framer-motion";
import { useLoadingImage } from "@/hooks/useLoadingImage";

interface RoverProgressProps {
  /** Current progress 0–100 */
  progress: number;
}

export function RoverProgress({ progress }: RoverProgressProps) {
  const clamped = Math.min(100, Math.max(0, progress));
  const { src, alt } = useLoadingImage();

  return (
    <div className="mt-8 mb-6 w-full sm:mt-10 sm:mb-8">
      {/* Image — above the track */}
      <div className="relative mx-auto mb-3 flex h-20 w-full items-end justify-start sm:h-28 md:h-32">
        <motion.div
          className="absolute bottom-0 z-10"
          animate={{ left: `${Math.min(clamped, 94)}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 16, mass: 0.8 }}
          style={{ left: `${Math.min(clamped, 94)}%` }}
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src={src}
              alt={alt}
              width={160}
              height={160}
              className="h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 object-contain drop-shadow-md"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Track — below the image */}
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-yandex-gray-100 dark:bg-dark-input transition-colors duration-300 sm:h-3">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-yandex-red/80 to-yandex-red"
          animate={{ width: `${clamped}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 16, mass: 0.8 }}
          style={{ width: `${clamped}%` }}
        />
        <div className="absolute inset-0 flex items-center">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="mx-0.5 h-0.5 w-1 rounded-full bg-white/20 sm:mx-1"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
