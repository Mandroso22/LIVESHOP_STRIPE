"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ReturnPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setMessage("Session ID manquant");
      return;
    }

    // Vérifier le statut de la session
    fetch(`/api/check-payment-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "complete") {
          setStatus("success");
          setMessage("Paiement réussi !");
        } else {
          setStatus("error");
          setMessage("Le paiement n'a pas pu être confirmé");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Erreur lors de la vérification du paiement");
      });
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-400 to-stone-800 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-100 uppercase tracking-wider mb-2">
            L&apos;avenue 120
          </h1>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
          {status === "loading" && (
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4" />
              <div className="h-4 bg-white/10 rounded w-3/4 mx-auto mb-2" />
              <div className="h-4 bg-white/10 rounded w-1/2 mx-auto" />
            </div>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Paiement confirmé !
              </h2>
              <p className="text-white/70 mb-6">
                Merci pour votre commande. Vous recevrez un email de
                confirmation dans quelques instants.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all"
              >
                Retour à l&apos;accueil
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Oups, quelque chose s&apos;est mal passé
              </h2>
              <p className="text-white/70 mb-6">{message}</p>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all"
              >
                Réessayer
              </Link>
            </>
          )}
        </div>

        <div className="text-center mt-8 text-white/50 text-xs">
          <p>🔒 Paiement sécurisé • Livraison rapide • Support client 24/7</p>
          <a
            href="https://makesocial.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-white/30 hover:text-white/50 transition-colors"
          >
            Powered by Makesocial.me
          </a>
        </div>
      </div>
    </div>
  );
}
