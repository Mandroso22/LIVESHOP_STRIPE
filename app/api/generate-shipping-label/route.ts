import { NextResponse } from "next/server";
import { generateShippingLabel } from "../../services/pdfService";
import { stripe } from "../../lib/stripe";
// import PDFDocument from "pdfkit";

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

    // Récupérer les informations de la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["metadata"],
    });

    if (!session.metadata) {
      return NextResponse.json(
        { error: "Métadonnées de session manquantes" },
        { status: 400 }
      );
    }

    // Préparer les informations client
    const customerInfo = {
      firstName: session.metadata.firstName || "",
      lastName: session.metadata.lastName || "",
      email: session.metadata.email || "",
      phone: session.metadata.phone || "",
      address: session.metadata.address || "",
      city: session.metadata.city || "",
      postalCode: session.metadata.postalCode || "",
      reference: session.metadata.reference || "",
      amount: (session.amount_total
        ? session.amount_total / 100
        : 0
      ).toString(),
      shippingMethod: session.metadata.shippingMethod || "",
      tiktokPseudo: session.metadata.tiktokPseudo || "",
    };

    // Générer le PDF
    const pdfBuffer = await generateShippingLabel(customerInfo);

    // Retourner le PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="bon-livraison-${customerInfo.reference}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la génération du bon de livraison:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du bon de livraison" },
      { status: 500 }
    );
  }
}
