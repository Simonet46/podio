"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SPORT_LIST } from "@/config/sports";

// ── Cliente Supabase del navegador (singleton, mantiene sesión) ──────────
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let _client: SupabaseClient | null = null;
function sb(): SupabaseClient | null {
  if (!SB_URL || !SB_ANON) return null;
  if (!_client) _client = createClient(SB_URL, SB_ANON);
  return _client;
}

type Application = {
  id: string;
  full_name: string;
  sport: string;
  discipline: string | null;
  location: string | null;
  email: string;
  age: number | null;
  media_url: string | null;
  photo_url: string | null;
  photo_secondary_url: string | null;
  payment_link: string | null;
  achievements: string | null;
  needs: string | null;
  socials: string | null;
  status: string;
  created_at: string;
  athlete_id: string | null;
};

type Phase = "loading" | "noenv" | "login" | "denied" | "ready";
type StatusFilter = "pending" | "approved" | "rejected";

type Draft = {
  appId: string;
  slug: string;
  full_name: string;
  first_name: string;
  sport: string;
  discipline: string;
  city: string;
  province: string;
  bio: string;
  goal_amount: string;
  scope: "la2028" | "otros";
  photo_url: string | null;
  photo_secondary_url: string | null;
  stats: [string, string][];
  fund_items: [string, string][];
};

const input =
  "mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-ink outline-none focus:border-celeste";
const eyebrow = "eyebrow text-steel";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildDraft(app: Application): Draft {
  const parts = (app.location ?? "").split(/[/,]/).map((t) => t.trim()).filter(Boolean);
  const sportKey = SPORT_LIST.find((s) => s.label === app.sport)?.key ?? "";
  const bio = [app.achievements, app.needs].filter(Boolean).join("\n\n");
  return {
    appId: app.id,
    slug: slugify(app.full_name),
    full_name: app.full_name,
    first_name: app.full_name.split(" ")[0] ?? app.full_name,
    sport: sportKey,
    discipline: app.discipline ?? "",
    city: parts[0] ?? "",
    province: parts[1] ?? parts[0] ?? "",
    bio,
    goal_amount: "10000",
    scope: "la2028",
    photo_url: app.photo_url,
    photo_secondary_url: app.photo_secondary_url,
    stats: [["", ""], ["", ""], ["", ""]],
    fund_items: [["", ""], ["", ""], ["", ""]],
  };
}

