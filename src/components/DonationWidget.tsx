"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Athlete, DonationType } from "@/lib/data/types";
import { PRESET_AMOUNTS, PLATFORM_FEE_RATE } from "@/config/site";
import { breakdown, formatMoney } from "@/lib/money";
import { Ribbon } from "./Ribbon";

export function DonationWidget({ athlete }: { athlete: Athlete }) {
  const [type, setType] = useState<DonationType>("once");
  const [amount, setAmount] = useState<number>(PRESET_AMOUNTS.once[1]);
  const [custom, setCustom] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const presets = PRESET_AMOUNTS[type];
  const { fee, net } = breakdown(amount);
  const feePct = Math.round(PLATFORM_FEE_RATE * 100);
  const perMonth = type === "monthly";

  // Etiqueta del botón.
  const cta = useMemo(() => {
    if (amount <= 0) return "Ingresá un monto";
    return perMonth
      ? `Aportar ${formatMoney(amount)} por mes`
      : `Aportar ${formatMoney(amount)}`;
  }, [amount, perMonth]);

  function selectPreset(value: number) {
    setAmount(value);
    setCustom("");
  }

  function onCustom(raw: string) {
    setCustom(raw);
    const parsed = parseFloat(raw);
    setAmount(Number.isFinite(parsed) && parsed > 0 ? parsed : 0);
  }

  function switchType(next: DonationType) {
    setType(next);
    // Reseteamos a un preset del nuevo modo para evitar montos incoherentes.
    setAmount(PRESET_AMOUNTS[next][1]);
    setCustom("");
  }

  function handleSubmit() {
    if (amount <= 0 || loading) return;
    setLoading(true);
    // Modo demo (sitio estático): redirige a la página de gracias sin cobro real.
    // Para pagos reales se reintroduce el flujo de Stripe Checkout (ver README).
    const params = new URLSearchParams({
      slug: athlete.slug,
      amount: String(amount),
      type,
    });
    router.push(`/gracias?${params.toString()}`);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-paper shadow-sm">
      <Ribbon tall />
      <div className="p-5 sm:p-6">
        <h2 className="font-display text-xl font-600 uppercase tracking-wide text-ink">
          Bancá a {athlete.first_name}
        </h2>

        {/* Toggle único / mensual */}
        <div
          className="mt-4 grid grid-cols-2 rounded-lg border border-line p-1"
          role="tablist"
          aria-label="Tipo de aporte"
        >
          {(["once", "monthly"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={type === t}
              onClick={() => switchType(t)}
              className={`rounded-md py-2 font-display text-sm font-600 uppercase tracking-wide transition-colors ${
                type === t ? "bg-ink text-white" : "text-steel hover:text-ink"
              }`}
            >
              {t === "once" ? "Aporte único" : "Por mes"}
            </button>
          ))}
        </div>

        {/* Montos preset */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {presets.map((value) => {
            const selected = !custom && amount === value;
            return (
              <button
                key={value}
                onClick={() => selectPreset(value)}
                aria-pressed={selected}
                className={`rounded-lg border py-3 font-display text-lg font-600 transition-colors ${
                  selected
                    ? "border-gold bg-gold/10 text-ink"
                    : "border-line text-ink hover:border-steel"
                }`}
              >
                {formatMoney(value)}
                {perMonth && (
                  <span className="block text-[0.65rem] font-500 text-steel">
                    por mes
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Monto libre */}
        <label className="mt-4 block">
          <span className="eyebrow text-steel">Otro monto</span>
          <div className="mt-1 flex items-center rounded-lg border border-line px-3 focus-within:border-celeste">
            <span className="font-display text-lg text-steel">$</span>
            <input
              type="number"
              inputMode="decimal"
              min={1}
              step="1"
              value={custom}
              onChange={(e) => onCustom(e.target.value)}
              placeholder="0"
              aria-label="Monto personalizado en dólares"
              className="w-full bg-transparent px-2 py-2.5 font-display text-lg text-ink outline-none"
            />
            {perMonth && (
              <span className="font-display text-sm text-steel">/ mes</span>
            )}
          </div>
        </label>

        {/* Desglose transparente en vivo */}
        <dl className="mt-5 space-y-1.5 rounded-lg bg-ice p-4 text-sm">
          <Row label="Tu aporte" value={formatMoney(amount, { cents: true })} />
          <Row
            label={`Comisión plataforma (${feePct}%)`}
            value={`–${formatMoney(fee, { cents: true })}`}
            muted
          />
          <div className="my-1 border-t border-line" />
          <Row
            label={perMonth ? "El atleta recibe / mes" : "El atleta recibe"}
            value={formatMoney(net, { cents: true })}
            strong
          />
        </dl>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={amount <= 0 || loading}
          className="mt-4 w-full rounded-lg bg-gold py-3.5 font-display text-base font-700 uppercase tracking-wide text-ink transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-line disabled:text-steel disabled:hover:scale-100"
        >
          {loading ? "Redirigiendo…" : cta}
        </button>

        <p className="mt-3 text-center text-xs text-steel">
          Pago seguro · procesado vía Stripe Connect
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  strong,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className={muted ? "text-steel" : "text-ink"}>{label}</dt>
      <dd
        className={`font-display tabular-nums ${
          strong
            ? "text-lg font-700 text-celeste-deep"
            : muted
              ? "text-steel"
              : "font-600 text-ink"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
