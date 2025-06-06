import nodemailer from "nodemailer";

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  reference: string;
  amount: string;
  shippingMethod: string;
  tiktokPseudo: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendOrderConfirmationEmail(customerInfo: CustomerInfo) {
  const adminEmail = "lavenue120@gmail.com";

  const message = `
    Nouvelle commande reçue !
    
    Référence: ${customerInfo.reference}
    Montant: ${customerInfo.amount}€
    Méthode de livraison: ${customerInfo.shippingMethod}
    
    Informations client:
    -------------------
    Nom: ${customerInfo.lastName}
    Prénom: ${customerInfo.firstName}
    Email: ${customerInfo.email}
    Téléphone: ${customerInfo.phone}
    Pseudo TikTok: ${customerInfo.tiktokPseudo}
    
    Adresse de livraison:
    --------------------
    ${customerInfo.address}
    ${customerInfo.postalCode} ${customerInfo.city}
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `Nouvelle commande - ${customerInfo.reference}`,
      text: message,
    });

    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw new Error("Erreur lors de l'envoi de l'email de confirmation");
  }
}
