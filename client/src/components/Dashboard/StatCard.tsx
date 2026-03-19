interface IStatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  gradient: string;
  border: string;
  isLoading?: boolean;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  gradient,
  border,
  isLoading,
}: IStatCardProps) => (
  <div
    className={`rounded-2xl border ${border} bg-linear-to-br ${gradient} p-5 backdrop-blur-sm`}
  >
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
        {label}
      </p>
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
        <Icon className="h-4 w-4 text-foreground/70" />
      </div>
    </div>
    {isLoading ? (
      <div className="h-8 w-12 rounded-lg bg-white/10 animate-pulse" />
    ) : (
      <p className="text-3xl font-bold text-foreground">{value}</p>
    )}
  </div>
);

export default StatCard;
