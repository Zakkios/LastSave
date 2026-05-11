import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => (
  <div className={`rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = "" }: CardProps) => (
  <div className={`border-b border-zinc-800 p-6 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = "" }: CardProps) => (
  <h3 className={`text-lg font-semibold text-zinc-50 ${className}`}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = "" }: CardProps) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);
