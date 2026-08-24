import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-yandex-red to-yandex-red-hover text-white shadow-lg shadow-yandex-red/25 hover:from-yandex-red-hover hover:to-[#d43315] hover:shadow-xl hover:shadow-yandex-red/35 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md dark:from-yandex-red dark:to-yandex-red-hover dark:shadow-dark-glow dark:hover:shadow-dark-glow",
  outline:
    "border-2 border-yandex-dark dark:border-dark-border bg-white dark:bg-dark-card text-yandex-dark dark:text-dark-text hover:bg-yandex-gray-50 dark:hover:bg-dark-input hover:-translate-y-0.5 active:translate-y-0",
  ghost: "text-yandex-gray-500 dark:text-dark-muted hover:text-yandex-red hover:bg-yandex-red-light dark:hover:bg-red-500/10",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
