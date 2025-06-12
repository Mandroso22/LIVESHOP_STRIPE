import Checkout from "../components/checkout/Checkout";
import { Banner } from "../components/Banner";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Banner
        messages={[
          "⚡️ Expédition express",
          "🎁 Offre spéciale : 3 CP à 20€",
          "🚚 Livraison Chronopost / Mondial Relay",
          "💫 Paiement 100% sécurisé",
          "⭐️ Satisfaction garantie ou remboursé",
          "📱 Suivez-nous sur TikTok pour plus de lives exclusifs",
        ]}
        speed={35}
      />
      <Checkout />
    </div>
  );
}
