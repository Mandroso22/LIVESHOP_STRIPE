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

const getClientEmailTemplate = (customerInfo: CustomerInfo) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; }
    .logo { font-size: 24px; font-weight: bold; color: #000; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 8px; }
    .order-details { margin: 20px 0; }
    .order-info { background: #fff; padding: 15px; border-radius: 4px; margin: 10px 0; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    .highlight { color: #000; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">L'Avenue 120</div>
    </div>
    
    <div class="content">
      <h2>Merci pour votre commande !</h2>
      <p>Cher(e) ${customerInfo.firstName},</p>
      <p>Nous avons bien reçu votre commande et nous vous en remercions. Voici un récapitulatif de votre commande :</p>
      
      <div class="order-details">
        <div class="order-info">
          <p><span class="highlight">Référence de commande :</span> ${
            customerInfo.reference
          }</p>
          <p><span class="highlight">Montant total :</span> ${
            customerInfo.amount
          }€</p>
          <p><span class="highlight">Mode de livraison :</span> ${
            customerInfo.shippingMethod === "chronopost"
              ? "Chronopost Express"
              : "Livraison Standard"
          }</p>
        </div>
        
        <div class="order-info">
          <p><span class="highlight">Adresse de livraison :</span></p>
          <p>${customerInfo.firstName} ${customerInfo.lastName}</p>
          <p>${customerInfo.address}</p>
          <p>${customerInfo.postalCode} ${customerInfo.city}</p>
        </div>
      </div>

      <p>Nous vous tiendrons informé(e) de l'expédition de votre commande par email.</p>
      
      <p>Si vous avez des questions, n'hésitez pas à nous contacter :</p>
      <p>📧 lavenue120@gmail.com</p>
      <p>📱 TikTok : @lavenue120</p>
    </div>

    <div class="footer">
      <p>L'Avenue 120 - Parfums de Luxe</p>
      <p>© ${new Date().getFullYear()} Tous droits réservés</p>
    </div>
  </div>
</body>
</html>
`;

// Template texte pour l'email admin
const getAdminEmailTemplate = (customerInfo: CustomerInfo) => `
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

export async function sendOrderConfirmationEmail(customerInfo: CustomerInfo) {
  const adminEmail = "lavenue120@gmail.com";

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: "lavenue120@gmail.com",
      to: adminEmail,
      subject: `Nouvelle commande - ${customerInfo.reference}`,
      text: getAdminEmailTemplate(customerInfo),
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: "lavenue120@gmail.com",
      to: customerInfo.email,
      subject: `Confirmation de commande - L'Avenue 120`,
      html: getClientEmailTemplate(customerInfo),
    });
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw new Error("Erreur lors de l'envoi de l'email de confirmation");
  }
}
