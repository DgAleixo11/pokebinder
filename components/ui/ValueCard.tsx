type ValueCardProps = {
  title: string;
  description: string;
  value: string;
  valueClassName?: string;
};

export function ValueCard({
  title,
  description,
  value,
  valueClassName = "",
}: ValueCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="text-sm text-zinc-400">{title}</p>
      <strong className={`mt-2 block text-2xl ${valueClassName}`}>
        {value}
      </strong>
      <p className="mt-2 text-xs text-zinc-500">{description}</p>
    </div>
  );
}