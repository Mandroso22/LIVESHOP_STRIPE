"use server";

import { headers } from "next/headers";

import { stripe } from "../lib/stripe";

interface PaymentData {
  amount: string;
  reference: string;
  email: string;
  firstName: string;
  lastName: string;
  shippingMethod: string;
  shippingPrice: string;
}

export async function fetchClientSecret(data: PaymentData) {
  const origin = (await headers()).get("origin");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Commande ${data.reference}`,
            description: `Livraison: ${data.shippingMethod}`,
          },
          unit_amount: Math.round(parseFloat(data.amount) * 100), // Stripe expects amounts in cents
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Frais de livraison",
            description: data.shippingMethod,
          },
          unit_amount: Math.round(parseFloat(data.shippingPrice) * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: data.email,
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  return session.client_secret;
}
