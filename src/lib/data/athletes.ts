import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { SEED_ATHLETES } from "./seed";
import type { Athlete } from "./types";

/**
 * Capa de acceso a datos de atletas.
 * Fuente única de verdad para las páginas: si Supabase está configurado lee de
 * ahí, si no usa el seed local. El front no sabe (ni le importa) cuál es.
 */

const ONLY_VERIFIED = true;

export async function getAthletes(): Promise<Athlete[]> {
  if (isSupabaseConfigured) {
    const supabase = await getSupabase();
    if (supabase) {
      const query = supabase
        .from("athletes")
        .select("*")
        .order("created_at", { ascending: true });
      const { data, error } = ONLY_VERIFIED
        ? await query.eq("verified", true)
        : await query;
      if (!error && data) return data as Athlete[];
    }
  }
  return SEED_ATHLETES.filter((a) => !ONLY_VERIFIED || a.verified);
}

export async function getAthleteBySlug(slug: string): Promise<Athlete | null> {
  if (isSupabaseConfigured) {
    const supabase = await getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("athletes")
        .select("*")
        .eq("slug", slug)
        .eq("verified", true)
        .maybeSingle();
      if (!error && data) return data as Athlete;
    }
  }
  return (
    SEED_ATHLETES.find((a) => a.slug === slug && (!ONLY_VERIFIED || a.verified)) ??
    null
  );
}

/** Totales para la fila de stats del hero. */
export async function getGlobalStats() {
  const athletes = await getAthletes();
  const totalRaised = athletes.reduce((sum, a) => sum + a.raised_amount, 0);
  return {
    athleteCount: athletes.length,
    totalRaised,
  };
}
