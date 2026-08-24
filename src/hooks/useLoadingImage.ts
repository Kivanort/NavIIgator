"use client";

import { useState, useEffect } from "react";

interface LoadingImage {
  src: string;
  alt: string;
}

const ICON_VERSION = "2";

const IMAGES: LoadingImage[] = [
  { src: `/rover2.svg?v=${ICON_VERSION}`, alt: "Rover" },
  { src: `/scooter.svg?v=${ICON_VERSION}`, alt: "Scooter" },
];

/**
 * Возвращает путь к SVG-картинке для экрана загрузки.
 * Выбор случайный при каждой загрузке страницы, затем фиксируется.
 */
export function useLoadingImage(): LoadingImage {
  const [image] = useState<LoadingImage>(
    () => IMAGES[Math.floor(Math.random() * IMAGES.length)]
  );

  return image;
}
