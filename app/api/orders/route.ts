import { NextResponse } from "next/server";
import { stripe } from "../../lib/stripe";
import Stripe from "stripe";

export async function GET() {
  try {
    // Récupérer toutes les sessions de paiement Stripe
    const sessions = await stripe.checkout.sessions.list({
      limit: 100, // Limite à 100 commandes pour commencer
      expand: ["data.payment_intent"], // Pour avoir plus de détails sur le paiement
    });

    // Transformer les sessions en format compatible avec notre interface Order
    const orders = sessions.data.map((session) => {
      const metadata = session.metadata || {};
      return {
        id: session.id,
        reference: metadata.reference || session.client_reference_id || "N/A",
        amount: session.amount_total ? session.amount_total / 100 : 0, // Convertir les centimes en euros
        tiktokPseudo: metadata.tiktokPseudo || "N/A",
        customerName:
          `${metadata.firstName || ""} ${metadata.lastName || ""}`.trim() ||
          "N/A",
        email: session.customer_email || metadata.email || "N/A",
        phone: metadata.phone || "N/A",
        address: metadata.address || "N/A",
        city: metadata.city || "N/A",
        postalCode: metadata.postalCode || "N/A",
        shippingMethod: metadata.shippingMethod || "N/A",
        status: getOrderStatus(session),
        createdAt: new Date(session.created * 1000).toISOString(),
        paidAt:
          session.payment_status === "paid"
            ? new Date(session.created * 1000).toISOString()
            : undefined,
      };
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commandes" },
      { status: 500 }
    );
  }
}

// Fonction pour déterminer le statut de la commande
function getOrderStatus(
  session: Stripe.Checkout.Session
): "pending" | "paid" | "preparing" | "shipped" | "delivered" {
  if (session.payment_status === "paid") {
    // Ici, vous pourriez ajouter une logique pour déterminer si la commande est en préparation,
    // expédiée ou livrée en fonction d'autres métadonnées ou d'un système de suivi
    return "paid";
  }
  return "pending";
}
