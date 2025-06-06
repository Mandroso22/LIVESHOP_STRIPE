import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "../../services/emailService";

export async function GET() {
  try {
    // Données de test
    const testCustomerInfo = {
      firstName: "Test",
      lastName: "Client",
      email: "lavenue120@gmail.com", // Email du client pour le test
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
      message: "Email de test envoyé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de test:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'envoi de l'email de test",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
