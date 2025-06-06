import { NextResponse } from "next/server";
import { stripe } from "../../lib/stripe";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID manquant" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Vérifier si le paiement est complet
    if (session.payment_status === "paid") {
      return NextResponse.json({ status: "complete" });
    }

    // Si le paiement n'est pas encore complété
    return NextResponse.json({ status: "incomplete" });
  } catch (error) {
    console.error("Erreur lors de la vérification du statut:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification du statut" },
      { status: 500 }
    );
  }
}
