"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, Package, Mail } from "lucide-react";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "complete" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [orderDetails, setOrderDetails] = useState<{
    reference: string;
    amount: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setStatus("error");
      setErrorMessage(
        "Session de paiement non trouvée. Veuillez vérifier votre email pour la confirmation de commande ou contacter le support."
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

        if (data.status === "complete") {
          setStatus("complete");
          // Récupérer les détails de la commande depuis les métadonnées de la session
          const sessionResponse = await fetch(
            `/api/get-session-details?session_id=${sessionId}`
          );
          const sessionData = await sessionResponse.json();

          if (sessionResponse.ok && sessionData.session) {
            setOrderDetails({
              reference: sessionData.session.metadata?.reference || "N/A",
              amount: sessionData.session.amount_total
                ? (sessionData.session.amount_total / 100).toFixed(2)
                : "N/A",
              email:
                sessionData.session.customer_email ||
                sessionData.session.metadata?.email ||
                "N/A",
            });
          }
        } else {
          setStatus("error");
          setErrorMessage(
            "Le paiement n'a pas pu être confirmé. Veuillez vérifier votre email ou contacter le support."
          );
        }
      } catch (error) {
        console.error("Erreur:", error);
        setStatus("error");
        setErrorMessage(
          "Une erreur est survenue lors de la vérification de votre paiement. " +
            "Si votre paiement a été effectué, vous recevrez un email de confirmation. " +
            "En cas de doute, n'hésitez pas à nous contacter à lavenue120@gmail.com"
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
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Commande confirmée !
              </h1>
              <p className="text-gray-600 max-w-md">
                Votre commande a été validée avec succès. Un email de
                confirmation a été envoyé à {orderDetails?.email}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-md space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Package className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Référence de commande</p>
                  <p className="text-sm">{orderDetails?.reference}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Email de confirmation</p>
                  <p className="text-sm">{orderDetails?.email}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total payé</span>
                  <span className="text-xl font-bold text-green-600">
                    €{orderDetails?.amount}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 space-y-2">
              <p>Merci de votre confiance !</p>
              <p>L&apos;équipe L&apos;Avenue</p>
              <p className="mt-4">
                Pour toute question, contactez-nous à{" "}
                <a
                  href="mailto:lavenue120@gmail.com"
                  className="text-blue-500 hover:text-blue-600"
                >
                  lavenue120@gmail.com
                </a>
              </p>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-red-100 rounded-full p-3">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
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
