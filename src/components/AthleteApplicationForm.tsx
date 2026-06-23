"use client";

import { useRef, useState } from "react";
import { SPORT_LIST } from "@/config/sports";
import { WEB3FORMS_ACCESS_KEY, APPLICATIONS_EMAIL, SITE } from "@/config/site";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MercadoPagoConnect } from "./MercadoPagoConnect";

type Status = "idle" | "loading" | "ok" | "error";
type Photos = { photo_url: string | null; photo_secondary_url: string | null };

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export function AthleteApplicationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [secondaryFile, setSecondaryFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [secondaryPreview, setSecondaryPreview] = useState<string | null>(null);
  const [fileMsg, setFileMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function pickFile(
    which: "profile" | "secondary",
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0] ?? null;
    setFileMsg("");
    if (file && file.size > MAX_BYTES) {
      setFileMsg("La imagen supera los 5 MB. Probá con una más liviana.");
      e.target.value = "";
      return;
    }
    const preview = file ? URL.createObjectURL(file) : null;
    if (which === "profile") {
      setProfileFile(file);
      setProfilePreview(preview);
    } else {
      setSecondaryFile(file);
      setSecondaryPreview(preview);
    }
  }

  /** Sube las fotos al Storage y devuelve las URLs públicas. */
  async function uploadPhotos(): Promise<Photos> {
    const empty: Photos = { photo_url: null, photo_secondary_url: null };
    if (!isSupabaseConfigured) return empty;
    const supabase = await getSupabase();
    if (!supabase) return empty;

    async function up(file: File | null): Promise<string | null> {
      if (!file) return null;
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
      const path = `applications/${id}.${ext}`;
      const { error } = await supabase!.storage
        .from("athlete-media")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) return null;
      return supabase!.storage.from("athlete-media").getPublicUrl(path).data
        .publicUrl;
    }

    const [photo_url, photo_secondary_url] = await Promise.all([
      up(profileFile),
      up(secondaryFile),
    ]);
    return { photo_url, photo_secondary_url };
  }

  /** Guarda la postulación en Supabase como atleta PENDIENTE de revisión. */
  async function saveToSupabase(
    data: Record<string, string>,
    photos: Photos,
  ): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const supabase = await getSupabase();
      if (!supabase) return false;
      const { error } = await supabase.from("athlete_applications").insert({
        full_name: data.nombre || "",
        sport: data.deporte || "",
        discipline: data.disciplina || null,
        location: data.ciudad || null,
        email: data.email || "",
        age: data.edad ? Number(data.edad) : null,
        next_competition: data.proxima_competencia || null,
        media_url: data.foto || null,
        photo_url: photos.photo_url,
        photo_secondary_url: photos.photo_secondary_url,
        payment_link: data.mercadopago || null,
        achievements: data.logros || null,
        needs: data.necesidad || null,
        socials: data.redes || null,
        status: "pending",
      });
      return !error;
    } catch {
      return false;
    }
  }

  /** Notificación por email (Web3Forms) o, si no hay key, fallback a mailto. */
  async function notifyByEmail(
    data: Record<string, string>,
    photos: Photos,
  ): Promise<boolean> {
    if (WEB3FORMS_ACCESS_KEY) {
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: `Nueva postulación de atleta — ${SITE.brand}`,
            from_name: data.nombre || "Postulante",
            ...data,
            foto_perfil: photos.photo_url ?? "(no subida)",
            foto_secundaria: photos.photo_secondary_url ?? "(no subida)",
          }),
        });
        return res.ok;
      } catch {
        return false;
      }
    }
    const body = [
      `Nombre: ${data.nombre ?? ""}`,
      `Deporte: ${data.deporte ?? ""}`,
      `Disciplina: ${data.disciplina ?? ""}`,
      `Ciudad / Provincia: ${data.ciudad ?? ""}`,
      `Email: ${data.email ?? ""}`,
      `Edad: ${data.edad ?? ""}`,
      `Próxima competencia: ${data.proxima_competencia ?? ""}`,
      `Foto de perfil: ${photos.photo_url ?? "(no subida)"}`,
      `Foto secundaria: ${photos.photo_secondary_url ?? "(no subida)"}`,
      `Video / redes: ${data.foto ?? ""}`,
      `Mercado Pago: ${data.mercadopago || "(no vinculado)"}`,
      `Nivel y logros: ${data.logros ?? ""}`,
      `Para qué necesita apoyo: ${data.necesidad ?? ""}`,
      `Redes / links: ${data.redes ?? ""}`,
    ].join("\n");
    window.location.href = `mailto:${APPLICATIONS_EMAIL}?subject=${encodeURIComponent(
      "Postulación a " + SITE.brand,
    )}&body=${encodeURIComponent(body)}`;
    return true;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    setStatus("loading");

    // 0) Subir fotos al Storage (si Supabase está configurado).
    const photos = await uploadPhotos();

    // 1) Fuente de verdad: la postulación queda en Supabase como pendiente.
    const savedToDb = await saveToSupabase(data, photos);

    if (savedToDb) {
      if (WEB3FORMS_ACCESS_KEY) void notifyByEmail(data, photos);
      setStatus("ok");
      form.reset();
      return;
    }

    // 2) Sin DB (o falló): el email es el canal principal (Web3Forms o mailto).
    const notified = await notifyByEmail(data, photos);
    if (notified) {
      setStatus("ok");
      if (WEB3FORMS_ACCESS_KEY) form.reset();
    } else {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-line bg-paper p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-gold" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-4 font-display text-2xl font-700 uppercase tracking-tight text-ink">
          ¡Postulación enviada!
        </h3>
        <p className="mt-2 text-steel">
          La revisamos a mano (somos atletas, miramos cada una) y te escribimos.
          Gracias por querer sumarte.
        </p>
      </div>
    );
  }

  const input =
    "mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none focus:border-celeste";
  const label = "block text-sm";
  const labelText = "eyebrow text-steel";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={`${label} sm:col-span-2`}>
          <span className={labelText}>Nombre y apellido *</span>
          <input name="nombre" required className={input} />
        </label>
        <label className={label}>
          <span className={labelText}>Deporte *</span>
          <select name="deporte" required defaultValue="" className={input}>
            <option value="" disabled>
              Elegí tu deporte
            </option>
            {SPORT_LIST.map((s) => (
              <option key={s.key} value={s.label}>
                {s.label}
              </option>
            ))}
            <option value="Otro">Otro</option>
          </select>
        </label>
        <label className={label}>
          <span className={labelText}>Disciplina / prueba</span>
          <input name="disciplina" placeholder="Ej. K1 1000m" className={input} />
        </label>
        <label className={label}>
          <span className={labelText}>Ciudad / Provincia *</span>
          <input name="ciudad" required className={input} />
        </label>
        <label className={label}>
          <span className={labelText}>Email de contacto *</span>
          <input name="email" type="email" required className={input} />
        </label>
        <label className={label}>
          <span className={labelText}>Edad *</span>
          <input name="edad" type="number" min={8} max={80} required className={input} />
        </label>
        <label className={label}>
          <span className={labelText}>Próxima competencia</span>
          <input
            name="proxima_competencia"
            placeholder="Ej. Panamericano, septiembre 2026"
            className={input}
          />
        </label>

        {/* ─── Fotos ─── */}
        <div className="sm:col-span-2">
          <span className={labelText}>Tus fotos</span>
          <p className="mt-1 text-xs text-steel">
            Subí una foto de perfil (vertical, tu cara/medio cuerpo) y, si tenés,
            una foto secundaria en acción. JPG o PNG, hasta 5 MB. Nosotros revisamos
            y elegimos cuáles se publican.
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <PhotoInput
              label="Foto de perfil"
              preview={profilePreview}
              onChange={(e) => pickFile("profile", e)}
            />
            <PhotoInput
              label="Foto secundaria (en acción)"
              preview={secondaryPreview}
              onChange={(e) => pickFile("secondary", e)}
            />
          </div>
          {fileMsg && <p className="mt-2 text-sm text-ribbon-red">{fileMsg}</p>}
        </div>

        <div className="sm:col-span-2">
          <MercadoPagoConnect />
        </div>
        <label className={`${label} sm:col-span-2`}>
          <span className={labelText}>Video o redes (link, opcional)</span>
          <input
            name="foto"
            type="url"
            placeholder="Instagram, YouTube, Drive…"
            className={input}
          />
        </label>
        <label className={`${label} sm:col-span-2`}>
          <span className={labelText}>Nivel y logros *</span>
          <textarea
            name="logros"
            required
            rows={3}
            placeholder="Contanos tu palmarés y dónde estás hoy en tu camino competitivo."
            className={input}
          />
        </label>
        <div className={`${label} sm:col-span-2`}>
          <span className={labelText}>¿Para qué necesitás el apoyo? *</span>
          <p className="mt-1 text-xs text-steel">
            Este texto lo van a leer las personas que quieran apoyarte. Contá tu
            situación con detalle: cuanto más claro, más fácil es que te ayuden.
          </p>
          <textarea
            name="necesidad"
            required
            rows={5}
            placeholder="Ej.: Tu apoyo me permite pagarle a mi entrenador y a mi fisioterapeuta, comprar suplementos y vitaminas para recuperarme y rendir mejor, y costear los viajes, la estadía y la inscripción a las competencias clasificatorias. Hoy me banco casi todo solo: cada aporte me acerca a poder dedicarme 100% a entrenar y competir donde tengo que estar."
            className={`${input} mt-2`}
          />
        </div>
        <label className={`${label} sm:col-span-2`}>
          <span className={labelText}>Redes / links (Instagram, prensa, video)</span>
          <input name="redes" placeholder="@tu_usuario · enlaces" className={input} />
        </label>
      </div>

      {status === "error" && (
        <p className="mt-3 text-sm text-ribbon-red">
          No se pudo enviar. Probá de nuevo o escribinos a {APPLICATIONS_EMAIL}.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-5 w-full rounded-lg bg-gold py-3.5 font-display text-base font-700 uppercase tracking-wide text-ink transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {status === "loading" ? "Enviando…" : "Enviar postulación"}
      </button>
      <p className="mt-3 text-center text-xs text-steel">
        Revisamos cada postulación a mano antes de publicar. Sin costo para el atleta.
        Si sos menor de edad, te contactamos junto a tu madre, padre o tutor.
      </p>
    </form>
  );
}

function PhotoInput({
  label,
  preview,
  required,
  onChange,
}: {
  label: string;
  preview: string | null;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block cursor-pointer">
      <span className="eyebrow text-steel">{label}</span>
      <div className="mt-1 flex items-center gap-3 rounded-lg border border-dashed border-line bg-ice/40 p-3 transition-colors hover:border-celeste">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-line/40">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-steel">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                <path d="M4 16l4-4 4 4 4-6 4 6M4 20h16V4H4z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
        <div className="min-w-0 text-sm text-steel">
          {preview ? "Cambiar foto" : "Elegí una imagen"}
        </div>
      </div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        required={required}
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
}
