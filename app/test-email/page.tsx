import TestEmailClient from "../test-email/TestEmailClient";

export default function TestEmailPage() {
  // En production, on peut rediriger vers la page d'accueil
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return <TestEmailClient />;
}
