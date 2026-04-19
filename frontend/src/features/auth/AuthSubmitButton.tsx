import type { ButtonHTMLAttributes, ReactNode } from "react";

interface AuthSubmitButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isSubmitting: boolean;
  submittingLabel: string;
}

const AuthSubmitButton = ({
  children,
  isSubmitting,
  submittingLabel,
  ...props
}: AuthSubmitButtonProps) => {
  return (
    <button
      className="h-11 w-full rounded-md bg-emerald-400 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
      disabled={isSubmitting}
      type="submit"
      {...props}
    >
      {isSubmitting ? submittingLabel : children}
    </button>
  );
};

export default AuthSubmitButton;
