"use client";

import { useEffect, useState } from "react";
import { LA2028_DATE } from "@/config/site";

function diff(target: number) {
  const now = Date.now();
  const ms = Math.max(0, target - now);
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

/** Días restantes a LA 2028 — versión compacta para el header. */
export function CountdownMini() {
  const target = LA2028_DATE.getTime();
  // Evita mismatch de hidratación: render inicial neutro, luego el real.
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setDays(diff(target).days);
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="flex items-baseline gap-1.5 font-display leading-none">
      <span className="text-xl font-700 text-gold tabular-nums">
        {days === null ? "—" : days}
      </span>
      <span className="eyebrow text-[0.6rem] text-white/60">días a LA 2028</span>
    </div>
  );
}

/** Contador regresivo grande con unidades — para el hero. */
export function CountdownFull() {
  const target = LA2028_DATE.getTime();
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    const update = () => setT(diff(target));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);

  const units: [string, number | undefined][] = [
    ["Días", t?.days],
    ["Hs", t?.hours],
    ["Min", t?.minutes],
    ["Seg", t?.seconds],
  ];

  return (
    <div className="flex gap-3" role="timer" aria-label="Cuenta regresiva a LA 2028">
      {units.map(([label, value]) => (
        <div
          key={label}
          className="min-w-[64px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center"
        >
          <div className="font-display text-2xl font-700 tabular-nums text-white">
            {value === undefined ? "—" : String(value).padStart(2, "0")}
          </div>
          <div className="eyebrow text-[0.6rem] text-white/55">{label}</div>
        </div>
      ))}
    </div>
  );
}
