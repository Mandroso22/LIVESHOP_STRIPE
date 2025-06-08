import { NextResponse } from "next/server";
import { stripe } from "../../lib/stripe";

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
    const {
      amount,
      reference,
      email,
      firstName,
      lastName,
      shippingMethod,
      phone,
      address,
      city,
      postalCode,
      tiktokPseudo,
    } = body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Commande ${reference}`,
              description: "L'avenue 120 - Commande TikTok",
            },
            unit_amount: Math.round(parseFloat(amount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      client_reference_id: reference,
      metadata: {
        firstName,
        lastName,
        reference,
        shippingMethod,
        phone,
        address,
        city,
        postalCode,
        tiktokPseudo,
        email,
      },
      ui_mode: "embedded",
      return_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error(
      "Erreur détaillée lors de la création de la session Stripe:",
      {
        error,
        message: error instanceof Error ? error.message : "Erreur inconnue",
        stack: error instanceof Error ? error.stack : undefined,
        body: body, // Log the request body for debugging
      }
    );

    // Renvoyer plus de détails sur l'erreur
    return NextResponse.json(
      {
        error: "Erreur lors de la création du paiement",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
