export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-yandex-gray-200 dark:bg-dark-input ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-yandex-red to-yandex-red-bright transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
