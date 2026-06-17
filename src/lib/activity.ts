import { diplomaTier, type DiplomaTier } from "@/config/site";

/**
 * Actividad "en vivo": feed de aportes recientes para dar movimiento y FOMO.
 * En la demo se genera del lado del cliente (Math.random está OK en el browser);
 * cuando entre Supabase, esto sale de la tabla `donations` en tiempo real.
 */

export interface ActivityTarget {
  label: string;
  href: string;
}

export interface Activity {
  id: number;
  name: string;
  tier: DiplomaTier;
  target: ActivityTarget;
  amount: number;
  ts: number;
}

const FIRST = [
  "Martín", "Sofía", "Juan", "Camila", "Nicolás", "Valentina", "Lucas",
  "Martina", "Mateo", "Julieta", "Tomás", "Florencia", "Santiago", "Agustina",
  "Joaquín", "Catalina", "Franco", "Delfina", "Federico", "Carla", "Rocío",
  "Gonzalo", "Micaela", "Ramiro", "Brenda", "Iván", "Guadalupe", "Bruno",
  "Lautaro", "Abril", "Emilia", "Thiago",
];
const LAST = ["G.", "L.", "P.", "M.", "R.", "S.", "D.", "F.", "V.", "C.", "B.", "A.", "T."];
const AMOUNTS = [10, 15, 25, 25, 25, 50, 50, 50, 75, 100];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Un aporte aleatorio (para sembrar y para el "tick" en vivo). */
export function randomActivity(
  targets: ActivityTarget[],
  ts: number,
  id: number,
): Activity {
  const amount = pick(AMOUNTS);
  return {
    id,
    name: `${pick(FIRST)} ${pick(LAST)}`,
    tier: diplomaTier(amount),
    target: pick(targets),
    amount,
    ts,
  };
}

/** "recién", "hace 40s", "hace 3 min", "hace 1 h". */
export function timeAgo(deltaMs: number): string {
  const s = Math.max(0, Math.floor(deltaMs / 1000));
  if (s < 8) return "recién";
  if (s < 60) return `hace ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  return `hace ${h} h`;
}
