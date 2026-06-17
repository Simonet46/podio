"use client";

import { useMemo, useState } from "react";
import type { Athlete, Team } from "@/lib/data/types";
import { SPORT_LIST } from "@/config/sports";
import { AthleteCard } from "./AthleteCard";
import { TeamCard } from "./TeamCard";
import { Reveal } from "./Reveal";

/** Grid de campañas (atletas individuales + equipos) con filtro por deporte. */
export function AthleteGrid({
  athletes,
  teams = [],
}: {
  athletes: Athlete[];
  teams?: Team[];
}) {
  const [active, setActive] = useState<string | null>(null);

  // Chips solo de deportes presentes (en atletas o equipos).
  const availableSports = useMemo(() => {
    const present = new Set<string>([
      ...athletes.map((a) => a.sport),
      ...teams.map((t) => t.sport),
    ]);
    return SPORT_LIST.filter((s) => present.has(s.key));
  }, [athletes, teams]);

  const shownTeams = active ? teams.filter((t) => t.sport === active) : teams;
  const shownAthletes = active
    ? athletes.filter((a) => a.sport === active)
    : athletes;

  // Equipos primero, después individuales.
  const items = [
    ...shownTeams.map((t) => ({ key: `team-${t.id}`, node: <TeamCard team={t} /> })),
    ...shownAthletes.map((a) => ({
      key: `ath-${a.id}`,
      node: <AthleteCard athlete={a} />,
    })),
  ];

  return (
    <div>
      {/* Chips de filtro */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Chip label="Todos" active={active === null} onClick={() => setActive(null)} />
        {availableSports.map((s) => (
          <Chip
            key={s.key}
            label={s.label}
            color={s.color}
            team={s.team}
            active={active === s.key}
            onClick={() => setActive(s.key)}
          />
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.key} delay={(i % 3) * 90} className="h-full">
            <div className="h-full [&>article]:h-full">{item.node}</div>
          </Reveal>
        ))}
      </div>

      {items.length === 0 && (
        <p className="py-12 text-center text-steel">
          No hay campañas en esta categoría todavía.
        </p>
      )}
    </div>
  );
}

function Chip({
  label,
  color,
  team,
  active,
  onClick,
}: {
  label: string;
  color?: string;
  team?: boolean;
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
      {team && (
        <span className="rounded-sm bg-gold/20 px-1 text-[0.6rem] font-700 text-gold">
          EQUIPO
        </span>
      )}
    </button>
  );
}
