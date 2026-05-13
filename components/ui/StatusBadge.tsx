type StatusBadgeProps = {
  status: string;
  variant: "owned" | "selected" | "pending";
};

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const variants = {
    owned:
      "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 before:bg-emerald-400",
    selected:
      "border-sky-400/30 bg-sky-400/10 text-sky-300 before:bg-sky-400",
    pending:
      "border-zinc-700 bg-zinc-950 text-zinc-400 before:bg-zinc-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${variants[variant]} before:h-2 before:w-2 before:rounded-full`}
    >
      {status}
    </span>
  );
}