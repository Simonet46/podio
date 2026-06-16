/**
 * Cliente de Supabase modular.
 * Devuelve `null` si no hay variables de entorno → la app cae al seed local.
 * El paquete @supabase/supabase-js se importa de forma dinámica para que la
 * app compile y corra aunque la dependencia no esté instalada.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** ¿Está Supabase configurado? Usado por la capa de datos para decidir la fuente. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/** Cliente público (lectura). `null` si no hay config. */
export async function getSupabase() {
  if (!url || !anonKey) return null;
  try {
    const { createClient } = await import("@supabase/supabase-js");
    return createClient(url, anonKey);
  } catch {
    // Dependencia no instalada — corremos con seed local.
    return null;
  }
}

/** Cliente de servicio (escritura: webhooks). NUNCA exponer al cliente. */
export async function getSupabaseAdmin() {
  if (!url || !serviceKey) return null;
  try {
    const { createClient } = await import("@supabase/supabase-js");
    return createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  } catch {
    return null;
  }
}
