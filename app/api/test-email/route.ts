import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "../../services/emailService";

export async function GET() {
  try {
    // Vérification des variables d'environnement
    const emailConfig = {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPassword: !!process.env.EMAIL_PASSWORD,
      emailUser: process.env.EMAIL_USER ? "✓ défini" : "✗ manquant",
      emailPassword: process.env.EMAIL_PASSWORD ? "✓ défini" : "✗ manquant",
    };

    // Données de test
    const testCustomerInfo = {
      firstName: "Test",
      lastName: "Client",
      email: "test@example.com",
      phone: "0612345678",
      address: "123 Rue de Test",
      city: "Paris",
      postalCode: "75001",
      reference: "TEST-123",
      amount: "99.99",
      shippingMethod: "chronopost",
      tiktokPseudo: "@testuser",
    };

    // Si les variables d'environnement ne sont pas configurées, retourner une erreur explicite
    if (!emailConfig.hasEmailUser || !emailConfig.hasEmailPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Configuration email incomplète",
          details: emailConfig,
          environment: process.env.NODE_ENV,
        },
        { status: 500 }
      );
    }

    await sendOrderConfirmationEmail(testCustomerInfo);

    return NextResponse.json({
      success: true,
      message: "Emails de test envoyés avec succès (admin et client)",
      config: {
        ...emailConfig,
        environment: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi des emails de test:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'envoi des emails de test",
        details: error instanceof Error ? error.message : "Erreur inconnue",
        environment: process.env.NODE_ENV,
      },
      { status: 500 }
    );
  }
}
