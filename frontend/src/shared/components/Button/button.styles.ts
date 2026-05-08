import type { ButtonSize, ButtonVariant } from "./button.types";

export const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-400 px-4 font-semibold text-zinc-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 ",
  ghost: "bg-transparent hover:bg-zinc-700",
};

export const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};
