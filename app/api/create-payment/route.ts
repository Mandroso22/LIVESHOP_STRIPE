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

    // Validation des longueurs minimales
    const validations = [
      { field: "firstName", value: firstName, minLength: 2, label: "Prénom" },
      { field: "lastName", value: lastName, minLength: 2, label: "Nom" },
      {
        field: "tiktokPseudo",
        value: tiktokPseudo,
        minLength: 3,
        label: "Pseudo TikTok",
      },
      { field: "address", value: address, minLength: 5, label: "Adresse" },
      { field: "city", value: city, minLength: 2, label: "Ville" },
    ];

    const validationErrors = validations
      .filter(
        ({ value, minLength }) => !value || value.trim().length < minLength
      )
      .map(
        ({ field, label, minLength }) =>
          `${label} doit contenir au moins ${minLength} caractères`
      );

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Validation des données échouée",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: "Validation des données échouée",
          details: ["Format d'email invalide"],
        },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error(
        "NEXT_PUBLIC_BASE_URL n'est pas définie dans les variables d'environnement"
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;

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
      return_url: successUrl,
      payment_intent_data: {
        receipt_email: email,
        description: `Commande ${reference} - L'avenue 120`,
      },
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
