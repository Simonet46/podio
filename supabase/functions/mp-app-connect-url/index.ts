// Edge Function: mp-app-connect-url
// La llama el FORM de postulación (público) para que el atleta conecte su MP
// durante el registro, ANTES de enviar. Recibe un `connect_token` (código de
// sesión que generó el navegador) y firma un `state` con él. El token de MP
// queda "en tránsito" en pending_mp_connections hasta que el form lo reclame.
//
// Secrets: MP_CLIENT_ID, MP_REDIRECT_URI, STATE_SECRET.
// Deploy con --no-verify-jwt (lo llama el sitio público).
import { cors, json, signState } from "../_shared/util.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const { connect_token } = await req.json().catch(() => ({}));
  // UUID v4 simple validation.
  if (
    typeof connect_token !== "string" ||
    !/^[0-9a-f-]{32,40}$/i.test(connect_token)
  ) {
    return json({ error: "connect_token inválido." }, 400);
  }

  const state = await signState({
    connect_token,
    kind: "mp-connect-app",
    exp: Date.now() + 1000 * 60 * 30, // 30 min (el form está abierto)
  });

  const clientId = (Deno.env.get("MP_CLIENT_ID") ?? "").trim();
  const redirectUri = (Deno.env.get("MP_REDIRECT_URI") ?? "").trim();
  const authUrl =
    `https://auth.mercadopago.com/authorization?client_id=${encodeURIComponent(clientId)}` +
    `&response_type=code&platform_id=mp&state=${encodeURIComponent(state)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return json({ url: authUrl });
});
