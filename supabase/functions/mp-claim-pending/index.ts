// Edge Function: mp-claim-pending
// Tras enviar la postulación, el form llama acá con el application_id recién
// creado + el connect_token. Mueve el token MP "en tránsito"
// (pending_mp_connections) a application_mp_accounts y marca mp_connected.
//
// Secrets: SUPABASE_SERVICE_ROLE_KEY.
// Deploy con --no-verify-jwt (lo llama el sitio público).
import { cors, json, serviceClient } from "../_shared/util.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const { application_id, connect_token } = await req.json().catch(() => ({}));
  if (!application_id || !connect_token) {
    return json({ error: "Faltan datos." }, 400);
  }

  const supa = serviceClient();

  const { data: app } = await supa
    .from("athlete_applications")
    .select("id, status")
    .eq("id", application_id)
    .single();
  if (!app) return json({ error: "Postulación no encontrada." }, 404);
  if (app.status !== "pending") {
    return json({ error: "Postulación no editable." }, 409);
  }

  const { data: pend } = await supa
    .from("pending_mp_connections")
    .select("*")
    .eq("connect_token", connect_token)
    .single();
  if (!pend) return json({ ok: false, reason: "sin_token" });

  const { error: insErr } = await supa.from("application_mp_accounts").upsert({
    application_id,
    mp_user_id: pend.mp_user_id,
    access_token: pend.access_token,
    refresh_token: pend.refresh_token,
    public_key: pend.public_key,
    token_expires_at: pend.token_expires_at,
    live_mode: pend.live_mode,
    updated_at: new Date().toISOString(),
  });
  if (insErr) return json({ ok: false, reason: insErr.message }, 500);

  await supa
    .from("athlete_applications")
    .update({ mp_connected: true })
    .eq("id", application_id);
  await supa
    .from("pending_mp_connections")
    .delete()
    .eq("connect_token", connect_token);

  return json({ ok: true });
});
