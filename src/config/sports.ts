/**
 * Catálogo de deportes individuales subfinanciados.
 * Cada deporte tiene un color de panel para las tarjetas y el hero del perfil.
 */

export type SportKey =
  | "canotaje"
  | "escalada"
  | "natacion"
  | "atletismo"
  | "vela"
  | "judo"
  | "remo"
  | "bmx";

export interface Sport {
  key: SportKey;
  label: string;
  /** Color de panel (tarjeta + hero del perfil). */
  color: string;
}

export const SPORTS: Record<SportKey, Sport> = {
  canotaje: { key: "canotaje", label: "Canotaje", color: "#1E6E8C" },
  escalada: { key: "escalada", label: "Escalada", color: "#B5532A" },
  natacion: { key: "natacion", label: "Natación", color: "#1C7BB0" },
  atletismo: { key: "atletismo", label: "Atletismo", color: "#7A4FB0" },
  vela: { key: "vela", label: "Vela / Kite", color: "#0E8C7B" },
  judo: { key: "judo", label: "Judo", color: "#3A4A5C" },
  remo: { key: "remo", label: "Remo", color: "#2C6E63" },
  bmx: { key: "bmx", label: "BMX", color: "#C24A3A" },
};

export const SPORT_LIST: Sport[] = Object.values(SPORTS);

export function getSport(key: string): Sport | undefined {
  return SPORTS[key as SportKey];
}