export function BackofficeApp() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMsg, setAuthMsg] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [allApps, setAllApps] = useState<Application[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [publishing, setPublishing] = useState(false);

  // ── Sesión ────────────────────────────────────────────────────────────
  const resolveSession = useCallback(async () => {
    const supa = sb();
    if (!supa) return setPhase("noenv");
    const { data } = await supa.auth.getSession();
    if (!data.session) return setPhase("login");
    setUserEmail(data.session.user.email ?? "");
    const { data: isAdmin } = await supa.rpc("is_admin");
    setPhase(isAdmin === true ? "ready" : "denied");
  }, []);

  useEffect(() => {
    resolveSession();
    const supa = sb();
    if (!supa) return;
    const { data: sub } = supa.auth.onAuthStateChange(() => resolveSession());
    return () => sub.subscription.unsubscribe();
  }, [resolveSession]);

  // ── Cargar postulaciones (todas; filtramos en cliente) ──────────────────
  const loadApps = useCallback(async () => {
    const supa = sb();
    if (!supa) return;
    setLoadingList(true);
    const { data, error } = await supa
      .from("athlete_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setAllApps(data as Application[]);
    setLoadingList(false);
  }, []);

  useEffect(() => {
    if (phase === "ready") loadApps();
  }, [phase, loadApps]);

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0 } as Record<StatusFilter, number>;
    for (const a of allApps) if (a.status in c) c[a.status as StatusFilter]++;
    return c;
  }, [allApps]);

  const apps = useMemo(
    () => allApps.filter((a) => a.status === filter),
    [allApps, filter],
  );

  // ── Acciones ──────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const supa = sb();
    if (!supa) return;
    setAuthMsg("");
    setBusy(true);
    const { error } = await supa.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setAuthMsg("No pudimos iniciar sesión. Revisá email y contraseña.");
  }

  async function handleLogout() {
    await sb()?.auth.signOut();
    setAllApps([]);
    setDraft(null);
  }

  async function handleReject(app: Application) {
    const supa = sb();
    if (!supa) return;
    if (!confirm(`¿Rechazar la postulación de ${app.full_name}?`)) return;
    setBusy(true);
    const { error } = await supa
      .from("athlete_applications")
      .update({ status: "rejected", reviewed_at: new Date().toISOString() })
      .eq("id", app.id);
    setBusy(false);
    setToast(error ? "Error al rechazar: " + error.message : `Postulación de ${app.full_name} rechazada.`);
    if (!error) loadApps();
  }

  async function handleApprove(e: React.FormEvent) {
    e.preventDefault();
    const supa = sb();
    if (!supa || !draft) return;
    if (!draft.slug || !draft.sport) {
      setToast("Completá al menos slug y deporte.");
      return;
    }
    setBusy(true);
    const stats = draft.stats.filter(([v, l]) => v.trim() || l.trim());
    const fund = draft.fund_items.filter(([t, d]) => t.trim() || d.trim());
    const { data, error } = await supa
      .from("athletes")
      .insert({
        slug: draft.slug,
        full_name: draft.full_name,
        first_name: draft.first_name,
        sport: draft.sport,
        discipline: draft.discipline,
        city: draft.city,
        province: draft.province,
        bio: draft.bio,
        goal_amount: Number(draft.goal_amount) || 0,
        raised_amount: 0,
        verified: true,
        scope: draft.scope,
        photo_url: draft.photo_url,
        photo_secondary_url: draft.photo_secondary_url,
        stats,
        fund_items: fund,
      })
      .select("id")
      .single();

    if (error || !data) {
      setBusy(false);
      setToast(
        error?.code === "23505"
          ? `Ya existe un atleta con el slug "${draft.slug}". Cambialo.`
          : "Error al crear el atleta: " + (error?.message ?? "desconocido"),
      );
      return;
    }

    const { error: e2 } = await supa
      .from("athlete_applications")
      .update({ status: "approved", athlete_id: data.id, reviewed_at: new Date().toISOString() })
      .eq("id", draft.appId);
    setBusy(false);
    setToast(
      e2
        ? "Atleta creado, pero no se pudo marcar la postulación: " + e2.message
        : `¡${draft.full_name} dado de alta! Acordate de "Publicar ahora" para que salga online.`,
    );
    setDraft(null);
    loadApps();
  }

  // ── Publicar ahora (dispara rebuild del sitio vía Edge Function) ────────
  async function handlePublish() {
    const supa = sb();
    if (!supa) return;
    setPublishing(true);
    setToast("");
    const { error } = await supa.functions.invoke("trigger-rebuild");
    setPublishing(false);
    setToast(
      error
        ? "No se pudo disparar la publicación (¿está configurada la función trigger-rebuild?): " + error.message
        : "🚀 Publicación disparada. El sitio se actualiza en ~1-2 min.",
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────
  if (phase === "loading") return <Centered>Cargando…</Centered>;

  if (phase === "noenv")
    return (
      <Centered>
        Supabase no está configurado en este entorno (faltan
        NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).
      </Centered>
    );

  if (phase === "login")
    return (
      <Centered>
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl border border-line bg-paper p-7 shadow-sm">
          <p className={eyebrow}>Backoffice</p>
          <h1 className="mt-1 font-display text-3xl font-700 uppercase tracking-tight text-ink">
            Ingresá
          </h1>
          <p className="mt-1 text-sm text-steel">Acceso para el equipo.</p>
          <label className="mt-6 block text-sm">
            <span className={eyebrow}>Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
          </label>
          <label className="mt-3 block text-sm">
            <span className={eyebrow}>Contraseña</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
          </label>
          {authMsg && <p className="mt-3 text-sm text-ribbon-red">{authMsg}</p>}
          <button
            type="submit"
            disabled={busy}
            className="mt-6 w-full rounded-lg bg-gold py-3 font-display text-base font-700 uppercase tracking-wide text-ink transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {busy ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </Centered>
    );

  if (phase === "denied")
    return (
      <Centered>
        <div className="text-center">
          <p className="text-ink">Tu usuario ({userEmail}) no tiene permisos de administrador.</p>
          <button onClick={handleLogout} className="mt-4 rounded-lg border border-line px-4 py-2 font-display text-sm font-600 uppercase tracking-wide text-ink">
            Salir
          </button>
        </div>
      </Centered>
    );

  // phase === "ready"
  return (
    <div className="min-h-screen bg-ice">
      {/* Topbar */}
      <header className="border-b border-line bg-ink text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-700 uppercase tracking-tight">
              {/* franja de marca */}
              <span className="mr-2 inline-flex align-middle">
                {["#6CC5E0", "#E4B23C", "#9C3B5A", "#2C6E63", "#7A4FB0"].map((c) => (
                  <span key={c} className="h-3 w-1.5 rounded-sm" style={{ backgroundColor: c }} />
                ))}
              </span>
              Backoffice
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-white/70 sm:inline">{userEmail}</span>
            <button
              onClick={handlePublish}
              disabled={publishing}
              title="Reconstruye el sitio público con los cambios aprobados"
              className="rounded-lg bg-gold px-3 py-1.5 font-display text-xs font-700 uppercase tracking-wide text-ink transition-transform hover:scale-[1.03] disabled:opacity-60"
            >
              {publishing ? "Publicando…" : "Publicar ahora"}
            </button>
            <button onClick={handleLogout} className="rounded-lg border border-white/25 px-3 py-1.5 font-display text-xs font-600 uppercase tracking-wide text-white/90 hover:bg-white/10">
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <p className={eyebrow}>Revisión de atletas</p>
        <h1 className="mt-1 font-display text-3xl font-700 uppercase tracking-tight text-ink sm:text-4xl">
          Postulaciones
        </h1>

        {/* Tabs con contadores */}
        <div className="mt-6 flex flex-wrap gap-2">
          {(["pending", "approved", "rejected"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 font-display text-xs font-700 uppercase tracking-wide transition-colors ${
                filter === s ? "bg-ink text-white" : "border border-line bg-paper text-steel hover:text-ink"
              }`}
            >
              {s === "pending" ? "Pendientes" : s === "approved" ? "Aprobadas" : "Rechazadas"}
              <span className={`rounded-full px-1.5 py-0.5 text-[11px] ${filter === s ? "bg-white/20" : "bg-ice text-ink"}`}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>

        {toast && (
          <div className="mt-5 rounded-xl border border-celeste bg-paper px-4 py-3 text-sm text-ink shadow-sm">
            {toast}
          </div>
        )}

        {/* Lista */}
        <div className="mt-6 space-y-4">
          {loadingList && <p className="text-steel">Cargando…</p>}
          {!loadingList && apps.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line bg-paper/60 px-6 py-12 text-center text-steel">
              No hay postulaciones {filter === "pending" ? "pendientes" : filter === "approved" ? "aprobadas" : "rechazadas"}.
            </div>
          )}
          {apps.map((app) => (
            <article key={app.id} className="overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
              <div className="flex flex-col gap-4 p-5 sm:flex-row">
                {/* Miniaturas */}
                <div className="flex shrink-0 gap-2">
                  <Thumb url={app.photo_url} label="Perfil" />
                  <Thumb url={app.photo_secondary_url} label="Acción" />
                </div>

                {/* Datos */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate font-display text-xl font-700 uppercase tracking-tight text-ink">
                        {app.full_name}
                      </h2>
                      <p className="text-sm text-steel">
                        {app.sport}
                        {app.discipline ? ` · ${app.discipline}` : ""}
                        {app.age ? ` · ${app.age} años` : ""}
                        {app.location ? ` · ${app.location}` : ""}
                      </p>
                    </div>
                    {filter === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDraft(buildDraft(app))}
                          className="rounded-lg bg-gold px-4 py-2 font-display text-sm font-700 uppercase tracking-wide text-ink hover:scale-[1.02]"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleReject(app)}
                          disabled={busy}
                          className="rounded-lg border border-line px-4 py-2 font-display text-sm font-600 uppercase tracking-wide text-steel hover:text-ink disabled:opacity-60"
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                  </div>

                  <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                    <Field label="Email" value={app.email} />
                    <Field label="Video / redes" value={app.media_url} link />
                    <Field label="Mercado Pago" value={app.payment_link} />
                    <Field label="Redes" value={app.socials} />
                    <Field label="Logros" value={app.achievements} wide />
                    <Field label="Necesita apoyo para" value={app.needs} wide />
                  </dl>
                  <p className="mt-3 text-xs text-steel">
                    Postulado: {new Date(app.created_at).toLocaleString("es-AR")}
                    {app.status === "approved" && app.athlete_id ? " · ✓ atleta creado" : ""}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Editor de aprobación (modal) */}
      {draft && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4">
          <form onSubmit={handleApprove} className="my-8 w-full max-w-2xl rounded-2xl border border-line bg-paper p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className={eyebrow}>Dar de alta</p>
                <h2 className="font-display text-2xl font-700 uppercase tracking-tight text-ink">
                  Nuevo atleta
                </h2>
              </div>
              <button type="button" onClick={() => setDraft(null)} className="text-2xl leading-none text-steel hover:text-ink" aria-label="Cerrar">
                ✕
              </button>
            </div>
            <p className="mt-1 text-sm text-steel">
              Revisá las fotos y completá el perfil. Al guardar queda publicado (verified).
            </p>

            {/* Fotos a aprobar */}
            <div className="mt-5">
              <span className={eyebrow}>Fotos (aprobá o quitá)</span>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <ApprovePhoto
                  title="Foto de perfil"
                  url={draft.photo_url}
                  onRemove={() => setDraft({ ...draft, photo_url: null })}
                  onMakePrimary={null}
                />
                <ApprovePhoto
                  title="Foto secundaria"
                  url={draft.photo_secondary_url}
                  onRemove={() => setDraft({ ...draft, photo_secondary_url: null })}
                  onMakePrimary={
                    draft.photo_secondary_url
                      ? () =>
                          setDraft({
                            ...draft,
                            photo_url: draft.photo_secondary_url,
                            photo_secondary_url: draft.photo_url,
                          })
                      : null
                  }
                />
              </div>
              {!draft.photo_url && !draft.photo_secondary_url && (
                <p className="mt-2 text-xs text-steel">Sin fotos: el perfil usará un monograma con sus iniciales.</p>
              )}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Text label="Nombre completo *" required value={draft.full_name} onChange={(v) => setDraft({ ...draft, full_name: v })} wide />
              <Text label="Nombre (corto) *" required value={draft.first_name} onChange={(v) => setDraft({ ...draft, first_name: v })} />
              <Text label="Slug (URL) *" required value={draft.slug} onChange={(v) => setDraft({ ...draft, slug: slugify(v) })} />
              <label className="block text-sm">
                <span className={eyebrow}>Deporte *</span>
                <select required value={draft.sport} onChange={(e) => setDraft({ ...draft, sport: e.target.value })} className={input}>
                  <option value="" disabled>Elegí deporte</option>
                  {SPORT_LIST.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </label>
              <Text label="Disciplina *" required value={draft.discipline} onChange={(v) => setDraft({ ...draft, discipline: v })} />
              <Text label="Ciudad" value={draft.city} onChange={(v) => setDraft({ ...draft, city: v })} />
              <Text label="Provincia" value={draft.province} onChange={(v) => setDraft({ ...draft, province: v })} />
              <label className="block text-sm">
                <span className={eyebrow}>Meta ($)</span>
                <input type="number" min={0} value={draft.goal_amount} onChange={(e) => setDraft({ ...draft, goal_amount: e.target.value })} className={input} />
              </label>
              <label className="block text-sm">
                <span className={eyebrow}>Alcance</span>
                <select value={draft.scope} onChange={(e) => setDraft({ ...draft, scope: e.target.value as "la2028" | "otros" })} className={input}>
                  <option value="la2028">Rumbo a LA 2028</option>
                  <option value="otros">Otros atletas argentinos</option>
                </select>
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className={eyebrow}>Historia / bio</span>
                <textarea rows={4} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} className={input} />
              </label>

              <PairEditor
                title="Stats (valor / etiqueta)"
                rows={draft.stats}
                placeholders={["Valor (ej. #2)", "Etiqueta (ej. Ranking)"]}
                onChange={(stats) => setDraft({ ...draft, stats })}
              />
              <PairEditor
                title="Tu aporte financia (título / descripción)"
                rows={draft.fund_items}
                placeholders={["Título", "Descripción"]}
                onChange={(fund_items) => setDraft({ ...draft, fund_items })}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDraft(null)} className="rounded-lg border border-line px-4 py-2 font-display text-sm font-600 uppercase tracking-wide text-steel">
                Cancelar
              </button>
              <button type="submit" disabled={busy} className="rounded-lg bg-gold px-5 py-2 font-display text-sm font-700 uppercase tracking-wide text-ink disabled:opacity-60">
                {busy ? "Guardando…" : "Dar de alta"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ── Subcomponentes ────────────────────────────────────────────────────────
function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center bg-ice px-4 text-steel">{children}</div>;
}

function Thumb({ url, label }: { url: string | null; label: string }) {
  return (
    <div className="text-center">
      <div className="h-20 w-16 overflow-hidden rounded-lg border border-line bg-ice">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <a href={url} target="_blank" rel="noopener noreferrer">
            <img src={url} alt={label} className="h-full w-full object-cover" />
          </a>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-steel">s/foto</div>
        )}
      </div>
      <span className="mt-1 block text-[10px] uppercase tracking-wide text-steel">{label}</span>
    </div>
  );
}

function ApprovePhoto({
  title,
  url,
  onRemove,
  onMakePrimary,
}: {
  title: string;
  url: string | null;
  onRemove: () => void;
  onMakePrimary: (() => void) | null;
}) {
  return (
    <div className="rounded-xl border border-line bg-ice/40 p-3">
      <span className="eyebrow text-steel">{title}</span>
      <div className="mt-2 aspect-[3/4] w-full overflow-hidden rounded-lg bg-line/30">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-steel">Sin foto</div>
        )}
      </div>
      {url && (
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" onClick={onRemove} className="rounded-md border border-line px-2 py-1 text-xs text-steel hover:text-ribbon-red">
            Quitar
          </button>
          {onMakePrimary && (
            <button type="button" onClick={onMakePrimary} className="rounded-md border border-line px-2 py-1 text-xs text-celeste-deep hover:underline">
              Usar como perfil
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Text({
  label,
  value,
  onChange,
  required,
  wide,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  wide?: boolean;
}) {
  return (
    <label className={`block text-sm ${wide ? "sm:col-span-2" : ""}`}>
      <span className={eyebrow}>{label}</span>
      <input required={required} value={value} onChange={(e) => onChange(e.target.value)} className={input} />
    </label>
  );
}

function PairEditor({
  title,
  rows,
  placeholders,
  onChange,
}: {
  title: string;
  rows: [string, string][];
  placeholders: [string, string];
  onChange: (rows: [string, string][]) => void;
}) {
  return (
    <div className="sm:col-span-2">
      <span className={eyebrow}>{title}</span>
      <div className="mt-1 space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2">
            <input
              placeholder={placeholders[0]}
              value={row[0]}
              onChange={(e) => {
                const next = rows.map((r) => [...r]) as [string, string][];
                next[i][0] = e.target.value;
                onChange(next);
              }}
              className={input + " mt-0"}
            />
            <input
              placeholder={placeholders[1]}
              value={row[1]}
              onChange={(e) => {
                const next = rows.map((r) => [...r]) as [string, string][];
                next[i][1] = e.target.value;
                onChange(next);
              }}
              className={input + " mt-0"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, link, wide }: { label: string; value: string | null; link?: boolean; wide?: boolean }) {
  if (!value) return null;
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className={eyebrow}>{label}</dt>
      <dd className="text-ink">
        {link ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="break-all text-celeste-deep underline">
            {value}
          </a>
        ) : (
          <span className="break-words">{value}</span>
        )}
      </dd>
    </div>
  );
}
