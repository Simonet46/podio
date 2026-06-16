import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Ribbon } from "@/components/Ribbon";
import { getAthleteBySlug } from "@/lib/data/athletes";
import { breakdown, formatMoney } from "@/lib/money";
import type { DonationType } from "@/lib/data/types";

/**
 * Página de éxito post-pago.
 * Demo: recibe slug/amount/type por query.
 * Stripe real: recibiría session_id (TODO: recuperar la sesión para confirmar).
 */
export default async function GraciasPage({
  searchParams,
}: {
  searchParams: { slug?: string; amount?: string; type?: string; session_id?: string };
}) {
  const slug = searchParams.slug ?? "";
  const amount = parseFloat(searchParams.amount ?? "0") || 0;
  const type: DonationType = searchParams.type === "monthly" ? "monthly" : "once";
  const athlete = slug ? await getAthleteBySlug(slug) : null;
  const { net } = breakdown(amount);
  const perMonth = type === "monthly";

  return (
    <>
      <Header />
      <main className="bg-ice">
        <div className="mx-auto max-w-xl px-4 py-20 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
            <Ribbon tall />
            <div className="p-8 text-center sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15">
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8 text-gold"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden
                >
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h1 className="mt-5 font-display text-3xl font-700 uppercase tracking-tight text-ink">
                ¡Gracias por bancar!
              </h1>

              {athlete ? (
                <p className="mt-3 text-steel">
                  Tu aporte {perMonth ? "mensual " : ""}a{" "}
                  <span className="font-600 text-ink">{athlete.full_name}</span> se
                  registró correctamente.
                </p>
              ) : (
                <p className="mt-3 text-steel">Tu aporte se registró correctamente.</p>
              )}

              {amount > 0 && (
                <dl className="mt-6 space-y-2 rounded-xl bg-ice p-5 text-left">
                  <div className="flex justify-between">
                    <dt className="text-steel">Tu aporte</dt>
                    <dd className="font-display font-600 text-ink">
                      {formatMoney(amount, { cents: true })}
                      {perMonth && " / mes"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-steel">
                      {perMonth ? "El atleta recibe / mes" : "El atleta recibe (neto del 7%)"}
                    </dt>
                    <dd className="font-display text-lg font-700 text-celeste-deep">
                      {formatMoney(net, { cents: true })}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-steel">Tipo</dt>
                    <dd className="font-display font-600 uppercase text-ink">
                      {perMonth ? "Mensual" : "Único"}
                    </dd>
                  </div>
                </dl>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                {athlete && (
                  <Link
                    href={`/atleta/${athlete.slug}`}
                    className="rounded-md border border-ink px-5 py-2.5 font-display text-sm font-600 uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-white"
                  >
                    Volver al perfil
                  </Link>
                )}
                <Link
                  href="/#atletas"
                  className="rounded-md bg-gold px-5 py-2.5 font-display text-sm font-700 uppercase tracking-wide text-ink transition-transform hover:scale-[1.03]"
                >
                  Bancar a otro atleta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
