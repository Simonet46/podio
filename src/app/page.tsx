import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AthleteGrid } from "@/components/AthleteGrid";
import { CountdownFull } from "@/components/Countdown";
import { getAthletes, getGlobalStats } from "@/lib/data/athletes";
import { formatMoney } from "@/lib/money";
import { PLATFORM_FEE_RATE } from "@/config/site";
import Link from "next/link";

export default async function HomePage() {
  const athletes = await getAthletes();
  const { athleteCount, totalRaised } = await getGlobalStats();
  const netPct = Math.round((1 - PLATFORM_FEE_RATE) * 100);
  const feePct = Math.round(PLATFORM_FEE_RATE * 100);

  return (
    <>
      <Header />
      <main>
        {/* ───────── Hero ───────── */}
        <section className="relative overflow-hidden bg-ink text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(1200px 500px at 80% -10%, rgba(108,180,228,0.18), transparent), radial-gradient(800px 400px at 0% 110%, rgba(201,162,39,0.14), transparent)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-container px-4 py-16 sm:px-6 sm:py-24">
            <p className="eyebrow text-gold">Financiamiento directo · Atletas argentinos</p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-700 uppercase leading-[1.05] tracking-tight sm:text-6xl">
              Bancá a los atletas argentinos rumbo a{" "}
              <span className="text-gold">Los Ángeles 2028</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
              Muchos compiten al máximo nivel autofinanciándose: viajes,
              entrenador, equipo. Tu aporte llega directo —{netPct}% para el
              atleta, {feePct}% para sostener la plataforma.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#atletas"
                className="rounded-md bg-gold px-6 py-3 font-display text-base font-700 uppercase tracking-wide text-ink transition-transform hover:scale-[1.03]"
              >
                Ver atletas
              </Link>
              <Link
                href="#como-funciona"
                className="rounded-md border border-white/25 px-6 py-3 font-display text-base font-600 uppercase tracking-wide text-white transition-colors hover:bg-white/10"
              >
                Cómo funciona
              </Link>
            </div>

            {/* Contador + fila de stats */}
            <div className="mt-12 flex flex-col gap-8 border-t border-white/10 pt-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow mb-3 text-white/55">Cuenta regresiva a la ceremonia</p>
                <CountdownFull />
              </div>
              <div className="flex gap-8">
                <Stat value={String(athleteCount)} label="Atletas en campaña" />
                <Stat value={formatMoney(totalRaised)} label="Total recaudado" />
              </div>
            </div>
          </div>
        </section>

        {/* ───────── Grid de atletas ───────── */}
        <section id="atletas" className="bg-ice">
          <div className="mx-auto max-w-container px-4 py-16 sm:px-6">
            <div className="mb-8">
              <p className="eyebrow text-celeste-deep">En campaña</p>
              <h2 className="mt-2 font-display text-3xl font-700 uppercase tracking-tight text-ink sm:text-4xl">
                Elegí a quién bancar
              </h2>
            </div>
            <AthleteGrid athletes={athletes} />
          </div>
        </section>

        {/* ───────── Cómo funciona ───────── */}
        <section id="como-funciona" className="bg-paper">
          <div className="mx-auto max-w-container px-4 py-16 sm:px-6">
            <div className="mb-10">
              <p className="eyebrow text-celeste-deep">Simple y transparente</p>
              <h2 className="mt-2 font-display text-3xl font-700 uppercase tracking-tight text-ink sm:text-4xl">
                Cómo funciona
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <Step
                n="01"
                title="Elegís un atleta"
                body="Explorás los perfiles verificados de deportistas individuales en proceso de clasificación y elegís a quién querés bancar."
              />
              <Step
                n="02"
                title="Aportás una vez o por mes"
                body="Donación única o mensual, con el monto que quieras. Ves en vivo cuánto recibe el atleta antes de confirmar."
              />
              <Step
                n="03"
                title="La plata llega directo"
                body={`El ${netPct}% va al atleta y el ${feePct}% sostiene la plataforma. Pago seguro vía Stripe Connect: nunca custodiamos los fondos.`}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-700 tabular-nums text-gold sm:text-4xl">
        {value}
      </div>
      <div className="eyebrow mt-1 text-white/55">{label}</div>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-line bg-paper p-6">
      <div className="font-display text-5xl font-700 text-gold/30">{n}</div>
      <h3 className="mt-3 font-display text-xl font-600 uppercase tracking-wide text-ink">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-steel">{body}</p>
    </div>
  );
}
