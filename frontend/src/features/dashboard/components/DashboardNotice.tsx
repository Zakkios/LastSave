import type { ReactNode } from "react";
import Button from "../../../shared/components/Button/Button";

interface DashboardNoticeProps {
  children: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  dismissLabel: string;
  onDismiss: () => void;
}

// Bandeau de proposition (« Passer en Terminé ? », « Le remettre en cours ? ») : jamais d'office.
const DashboardNotice = ({
  children,
  confirmLabel,
  onConfirm,
  dismissLabel,
  onDismiss,
}: DashboardNoticeProps) => (
  <div className="flex flex-col gap-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
    <p className="text-zinc-200">{children}</p>
    <div className="flex shrink-0 justify-end gap-2">
      <Button variant="ghost" size="sm" onClick={onDismiss}>
        {dismissLabel}
      </Button>
      <Button variant="primary" size="sm" onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </div>
  </div>
);

export default DashboardNotice;
