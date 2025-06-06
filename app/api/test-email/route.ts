import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "../../services/emailService";

export async function GET() {
  try {
    // Données de test avec une adresse email différente
    const testCustomerInfo = {
      firstName: "Test",
      lastName: "Client",
      email: "test@example.com", // Email de test différent de l'admin
      phone: "0612345678",
      address: "123 Rue de Test",
      city: "Paris",
      postalCode: "75001",
      reference: "TEST-123",
      amount: "99.99",
      shippingMethod: "chronopost",
      tiktokPseudo: "@testuser",
    };

    await sendOrderConfirmationEmail(testCustomerInfo);

    return NextResponse.json({
      success: true,
      message: "Emails de test envoyés avec succès (admin et client)",
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi des emails de test:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'envoi des emails de test",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
