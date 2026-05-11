interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
}

const StatCard = ({ title, value, description, icon, trend }: StatCardProps) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-zinc-400">{title}</p>
        {icon && <div className="text-zinc-500">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-zinc-50">{value}</h3>
        {trend && (
          <span className={`text-xs font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.isPositive ? '+' : '-'}{trend.value}%
          </span>
        )}
      </div>
      {(description || trend) && (
        <p className="mt-1 text-xs text-zinc-500">
          {description || trend?.label}
        </p>
      )}
    </div>
  );
};

export default StatCard;
