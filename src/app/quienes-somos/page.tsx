import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Monogram } from "@/components/Monogram";
import { Ribbon } from "@/components/Ribbon";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/config/site";
import { SPORTS } from "@/config/sports";

export const metadata: Metadata = {
  title: `Quiénes somos — ${SITE.brand}`,
  description:
    "Tres atletas argentinos de élite detrás de la plataforma: Diego Simonet, Pablo Simonet y Pilar Campoy.",
};

interface Founder {
  name: string;
  nickname?: string;
  role: string;
  color: string;
  bio: string[];
}

const FOUNDERS: Founder[] = [
  {
    name: "Diego Simonet",
    nickname: "El Chino",
    role: "Handball · Los Gladiadores",
    color: SPORTS.handball.color,
    bio: [
      "Referente histórico del handball argentino, lo llamaron “el Messi del handball”. Pasó 13 temporadas en el Montpellier de Francia, donde levantó la Champions League de Europa en 2018 además de copas y ligas.",
      "Con la Selección jugó seis Mundiales, tres Juegos Olímpicos y ganó tres oros panamericanos con Los Gladiadores. Se retiró en 2026 tras una carrera que marcó a una generación.",
    ],
  },
  {
    name: "Pablo Simonet",
    role: "Handball · Los Gladiadores",
    color: SPORTS.handball.color,
    bio: [
      "El menor de los hermanos Simonet, también Gladiador. Se formó jugando junto a sus hermanos en la Selección y desarrolló su carrera profesional en España.",
      "Defendió a la Argentina en los Juegos Olímpicos de París 2024. Conoce de primera mano lo que cuesta sostener una carrera de alto rendimiento lejos de casa.",
    ],
  },
  {
    name: "Pilar Campoy",
    nickname: "Pilu",
    role: "Hockey · Las Leonas",
    color: SPORTS.hockey.color,
    bio: [
      "Jugadora de la Selección Argentina de hockey, Las Leonas. Disputó los Juegos Olímpicos de Río 2016 y, ocho años después, volvió a vestir la celeste y blanca en París 2024.",
      "Medallista de oro en los Juegos Panamericanos 2023, vivió todo el ciclo olímpico desde adentro: la preparación, los viajes y el esfuerzo que casi nunca se ve.",
    ],
  },
];

export default function QuienesSomosPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-ink text-white">
          <div className="mx-auto max-w-container px-4 py-16 sm:px-6 sm:py-20">
            <p className="eyebrow text-gold">Quiénes somos</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-700 uppercase leading-[1.04] tracking-tight sm:text-6xl">
              Atletas bancando atletas
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
              {SITE.brand} nació de una idea simple, contada por quienes la vivieron:
              llegar a lo más alto del deporte argentino casi siempre significa
              bancarse todo. Detrás de la plataforma hay tres atletas que pasaron por
              ahí y decidieron hacer algo al respecto.
            </p>
          </div>
        </section>

        <Ribbon />

        {/* Fundadores */}
        <section className="bg-ice">
          <div className="mx-auto max-w-container px-4 py-16 sm:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              {FOUNDERS.map((f, i) => (
                <Reveal key={f.name} delay={i * 110}>
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
                    <div className="aspect-[4/3] w-full">
                      <Monogram name={f.name} color={f.color} className="h-full w-full" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="font-display text-2xl font-700 uppercase tracking-tight text-ink">
                        {f.name}
                      </h2>
                      <p className="mt-1 font-display text-sm font-600 uppercase tracking-wide text-celeste-deep">
                        {f.nickname ? `“${f.nickname}” · ` : ""}
                        {f.role}
                      </p>
                      <div className="mt-3 space-y-3 text-sm leading-relaxed text-steel">
                        {f.bio.map((p, j) => (
                          <p key={j}>{p}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Misión */}
        <section className="bg-paper">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
            <Reveal>
              <p className="eyebrow text-celeste-deep">Por qué lo hacemos</p>
              <h2 className="mt-3 font-display text-3xl font-700 uppercase tracking-tight text-ink sm:text-4xl">
                Para que el talento no dependa del bolsillo
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-steel">
                Vimos a compañeros enormes dejar el deporte por no poder sostenerlo, y
                a muchos otros llegar a la elite a fuerza de sacrificio y ayuda de su
                familia. {SITE.brand} existe para que cualquier persona del mundo pueda
                empujar, aunque sea un poco, a los atletas argentinos rumbo a Los
                Ángeles 2028 — directo, transparente y sin intermediarios.
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
