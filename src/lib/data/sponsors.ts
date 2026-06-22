/**
 * Sponsors (empresas) y a quién apadrinan.
 * Demo: marcas inventadas. El logo real (si existe) va en /public/sponsors/;
 * si no, se muestra el nombre estilizado con el color de la marca.
 */
export interface Sponsor {
  id: string;
  name: string;
  /** Logo en /public/sponsors/<archivo>. Opcional (fallback a wordmark). */
  logo?: string;
  /** Color de la marca. */
  color: string;
}

export const SPONSORS: Record<string, Sponsor> = {
  idisko: { id: "idisko", name: "iDisko", color: "#6D28D9" },
  "coke-sprite": { id: "coke-sprite", name: "Coke Sprite SRL", color: "#D32F2F" },
};

/** Qué empresa apadrina a qué atleta/equipo (por slug). */
export const SPONSORSHIPS: Record<string, string> = {
  "lucia-ferreyra": "idisko",
  "valentina-moretti": "coke-sprite",
};

export function getSponsorForSlug(slug: string): Sponsor | null {
  const id = SPONSORSHIPS[slug];
  return (id && SPONSORS[id]) || null;
}
