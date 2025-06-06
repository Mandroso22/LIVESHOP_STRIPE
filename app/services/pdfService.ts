import PDFDocument from "pdfkit";
import { CustomerInfo } from "./emailService";

export async function generateShippingLabel(
  customerInfo: CustomerInfo
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A5",
        margin: 50,
        info: {
          Title: `Bon de livraison - ${customerInfo.reference}`,
          Author: "L'Avenue 120",
        },
      });

      // Collecter les chunks du PDF
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // En-tête
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("L'Avenue 120", { align: "center" })
        .moveDown();

      // Logo ou titre
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("Bon de Livraison", { align: "center" })
        .moveDown();

      // Informations de la commande
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(`Référence: ${customerInfo.reference}`)
        .font("Helvetica")
        .text(`Date: ${new Date().toLocaleDateString("fr-FR")}`)
        .moveDown();

      // Adresse de livraison
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Adresse de livraison:")
        .font("Helvetica")
        .text(`${customerInfo.firstName} ${customerInfo.lastName}`)
        .text(customerInfo.address)
        .text(`${customerInfo.postalCode} ${customerInfo.city}`)
        .moveDown();

      // Informations client
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Informations client:")
        .font("Helvetica")
        .text(`Email: ${customerInfo.email}`)
        .text(`Téléphone: ${customerInfo.phone}`)
        .text(`Pseudo TikTok: ${customerInfo.tiktokPseudo}`)
        .moveDown();

      // Détails de la livraison
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Détails de la livraison:")
        .font("Helvetica")
        .text(
          `Mode de livraison: ${
            customerInfo.shippingMethod === "chronopost"
              ? "Chronopost Express"
              : "Livraison Standard"
          }`
        )
        .moveDown();

      // Zone de signature
      doc
        .moveDown(2)
        .fontSize(10)
        .text("Signature du livreur:", { continued: true })
        .moveDown(3)
        .text("_________________________", { align: "center" })
        .moveDown()
        .text("Signature du client:", { continued: true })
        .moveDown(3)
        .text("_________________________", { align: "center" });

      // Pied de page
      doc
        .fontSize(8)
        .text("L'Avenue 120 - Bon de livraison généré automatiquement", {
          align: "center",
        });

      // Finaliser le PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
