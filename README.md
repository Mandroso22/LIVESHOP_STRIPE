EN/FR(will follow)

# L'Avenue 120 - TikTok Live Payment Platform

A modern and secure web application for managing payments during L'Avenue 120's TikTok live streams, specializing in luxury perfumes.

## 🚀 Features

- 💳 Complete Stripe integration for secure payments
- 📱 Modern and responsive user interface
- 🔄 3-step payment process
- 🚚 Flexible shipping options (Chronopost Express and Standard)
- 📧 Automatic email notifications
- 🔒 Enhanced security with HTTPS and data validation
- 🎨 Modern design with smooth animations
- 📊 Real-time order tracking

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Payment**: Stripe (v18.2.1)
- **UI Components**:
  - @stripe/react-stripe-js
  - @stripe/stripe-js
  - lucide-react (icons)
- **Fonts**: Geist (Sans & Mono)

## 📋 Prerequisites

- Node.js (recommended version: 18.x or higher)
- npm or yarn
- Stripe account with API keys
- Domain with valid SSL certificate

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/Mandroso22/lavenuelive.git
cd lavenuelive
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Configure environment variables:
   Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
lavenuelive/
├── app/
│   ├── actions/         # Server actions (Stripe, etc.)
│   ├── api/            # API routes
│   ├── components/     # React components
│   │   └── checkout/   # Payment components
│   ├── lib/           # Utilities and configurations
│   ├── return/        # Payment return page
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Main layout
│   └── page.tsx       # Home page
├── public/            # Static assets
└── ...config files
```

## 🔐 Security

- Server-side data validation
- CSRF protection
- Secure payments via Stripe
- Environment variables for sensitive keys
- HTTPS required in production

## 🚢 Deployment

The project is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy!

## 📝 Development Notes

- Project uses Next.js App Router
- Components are optimized for performance
- Code follows TypeScript best practices
- Tests to be implemented (TODO)

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is private and owned by L'Avenue 120. All rights reserved.

## 👥 Support

For any questions or support:

- Email: support@lavenue120.live
- Website: https://lavenue120.live

---

Developed with ❤️ by [@Mandroso22](https://github.com/Mandroso22) for [Makesocial.me](https://makesocial.me)



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
