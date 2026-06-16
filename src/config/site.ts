/**
 * Configuración central de PODIO.
 * Marca, comisión y fecha de LA 2028 viven SOLO acá (requisito del brief).
 * Cambiá estos valores y se propagan a toda la app.
 */

export const SITE = {
  /** Nombre de marca (placeholder — cambiar acá para renombrar todo el sitio). */
  brand: "PODIO",
  tagline: "Rumbo a LA 2028",
  description:
    "Bancá directo a los atletas argentinos en proceso de clasificación a Los Ángeles 2028.",
  /** URL canónica del sitio (usada por Stripe para callbacks). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

/** Comisión de plataforma. 0.07 = 7%. El resto (93%) va al atleta. */
export const PLATFORM_FEE_RATE = 0.07;

/**
 * Ceremonia de LA 2028 (14 de julio de 2028).
 * Fecha en UTC para que el contador sea consistente entre cliente y servidor.
 */
export const LA2028_DATE = new Date("2028-07-14T00:00:00Z");

/** Moneda mostrada al donante internacional. */
export const CURRENCY = "USD" as const;

/** Montos preset del widget de donación. */
export const PRESET_AMOUNTS = {
  once: [25, 50, 100],
  monthly: [10, 25, 50],
} as const;

/** Disclaimer legal (footer). NO afiliación con COI/COA ni federaciones. */
export const LEGAL_DISCLAIMER =
  `${SITE.brand} es una plataforma independiente de financiamiento entre personas. ` +
  "No tiene afiliación, patrocinio ni respaldo del Comité Olímpico Internacional (COI), " +
  "del Comité Olímpico Argentino (COA), de LA28 ni de ninguna federación deportiva. " +
  '"Los Ángeles 2028" se usa únicamente de forma descriptiva.';
