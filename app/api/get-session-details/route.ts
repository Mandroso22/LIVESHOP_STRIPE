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

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["metadata", "customer"],
    });

    return NextResponse.json({ session });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails de la session:",
      error
    );
    return NextResponse.json(
      { error: "Erreur lors de la récupération des détails de la session" },
      { status: 500 }
    );
  }
}
