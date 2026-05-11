interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  className?: string;
  color?: "indigo" | "emerald" | "amber" | "rose";
}

const ProgressBar = ({ 
  value, 
  max, 
  label, 
  className = "", 
  color = "indigo" 
}: ProgressBarProps) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  const colors = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500"
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || max > 0) && (
        <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
          {label && <span>{label}</span>}
          <span>{value} / {max} ({percentage}%)</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div 
          className={`h-full transition-all duration-300 ${colors[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
