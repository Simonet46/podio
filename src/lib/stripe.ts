/**
 * Capa de Stripe modular (Connect, modelo pass-through).
 * Si STRIPE_SECRET_KEY no está, `getStripe()` devuelve null y la app corre en
 * "modo demo" (sin cobro real). El paquete `stripe` se importa dinámicamente
 * para que la app compile aunque no esté instalado.
 *
 * Arquitectura pass-through: la plataforma NUNCA custodia los fondos. La plata
 * fluye del donante a la cuenta conectada del atleta; la plataforma cobra un
 * application_fee del 7%.
 */

const secret = process.env.STRIPE_SECRET_KEY;

export const isStripeConfigured = Boolean(secret);

// Tipamos laxo para no depender de los tipos del paquete en build sin instalar.
export async function getStripe(): Promise<any | null> {
  if (!secret) return null;
  try {
    const mod = await import("stripe");
    const Stripe = mod.default;
    return new Stripe(secret, { apiVersion: "2024-06-20" });
  } catch {
    return null;
  }
}
