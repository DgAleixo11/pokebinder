type StatsCardProps = {
  title: string;
  value: string | number;
  valueClassName?: string;
};

export function StatsCard({
  title,
  value,
  valueClassName = "",
}: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="text-sm text-zinc-400">{title}</p>
      <strong className={`mt-2 block text-3xl ${valueClassName}`}>
        {value}
      </strong>
    </div>
  );
}