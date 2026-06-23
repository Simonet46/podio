// Edge Function: trigger-rebuild
// Dispara el workflow de GitHub Pages (workflow_dispatch) para republicar el sitio.
// Solo admins (verificado con is_admin() usando el JWT del que llama).
//
// Secrets necesarios (Dashboard → Edge Functions → Secrets):
//   GITHUB_TOKEN  → PAT fine-grained con permiso "Actions: Read and write" sobre el repo.
//   GITHUB_REPO   → opcional, por defecto "Simonet46/podio-c7217b".
//   GITHUB_WORKFLOW → opcional, por defecto "deploy.yml".
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  // 1) Verificar que quien llama es admin (con su propio JWT).
  const authHeader = req.headers.get("Authorization") ?? "";
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: isAdmin, error: adminErr } = await supabase.rpc("is_admin");
  if (adminErr) return json({ error: "No se pudo validar el usuario." }, 401);
  if (isAdmin !== true) return json({ error: "No autorizado." }, 403);

  // 2) Disparar el workflow de GitHub.
  const token = Deno.env.get("GITHUB_TOKEN");
  const repo = Deno.env.get("GITHUB_REPO") ?? "Simonet46/podio-c7217b";
  const workflow = Deno.env.get("GITHUB_WORKFLOW") ?? "deploy.yml";
  if (!token) return json({ error: "Falta configurar GITHUB_TOKEN en los secrets de la función." }, 500);

  const res = await fetch(
    `https://api.github.com/repos/${repo}/actions/workflows/${workflow}/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "ayudin-backoffice",
      },
      body: JSON.stringify({ ref: "main" }),
    },
  );

  if (!res.ok) {
    const detail = await res.text();
    return json({ error: `GitHub respondió ${res.status}: ${detail}` }, 502);
  }
  return json({ ok: true });
});
