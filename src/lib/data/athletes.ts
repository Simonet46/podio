import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { SEED_ATHLETES } from "./seed";
import { SEED_TEAMS } from "./teams";
import type { Athlete, Team } from "./types";

/**
 * Capa de acceso a datos.
 * En el sitio estático lee del seed local; si Supabase está configurado, de ahí.
 */

const ONLY_VERIFIED = true;

async function allAthletesRaw(): Promise<Athlete[]> {
  if (isSupabaseConfigured) {
    const supabase = await getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("athletes")
        .select("*")
        .eq("verified", true)
        .order("created_at", { ascending: true });
      if (!error && data) return data as Athlete[];
    }
  }
  return SEED_ATHLETES.filter((a) => !ONLY_VERIFIED || a.verified);
}

/** TODOS los atletas (individuales + jugadores de equipo). Para perfiles y conteos. */
export async function getAllAthletes(): Promise<Athlete[]> {
  return allAthletesRaw();
}

/** Solo atletas individuales (sin equipo). Para el grid del home. */
export async function getAthletes(): Promise<Athlete[]> {
  const all = await allAthletesRaw();
  return all.filter((a) => !a.team);
}

export async function getAthleteBySlug(slug: string): Promise<Athlete | null> {
  const all = await allAthletesRaw();
  return all.find((a) => a.slug === slug) ?? null;
}

/** Equipos (deportes de equipo). */
export async function getTeams(): Promise<Team[]> {
  return SEED_TEAMS.filter((t) => !ONLY_VERIFIED || t.verified);
}

export async function getTeamBySlug(slug: string): Promise<Team | null> {
  return SEED_TEAMS.find((t) => t.slug === slug) ?? null;
}

/** Jugadores de un equipo, en el orden de member_slugs. */
export async function getTeamMembers(team: Team): Promise<Athlete[]> {
  const all = await allAthletesRaw();
  return team.member_slugs
    .map((slug) => all.find((a) => a.slug === slug))
    .filter((a): a is Athlete => Boolean(a));
}

/** Totales para el home y para el reparto de "Bancá a todos". */
export async function getGlobalStats() {
  const athletes = await getAllAthletes();
  const teams = await getTeams();
  const totalRaised =
    athletes.reduce((s, a) => s + a.raised_amount, 0) +
    teams.reduce((s, t) => s + t.raised_amount, 0);
  return {
    // Atletas individuales + todos los jugadores de equipos.
    athleteCount: athletes.length,
    // Campañas visibles en el home: individuales + equipos.
    campaignCount: athletes.filter((a) => !a.team).length + teams.length,
    teamCount: teams.length,
    totalRaised,
  };
}
