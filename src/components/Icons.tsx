import type { ReactNode } from "react";

export function LanguageIcon({ className = "" }: { className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      language
    </span>
  );
}

export function YandexLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="76"
      height="24"
      viewBox="0 0 76 24"
      fill="none"
      aria-label="Яндекс"
    >
      <text
        x="0"
        y="19"
        fill="currentColor"
        fontSize="20"
        fontWeight="800"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        Яндекс
      </text>
    </svg>
  );
}

export function RouteIcon({ name }: { name: string }) {
  const icons: Record<string, ReactNode> = {
    keyboard: (
      <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
        <rect x="4" y="14" width="40" height="24" rx="4" stroke="currentColor" strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <rect
            key={i}
            x={8 + (i % 5) * 7}
            y={18 + Math.floor(i / 5) * 7}
            width="5"
            height="4"
            rx="1"
            fill="currentColor"
            opacity="0.5"
          />
        ))}
      </svg>
    ),
    gamepad: (
      <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
        <path
          d="M8 24c0-8 4-14 16-14s16 6 16 14-4 14-16 14S8 32 8 24z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M18 22v4M16 24h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="30" cy="21" r="2" fill="currentColor" />
        <circle cx="34" cy="25" r="2" fill="currentColor" />
      </svg>
    ),
    computer: (
      <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
        <rect x="6" y="10" width="36" height="24" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M16 38h16M24 34v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    chip: (
      <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
        <rect x="14" y="14" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
        {[12, 18, 24, 30, 36].map((p) => (
          <g key={p}>
            <path d={`M${p} 10v4M${p} 34v4M10 ${p}h4M34 ${p}h4`} stroke="currentColor" strokeWidth="2" />
          </g>
        ))}
      </svg>
    ),
    gadget: (
      <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
        <rect x="14" y="6" width="20" height="36" rx="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="36" r="2" fill="currentColor" />
      </svg>
    ),
  };
  return icons[name] ?? icons.computer;
}

export function ExhibitPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-gradient-to-br from-yandex-gray-100 to-yandex-gray-200 dark:from-dark-card dark:to-dark-input transition-colors duration-300">
      <div className="text-center px-4">
        <svg className="mx-auto mb-2 h-10 w-10 text-yandex-gray-400 dark:text-dark-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-xs font-medium text-yandex-gray-400 dark:text-dark-muted">{title}</p>
      </div>
    </div>
  );
}
