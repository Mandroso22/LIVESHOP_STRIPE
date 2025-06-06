import { NextResponse } from "next/server";
import { stripe } from "../../lib/stripe";
import { sendOrderConfirmationEmail } from "../../services/emailService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
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

    // Création de la session Stripe
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
            unit_amount: Math.round(parseFloat(amount) * 100), // Stripe utilise les centimes
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
      },
      // Configuration spécifique pour Embedded Checkout
      ui_mode: "embedded",
      return_url: `${request.headers.get(
        "origin"
      )}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    // Envoi de l'email de confirmation à l'admin
    try {
      await sendOrderConfirmationEmail({
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        postalCode,
        reference,
        amount,
        shippingMethod,
        tiktokPseudo,
      });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
      // On continue même si l'email échoue, pour ne pas bloquer la commande
    }

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Erreur lors de la création de la session Stripe:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 }
    );
  }
}
