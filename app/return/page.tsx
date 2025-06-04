import { redirect } from "next/navigation";
import Link from "next/link";
import { stripe } from "../lib/stripe";

type Props = {
  searchParams: { session_id?: string };
};

export default async function Return({ searchParams }: Props) {
  const session_id = searchParams.session_id;

  if (!session_id) {
    return (
      <section className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Erreur de session
        </h1>
        <p className="text-gray-600">
          Aucun ID de session fourni. Veuillez réessayer votre paiement.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-500 hover:underline"
        >
          Retour à l&apos;accueil
        </Link>
      </section>
    );
  }

  try {
    const { status, customer_details, payment_status } =
      await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items", "payment_intent"],
      });

    if (status === "open") {
      return redirect("/");
    }

    if (status === "complete" && payment_status === "paid") {
      return (
        <section id="success" className="p-6 text-center">
          <h1 className="text-2xl font-bold text-green-500 mb-4">
            Paiement réussi !
          </h1>
          <p className="text-gray-600">
            Nous vous remercions de votre achat ! Un email de confirmation sera
            envoyé à {customer_details?.email || "vous"}. Pour toute question,
            contactez-nous à{" "}
            <a
              href="mailto:lavenue120@gmail.com"
              className="text-blue-500 hover:underline"
            >
              lavenue120@gmail.com
            </a>
          </p>
        </section>
      );
    }

    // Gestion des autres statuts
    return (
      <section className="p-6 text-center">
        <h1 className="text-2xl font-bold text-yellow-500 mb-4">
          Paiement en attente
        </h1>
        <p className="text-gray-600">
          Votre paiement est en cours de traitement. Vous recevrez un email une
          fois le paiement confirmé.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-500 hover:underline"
        >
          Retour à l&apos;accueil
        </Link>
      </section>
    );
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    return (
      <section className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Une erreur est survenue
        </h1>
        <p className="text-gray-600">
          Nous n&apos;avons pas pu vérifier le statut de votre paiement.
          Veuillez nous contacter si le problème persiste.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-500 hover:underline"
        >
          Retour à l&apos;accueil
        </Link>
      </section>
    );
  }
}
