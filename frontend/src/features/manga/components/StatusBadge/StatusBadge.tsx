import { statusBadges } from "./statusBadge.styles";
import type { StatusBadgeProps } from "./statusBadge.types";

const StatusBadge = ({ label, status }: StatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadges[status]}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
