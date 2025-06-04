# L'Avenue 120 - Plateforme de Paiement TikTok Live

Une application web moderne et sécurisée pour gérer les paiements lors des lives TikTok de L'Avenue 120, spécialisée dans la vente de parfums de luxe.

## 🚀 Fonctionnalités

- 💳 Intégration complète avec Stripe pour les paiements sécurisés
- 📱 Interface utilisateur moderne et responsive
- 🔄 Processus de paiement en 3 étapes
- 🚚 Options de livraison flexibles (Chronopost Express et Standard)
- 📧 Notifications par email automatiques
- 🔒 Sécurité renforcée avec HTTPS et validation des données
- 🎨 Design moderne avec animations fluides
- 📊 Suivi des commandes en temps réel

## 🛠️ Technologies Utilisées

- **Framework**: Next.js 15.3.3
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Paiement**: Stripe (v18.2.1)
- **UI Components**:
  - @stripe/react-stripe-js
  - @stripe/stripe-js
  - lucide-react (icônes)
- **Fonts**: Geist (Sans & Mono)

## 📋 Prérequis

- Node.js (version recommandée : 18.x ou supérieure)
- npm ou yarn
- Compte Stripe avec clés API
- Domaine avec certificat SSL valide

## 🔧 Installation

1. Cloner le repository :

```bash
git clone https://github.com/Mandroso22/lavenuelive.git
cd lavenuelive
```

2. Installer les dépendances :

```bash
npm install
# ou
yarn install
```

3. Configurer les variables d'environnement :
   Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=votre_clé_publique_stripe
STRIPE_SECRET_KEY=votre_clé_secrète_stripe
```

4. Lancer le serveur de développement :

```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000)

## 🏗️ Structure du Projet

```
lavenuelive/
├── app/
│   ├── actions/         # Actions serveur (Stripe, etc.)
│   ├── api/            # Routes API
│   ├── components/     # Composants React
│   │   └── checkout/   # Composants de paiement
│   ├── lib/           # Utilitaires et configurations
│   ├── return/        # Page de retour après paiement
│   ├── globals.css    # Styles globaux
│   ├── layout.tsx     # Layout principal
│   └── page.tsx       # Page d'accueil
├── public/            # Assets statiques
└── ...config files
```

## 🔐 Sécurité

- Validation des données côté serveur
- Protection CSRF
- Paiements sécurisés via Stripe
- Variables d'environnement pour les clés sensibles
- HTTPS obligatoire en production

## 🚢 Déploiement

Le projet est optimisé pour un déploiement sur Vercel :

1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement dans le dashboard Vercel
3. Déployez !

## 📝 Notes de Développement

- Le projet utilise l'App Router de Next.js
- Les composants sont optimisés pour les performances
- Le code suit les meilleures pratiques TypeScript
- Les tests sont à implémenter (TODO)

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est privé et propriété de L'Avenue 120. Tous droits réservés.

## 👥 Support

Pour toute question ou support :

- Email : support@lavenue120.live
- Site : https://lavenue120.live

---

Développé avec ❤️ par [Makesocial.me](https://makesocial.me)
