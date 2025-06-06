"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { Check, Package, Truck, Clock, MapPin } from "lucide-react";

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

if (!STRIPE_PUBLIC_KEY) {
  console.error(
    "ERREUR: NEXT_PUBLIC_STRIPE_PUBLIC_KEY n'est pas définie dans les variables d'environnement"
  );
}

const stripePromise = STRIPE_PUBLIC_KEY ? loadStripe(STRIPE_PUBLIC_KEY) : null;

interface FormData {
  reference: string;
  amount: string;
  tiktokPseudo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  shippingMethod: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    reference: "",
    amount: "",
    tiktokPseudo: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    shippingMethod: "chronopost",
  });

  const steps = [
    { id: 1, title: "Commande", subtitle: "Informations de base" },
    { id: 2, title: "Livraison", subtitle: "Adresse de livraison" },
    { id: 3, title: "Confirmation", subtitle: "Finaliser la commande" },
  ];

  const shippingOptions = [
    {
      id: "chronopost",
      name: "Chronopost Express",
      price: "9.90",
      description: "Livraison en 24h",
      icon: <Truck className="w-5 h-5" />,
    },
    {
      id: "standard",
      name: "Livraison Standard",
      price: "4.90",
      description: "2-3 jours ouvrés",
      icon: <Package className="w-5 h-5" />,
    },
  ];

  useEffect(() => {
    if (!STRIPE_PUBLIC_KEY) {
      setStripeError(
        "La configuration de paiement n'est pas disponible. Veuillez contacter le support."
      );
    }
  }, []);

  const validateStep = () => {
    const newErrors: FormErrors = {};

    if (currentStep === 1) {
      if (!formData.reference.trim()) {
        newErrors.reference = "Veuillez remplir le numéro de référence";
      } else if (!/^[A-Za-z0-9-]+$/.test(formData.reference)) {
        newErrors.reference =
          "La référence ne doit contenir que des lettres, chiffres et tirets";
      }

      if (!formData.amount.trim()) {
        newErrors.amount = "Veuillez indiquer le montant";
      } else if (parseFloat(formData.amount) <= 0) {
        newErrors.amount = "Le montant doit être supérieur à 0";
      } else if (parseFloat(formData.amount) > 1000) {
        newErrors.amount = "Le montant maximum est de 1000€";
      }

      if (!formData.tiktokPseudo.trim()) {
        newErrors.tiktokPseudo = "Veuillez indiquer votre pseudo TikTok";
      } else if (!formData.tiktokPseudo.startsWith("@")) {
        newErrors.tiktokPseudo = "Le pseudo TikTok doit commencer par @";
      }
    }

    if (currentStep === 2) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "Veuillez remplir votre prénom";
      } else if (formData.firstName.length < 2) {
        newErrors.firstName = "Le prénom doit contenir au moins 2 caractères";
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Veuillez remplir votre nom";
      } else if (formData.lastName.length < 2) {
        newErrors.lastName = "Le nom doit contenir au moins 2 caractères";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Veuillez remplir votre email";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Veuillez entrer un email valide";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Veuillez remplir votre numéro de téléphone";
      } else if (
        !/^(\+33|0)[1-9](\d{2}){4}$/.test(formData.phone.replace(/\s/g, ""))
      ) {
        newErrors.phone =
          "Veuillez entrer un numéro de téléphone français valide";
      }

      if (!formData.address.trim()) {
        newErrors.address = "Veuillez remplir votre adresse";
      } else if (formData.address.length < 5) {
        newErrors.address = "L'adresse doit contenir au moins 5 caractères";
      }

      if (!formData.city.trim()) {
        newErrors.city = "Veuillez remplir votre ville";
      } else if (formData.city.length < 2) {
        newErrors.city = "La ville doit contenir au moins 2 caractères";
      }

      if (!formData.postalCode.trim()) {
        newErrors.postalCode = "Veuillez remplir votre code postal";
      } else if (!/^[0-9]{5}$/.test(formData.postalCode)) {
        newErrors.postalCode = "Le code postal doit contenir 5 chiffres";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const getProgressWidth = () => {
    if (currentStep === 1) return "0%";
    if (currentStep === 3) return "90%";
    return `${((currentStep - 1) / (steps.length - 1)) * 100}%`;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    let cleanedValue = value;

    switch (field) {
      case "phone":
        // Ne garde que les chiffres et le + pour le téléphone
        cleanedValue = value.replace(/[^\d+]/g, "");
        break;
      case "postalCode":
        // Ne garde que les chiffres pour le code postal
        cleanedValue = value.replace(/\D/g, "").slice(0, 5);
        break;
      case "email":
        // Convertit en minuscules pour l'email
        cleanedValue = value.toLowerCase();
        break;
      case "tiktokPseudo":
        // Assure que le pseudo TikTok commence par @
        if (!value.startsWith("@") && value.length > 0) {
          cleanedValue = "@" + value;
        }
        break;
    }

    setFormData((prev) => ({ ...prev, [field]: cleanedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePayment = async () => {
    try {
      const shippingPrice =
        shippingOptions.find((opt) => opt.id === formData.shippingMethod)
          ?.price || "0";

      const totalAmount = (
        parseFloat(formData.amount || "0") + parseFloat(shippingPrice)
      ).toString();

      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
          reference: formData.reference,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          shippingMethod: formData.shippingMethod,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          tiktokPseudo: formData.tiktokPseudo,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la session de paiement");
      }

      const { clientSecret: secret } = await response.json();
      setClientSecret(secret);
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
      alert("Une erreur est survenue lors du paiement. Veuillez réessayer.");
    }
  };

  if (stripeError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 animate-[shimmer_4s_linear_infinite] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 py-6 text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-2">
              Erreur de Configuration
            </h2>
            <p className="text-white/80">{stripeError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return null;
  }

  if (clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="max-w-md mx-auto px-4 py-10">
          {/* Garder le header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-stone-100 uppercase cursor-pointer tracking-wider mb-2">
              L&apos;avenue 120
            </h1>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-amber-300 font-medium">
                LIVE TikTok
              </span>
            </div>
          </div>

          {/* Afficher le composant Stripe Embedded Checkout */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            {clientSecret ? (
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{
                  clientSecret,
                  onComplete: () => {
                    window.location.href = "/return";
                  },
                }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            ) : (
              <div className="text-center text-white/80">
                Chargement du formulaire de paiement...
              </div>
            )}
          </div>

          {/* Garder le footer */}
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

  // Sinon, afficher le formulaire normal avec les 3 étapes
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 py-4 sm:py-6 md:py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-100 uppercase cursor-pointer tracking-wider mb-2">
            L&apos;avenue 120
          </h1>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-amber-300 font-medium">
              LIVE TikTok
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-10">
          <div className="flex justify-between items-center">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center relative z-10"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-stone-800 to-stone-900 shadow-lg">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ${
                      currentStep > step.id
                        ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/20 scale-110"
                        : currentStep === step.id
                        ? "bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 text-white shadow-lg shadow-pink-500/20 scale-110 animate-pulse"
                        : "bg-gradient-to-br from-stone-700 to-stone-800 text-white/60"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <div
                    className={`step-title transition-colors duration-300 ${
                      currentStep >= step.id ? "text-white" : "text-white/40"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div
                    className={`step-subtitle transition-colors duration-300 ${
                      currentStep >= step.id ? "text-white/70" : "text-white/30"
                    }`}
                  >
                    {step.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Barre de progression */}
          <div className="absolute top-5 left-4 right-6 h-1 bg-gradient-to-r from-stone-800 to-stone-900 rounded-full -z-0 shadow-inner"></div>
          <div
            className="absolute top-5 left-4 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full transition-all duration-500 -z-0 shadow-lg shadow-pink-500/20"
            style={{ width: getProgressWidth() }}
          ></div>
        </div>

        {/* Step Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          {/* Step 1: Order Info */}
          {currentStep === 1 && (
            <div className="space-y-10 animate-in slide-in-from-right-5 duration-300">
              <div>
                <h2 className="title-medium text-white mb-2">
                  Informations de commande
                </h2>
                <p className="body-regular text-white/70">
                  Remplissez les informations de base pour votre commande
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="reference"
                    className="body-small block text-white/90 mb-2"
                  >
                    Numéro de référence
                  </label>
                  <input
                    type="text"
                    id="reference"
                    value={formData.reference}
                    onChange={(e) =>
                      handleInputChange("reference", e.target.value)
                    }
                    placeholder="Ex: REF-123"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                  />
                  {errors.reference && (
                    <p className="body-small text-red-400 mt-1">
                      {errors.reference}
                    </p>
                  )}
                </div>

                <div>
                  <label className="body-small block text-white/90 mb-2">
                    Montant (€)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-medium">
                      €
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (parseFloat(value) >= 0) {
                          handleInputChange("amount", value);
                        }
                      }}
                      required
                      placeholder="0.00"
                      className={`w-full pl-8 pr-4 py-3 bg-white/5 border ${
                        errors.amount ? "border-red-400/50" : "border-white/10"
                      } rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 backdrop-blur-sm transition-all`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="body-small text-red-400 mt-1">
                      {errors.amount}
                    </p>
                  )}
                  <div className="mt-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[20, 40, 60].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() =>
                            handleInputChange("amount", amount.toString())
                          }
                          className={`px-4 py-3 text-base font-medium rounded-xl transition-all ${
                            parseFloat(formData.amount) === amount
                              ? "bg-pink-500/20 border-2 border-pink-500/50 text-white"
                              : "bg-stone-700/50 hover:bg-stone-600/50 text-white border border-stone-600/50"
                          }`}
                        >
                          {amount}€
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="body-small block text-white/90 mb-2">
                    Pseudo TikTok
                  </label>
                  <input
                    type="text"
                    value={formData.tiktokPseudo}
                    onChange={(e) =>
                      handleInputChange("tiktokPseudo", e.target.value)
                    }
                    required
                    placeholder="@votre_pseudo"
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.tiktokPseudo
                        ? "border-red-400/50"
                        : "border-white/10"
                    } rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 backdrop-blur-sm transition-all`}
                  />
                  {errors.tiktokPseudo && (
                    <p className="body-small text-red-400 mt-1">
                      {errors.tiktokPseudo}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-pink-500/20"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Shipping Info */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
              <div>
                <h2 className="title-medium text-white mb-2">
                  Informations de livraison
                </h2>
                <p className="body-regular text-white/70">
                  Où souhaitez-vous recevoir votre commande ?
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="body-small block text-white/90 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      required
                      placeholder="John"
                      className={`w-full px-4 py-3 bg-white/5 border ${
                        errors.firstName
                          ? "border-red-400/50"
                          : "border-white/10"
                      } rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 backdrop-blur-sm transition-all`}
                    />
                    {errors.firstName && (
                      <p className="body-small text-red-400 mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="body-small block text-white/90 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      required
                      placeholder="Doe"
                      className={`w-full px-4 py-3 bg-white/5 border ${
                        errors.lastName
                          ? "border-red-400/50"
                          : "border-white/10"
                      } rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 backdrop-blur-sm transition-all`}
                    />
                    {errors.lastName && (
                      <p className="body-small text-red-400 mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="body-small block text-white/90 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    placeholder="elon@musk.com"
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.email ? "border-red-400/50" : "border-white/10"
                    } rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 backdrop-blur-sm transition-all`}
                  />
                  {errors.email && (
                    <p className="body-small text-red-400 mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="body-small block text-white/90 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    placeholder="+33 6 12 34 56 78"
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.phone ? "border-red-400/50" : "border-white/10"
                    } rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 backdrop-blur-sm transition-all`}
                  />
                  {errors.phone && (
                    <p className="body-small text-red-400 mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="body-small block text-white/90 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    required
                    placeholder="123 Rue de la Paix"
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.address ? "border-red-400/50" : "border-white/10"
                    } rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 backdrop-blur-sm transition-all`}
                  />
                  {errors.address && (
                    <p className="body-small text-red-400 mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="body-small block text-white/90 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      required
                      placeholder="Paris"
                      className={`w-full px-4 py-3 bg-white/5 border ${
                        errors.city ? "border-red-400/50" : "border-white/10"
                      } rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 backdrop-blur-sm transition-all`}
                    />
                    {errors.city && (
                      <p className="body-small text-red-400 mt-1">
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="body-small block text-white/90 mb-2">
                      Code postal
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) =>
                        handleInputChange("postalCode", e.target.value)
                      }
                      required
                      placeholder="75001"
                      className={`w-full px-4 py-3 bg-white/5 border ${
                        errors.postalCode
                          ? "border-red-400/50"
                          : "border-white/10"
                      } rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 backdrop-blur-sm transition-all`}
                    />
                    {errors.postalCode && (
                      <p className="body-small text-red-400 mt-1">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="body-small block text-white/90 mb-3">
                    Mode de livraison
                  </label>
                  <div className="space-y-3">
                    {shippingOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() =>
                          handleInputChange("shippingMethod", option.id)
                        }
                        className={`p-4 rounded-xl cursor-pointer transition-all backdrop-blur-sm ${
                          formData.shippingMethod === option.id
                            ? "bg-pink-500/20 border-2 border-pink-500/50"
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                formData.shippingMethod === option.id
                                  ? "bg-pink-500/30"
                                  : "bg-white/10"
                              }`}
                            >
                              {option.icon}
                            </div>
                            <div>
                              <div className="font-semibold text-white">
                                {option.name}
                              </div>
                              <div className="text-sm text-white/70">
                                {option.description}
                              </div>
                            </div>
                          </div>
                          <div className="text-cyan-400 font-bold">
                            €{option.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-pink-500/20"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
              <div>
                <h2 className="title-medium text-white mb-2">
                  Confirmation de commande
                </h2>
                <p className="body-regular text-white/70">
                  Vérifiez vos informations avant de finaliser
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-pink-400" />
                  Résumé de la commande
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Référence:</span>
                    <span className="text-white font-medium">
                      {formData.reference}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Pseudo TikTok:</span>
                    <span className="text-white font-medium">
                      {formData.tiktokPseudo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Montant:</span>
                    <span className="text-white font-medium">
                      €{formData.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Livraison:</span>
                    <span className="text-white font-medium">
                      €
                      {
                        shippingOptions.find(
                          (opt) => opt.id === formData.shippingMethod
                        )?.price
                      }
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span className="text-white">Total:</span>
                      <span className="text-cyan-400">
                        €
                        {(
                          parseFloat(formData.amount || "0") +
                          parseFloat(
                            shippingOptions.find(
                              (opt) => opt.id === formData.shippingMethod
                            )?.price || "0"
                          )
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  Adresse de livraison
                </h3>

                <div className="text-sm text-white/90 leading-relaxed">
                  <div className="font-medium">
                    {formData.firstName} {formData.lastName}
                  </div>
                  <div>{formData.address}</div>
                  <div>
                    {formData.postalCode} {formData.city}
                  </div>
                  <div className="mt-2 text-white/70">{formData.email}</div>
                  <div className="text-white/70">{formData.phone}</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-pink-400" />
                  <span className="font-semibold text-white">
                    Livraison Chronopost Express
                  </span>
                </div>
                <p className="text-sm text-white/80">
                  Votre commande sera expédiée sous 24h et livrée en 1 jour
                  ouvré. Vous recevrez un email de confirmation avec le numéro
                  de suivi.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handlePayment}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-pink-500/20"
                >
                  Payer maintenant
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
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
