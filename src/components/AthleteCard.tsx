import Link from "next/link";
import Image from "next/image";
import type { Athlete } from "@/lib/data/types";
import { getSport } from "@/config/sports";
import { asset } from "@/config/site";
import { formatMoney, progressPct } from "@/lib/money";
import { Monogram } from "./Monogram";
import { ProgressBar } from "./ProgressBar";

export function AthleteCard({ athlete }: { athlete: Athlete }) {
  const sport = getSport(athlete.sport);
  const color = sport?.color ?? "#1E6E8C";
  const pct = progressPct(athlete.raised_amount, athlete.goal_amount);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-paper shadow-sm transition-shadow hover:shadow-md">
      {/* Panel de color por deporte + monograma (o foto si existe). */}
      <Link
        href={`/atleta/${athlete.slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
        aria-label={`Ver perfil de ${athlete.full_name}`}
      >
        {athlete.photo_url ? (
          <Image
            src={asset(athlete.photo_url)}
            alt={athlete.full_name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Monogram
            name={athlete.full_name}
            color={color}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 font-display text-[0.7rem] font-600 uppercase tracking-wide text-white"
          style={{ backgroundColor: "rgba(10,26,47,0.72)" }}
        >
          {sport?.label ?? athlete.sport}
        </span>
      </Link>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-xl font-600 leading-tight text-ink">
          <Link href={`/atleta/${athlete.slug}`} className="hover:text-celeste-deep">
            {athlete.full_name}
          </Link>
        </h3>
        <p className="mt-0.5 text-sm text-steel">
          {athlete.city}, {athlete.province} · {athlete.discipline}
        </p>

        <div className="mt-4">
          <ProgressBar
            raised={athlete.raised_amount}
            goal={athlete.goal_amount}
          />
          <div className="mt-2 flex items-baseline justify-between font-display">
            <span className="text-sm text-ink">
              <span className="font-700 text-celeste-deep">
                {formatMoney(athlete.raised_amount)}
              </span>{" "}
              <span className="text-steel">
                de {formatMoney(athlete.goal_amount)}
              </span>
            </span>
            <span className="text-sm font-700 text-gold">{pct}%</span>
          </div>
        </div>

        <Link
          href={`/atleta/${athlete.slug}`}
          className="mt-4 block rounded-md border border-ink bg-ink py-2.5 text-center font-display text-sm font-600 uppercase tracking-wide text-white transition-colors hover:bg-ink-2"
        >
          Bancar a {athlete.first_name}
        </Link>
      </div>
    </article>
  );
}
