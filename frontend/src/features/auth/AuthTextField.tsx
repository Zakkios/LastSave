import type { InputHTMLAttributes } from "react";

interface AuthTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

const AuthTextField = ({
  id,
  label,
  error,
  className = "",
  ...props
}: AuthTextFieldProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-zinc-200">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-11 w-full rounded-md border bg-zinc-950/70 px-3 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-400/35 ${
          error
            ? "border-red-400/70 focus:border-red-300"
            : "border-zinc-700 focus:border-emerald-300"
        } ${className}`}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default AuthTextField;
