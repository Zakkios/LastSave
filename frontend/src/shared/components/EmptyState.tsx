import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex min-h-100 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-8 text-center">
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-2xl">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-zinc-50">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400 max-w-xs mx-auto">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
