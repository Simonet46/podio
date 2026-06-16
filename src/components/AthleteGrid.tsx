"use client";

import { useMemo, useState } from "react";
import type { Athlete } from "@/lib/data/types";
import { SPORT_LIST } from "@/config/sports";
import { AthleteCard } from "./AthleteCard";

/** Grid de atletas con filtro por deporte (chips). */
export function AthleteGrid({ athletes }: { athletes: Athlete[] }) {
  const [active, setActive] = useState<string | null>(null);

  // Solo mostramos chips de deportes que tienen al menos un atleta.
  const availableSports = useMemo(() => {
    const present = new Set(athletes.map((a) => a.sport));
    return SPORT_LIST.filter((s) => present.has(s.key));
  }, [athletes]);

  const filtered = active
    ? athletes.filter((a) => a.sport === active)
    : athletes;

  return (
    <div>
      {/* Chips de filtro */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Chip
          label="Todos"
          active={active === null}
          onClick={() => setActive(null)}
        />
        {availableSports.map((s) => (
          <Chip
            key={s.key}
            label={s.label}
            color={s.color}
            active={active === s.key}
            onClick={() => setActive(s.key)}
          />
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <AthleteCard key={a.id} athlete={a} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-steel">
          No hay atletas en esta categoría todavía.
        </p>
      )}
    </div>
  );
}

function Chip({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2 rounded-full border px-4 py-1.5 font-display text-sm font-500 uppercase tracking-wide transition-colors ${
        active
          ? "border-ink bg-ink text-white"
          : "border-line bg-paper text-steel hover:border-steel hover:text-ink"
      }`}
    >
      {color && (
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
      )}
      {label}
    </button>
  );
}
