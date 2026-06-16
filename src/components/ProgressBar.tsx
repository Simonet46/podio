import { progressPct } from "@/lib/money";

/**
 * Barra de progreso "camino al podio".
 * Gradiente celeste → oro. El porcentaje se calcula desde raised/goal.
 */
export function ProgressBar({
  raised,
  goal,
  className = "",
}: {
  raised: number;
  goal: number;
  className?: string;
}) {
  const pct = progressPct(raised, goal);
  return (
    <div
      className={`h-2.5 w-full overflow-hidden rounded-full bg-line ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Avance hacia la meta: ${pct}%`}
    >
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{
          width: `${pct}%`,
          background:
            "linear-gradient(to right, var(--celeste), var(--celeste-deep) 55%, var(--gold))",
        }}
      />
    </div>
  );
}
