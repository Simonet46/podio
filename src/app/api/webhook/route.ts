import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";
import { breakdown } from "@/lib/money";
import type { DonationType } from "@/lib/data/types";

export const runtime = "nodejs";

/**
 * Webhook de Stripe.
 * Registra la donación en Supabase y actualiza raised_amount del atleta.
 * Requiere STRIPE_WEBHOOK_SECRET. Sin Supabase configurado, solo loguea.
 */
export async function POST(req: Request) {
  const stripe = await getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook no configurado." },
      { status: 503 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Falta firma." }, { status: 400 });
  }

  const payload = await req.text();
  let event: any;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (e) {
    console.error("Firma de webhook inválida:", e);
    return NextResponse.json({ error: "Firma inválida." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const athleteId = session.metadata?.athlete_id as string | undefined;
    const type = (session.metadata?.type as DonationType) ?? "once";
    const amount = (session.amount_total ?? 0) / 100;
    const { fee, net } = breakdown(amount);

    const supabase = await getSupabaseAdmin();
    if (supabase && athleteId && amount > 0) {
      // Registrar la donación.
      await supabase.from("donations").insert({
        athlete_id: athleteId,
        amount,
        type,
        platform_fee: fee,
        net_amount: net,
        donor_email: session.customer_details?.email ?? null,
        stripe_payment_id: session.payment_intent ?? session.id,
        status: "succeeded",
      });

      // Actualizar el recaudado del atleta (incremento atómico vía RPC).
      const { error: rpcError } = await supabase.rpc("increment_raised", {
        p_athlete_id: athleteId,
        p_amount: amount,
      });
      if (rpcError) {
        // Fallback: lectura + escritura (menos seguro ante concurrencia).
        const { data } = await supabase
          .from("athletes")
          .select("raised_amount")
          .eq("id", athleteId)
          .maybeSingle();
        if (data) {
          await supabase
            .from("athletes")
            .update({ raised_amount: (data.raised_amount ?? 0) + amount })
            .eq("id", athleteId);
        }
      }
    } else {
      console.log("Donación recibida (Supabase no configurado):", {
        athleteId,
        amount,
        type,
      });
    }
  }

  return NextResponse.json({ received: true });
}
