import { CURRENCY, PLATFORM_FEE_RATE } from "@/config/site";

/** Formatea un monto en USD para el donante internacional. */
export function formatMoney(amount: number, opts?: { cents?: boolean }): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: opts?.cents ? 2 : 0,
    maximumFractionDigits: opts?.cents ? 2 : 0,
  }).format(amount);
}

/**
 * Desglose transparente de un aporte.
 * fee = comisión de plataforma (7%), net = lo que recibe el atleta (93%).
 */
export function breakdown(amount: number) {
  const safe = Number.isFinite(amount) && amount > 0 ? amount : 0;
  const fee = Math.round(safe * PLATFORM_FEE_RATE * 100) / 100;
  const net = Math.round((safe - fee) * 100) / 100;
  return { amount: safe, fee, net };
}

/** Comisión en centavos para Stripe `application_fee_amount`. */
export function feeInCents(amount: number): number {
  return Math.round(amount * PLATFORM_FEE_RATE * 100);
}

/** Porcentaje de avance hacia la meta (0–100, recortado). */
export function progressPct(raised: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}
