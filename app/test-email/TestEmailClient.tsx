"use client";

import { useState } from "react";
import { Loader2, CheckCircle, XCircle, Copy, Check } from "lucide-react";

interface TestResult {
  success: boolean;
  message: string;
  config?: {
    hasEmailUser: boolean;
    hasEmailPassword: boolean;
    emailUser: string;
    emailPassword: string;
    environment: string;
  };
  adminPreviewUrl?: string;
  clientPreviewUrl?: string;
  error?: string;
  details?: string;
}

export default function TestEmailClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleTestEmail = async () => {
    setIsLoading(true);
    setResult(null);
    setCopiedUrl(null);

    try {
      const response = await fetch("/api/test-email");
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: "Erreur lors du test d'email",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
          <h1 className="text-2xl font-bold text-white mb-6">
            Test d&apos;envoi d&apos;email
          </h1>

          {/* Configuration Status */}
          {result?.config && (
            <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <h2 className="text-lg font-medium text-white mb-3">
                Configuration
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">EMAIL_USER:</span>
                  <span
                    className={
                      result.config.hasEmailUser
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {result.config.emailUser}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">EMAIL_PASSWORD:</span>
                  <span
                    className={
                      result.config.hasEmailPassword
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {result.config.emailPassword}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Environnement:</span>
                  <span className="text-white/70">
                    {result.config.environment}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Test Button */}
          <button
            onClick={handleTestEmail}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${
              isLoading
                ? "bg-white/10 text-white/50 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600 text-white"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Test en cours...</span>
              </div>
            ) : (
              "Tester l'envoi d'email"
            )}
          </button>

          {/* Results */}
          {result && (
            <div className="mt-6 space-y-4">
              {/* Status */}
              <div
                className={`p-4 rounded-xl border ${
                  result.success
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span
                    className={
                      result.success ? "text-green-400" : "text-red-400"
                    }
                  >
                    {result.message}
                  </span>
                </div>
                {result.error && (
                  <p className="mt-2 text-sm text-red-400">{result.error}</p>
                )}
                {result.details && (
                  <p className="mt-1 text-sm text-white/70">{result.details}</p>
                )}
              </div>

              {/* Preview URLs */}
              {(result.adminPreviewUrl || result.clientPreviewUrl) && (
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-3">
                    URLs de prévisualisation
                  </h3>
                  <div className="space-y-3">
                    {result.adminPreviewUrl && (
                      <div>
                        <label className="block text-sm text-white/70 mb-1">
                          Email Admin:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={result.adminPreviewUrl}
                            readOnly
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                          />
                          <button
                            onClick={() =>
                              handleCopyUrl(result.adminPreviewUrl!)
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              copiedUrl === result.adminPreviewUrl
                                ? "bg-green-500/20 text-green-400"
                                : "bg-white/10 hover:bg-white/20 text-white/70"
                            }`}
                            title={
                              copiedUrl === result.adminPreviewUrl
                                ? "URL copiée !"
                                : "Copier l'URL"
                            }
                          >
                            {copiedUrl === result.adminPreviewUrl ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                    {result.clientPreviewUrl && (
                      <div>
                        <label className="block text-sm text-white/70 mb-1">
                          Email Client:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={result.clientPreviewUrl}
                            readOnly
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                          />
                          <button
                            onClick={() =>
                              handleCopyUrl(result.clientPreviewUrl!)
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              copiedUrl === result.clientPreviewUrl
                                ? "bg-green-500/20 text-green-400"
                                : "bg-white/10 hover:bg-white/20 text-white/70"
                            }`}
                            title={
                              copiedUrl === result.clientPreviewUrl
                                ? "URL copiée !"
                                : "Copier l'URL"
                            }
                          >
                            {copiedUrl === result.clientPreviewUrl ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
