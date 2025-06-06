"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function ReturnClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    "loading" | "complete" | "incomplete" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setStatus("error");
      setErrorMessage(
        "Session de paiement non trouvée. Veuillez réessayer ou contacter le support."
      );
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(
          `/api/check-payment-status?session_id=${sessionId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Erreur lors de la vérification du paiement"
          );
        }

        setStatus(data.status);
      } catch (error) {
        console.error("Erreur:", error);
        setStatus("error");
        setErrorMessage(
          "Une erreur est survenue lors de la vérification de votre paiement. " +
            "Si votre paiement a été effectué, vous recevrez un email de confirmation. " +
            "En cas de doute, n'hésitez pas à nous contacter."
        );
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <p className="text-lg text-gray-600">
              Vérification de votre paiement en cours...
            </p>
          </div>
        );

      case "complete":
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              Paiement confirmé !
            </h1>
            <p className="text-center text-gray-600 max-w-md">
              Votre commande a été validée avec succès. Vous allez recevoir un
              email de confirmation avec les détails de votre commande.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              <p>Merci de votre confiance !</p>
              <p>L&apos;équipe L&apos;Avenue</p>
            </div>
          </div>
        );

      case "incomplete":
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <XCircle className="h-16 w-16 text-yellow-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              Paiement en attente
            </h1>
            <p className="text-center text-gray-600 max-w-md">
              Votre paiement est en cours de traitement. Cela peut prendre
              quelques minutes. Vous recevrez un email dès que votre paiement
              sera confirmé.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              <p>
                Si vous ne recevez pas d&apos;email dans les prochaines minutes,
              </p>
              <p>veuillez nous contacter à lavenue120@gmail.com</p>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <XCircle className="h-16 w-16 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              Une erreur est survenue
            </h1>
            <p className="text-center text-gray-600 max-w-md">{errorMessage}</p>
            <div className="mt-4 text-sm text-gray-500">
              <p>Contactez-nous à lavenue120@gmail.com</p>
              <p>en mentionnant votre session de paiement</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {renderContent()}
      </div>
    </div>
  );
}
