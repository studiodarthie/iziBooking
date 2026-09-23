"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Globe, Mail, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  TooManyRequests: "Trop de demandes de connexion. Réessayez dans quelques minutes.",
  AccessDenied: "Accès refusé. Contactez le support si le problème persiste.",
  EmailSignin: "Impossible d’envoyer le lien de connexion. Réessayez.",
};

const WHY = [
  "Prestataires vérifiés à la main",
  "Paiement sécurisé, en ligne ou mobile money",
  "Commissions claires, sans frais cachés",
];

function LoginError() {
  const code = useSearchParams().get("error");
  if (!code) return null;
  return (
    <p role="alert" className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
      {ERROR_MESSAGES[code] ?? "La connexion a échoué. Réessayez."}
    </p>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      {/* Panneau gauche : identité de marque (identique à /inscription) */}
      <div className="relative hidden lg:flex lg:w-[46%] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#3A1508] via-[#6E240C] to-[#8E3414] px-10 py-10 text-white">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-accent/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-[100px] pointer-events-none" />

        <Link href="/" className="relative z-10">
          <Image src="/logo-white.png" alt="iziBooking" width={1571} height={314} className="h-8 w-auto" />
        </Link>

        <div className="relative z-10 space-y-10">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-accent uppercase mb-4">
              Artistes · Prestataires · Événements
            </p>
            <blockquote className="font-heading text-2xl leading-snug italic text-white/90">
              « Seul on va vite, ensemble on va loin. »
            </blockquote>
            <p className="text-sm text-white/50 mt-2">— Proverbe africain</p>
          </div>

          <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-sm">
            <p className="font-heading font-bold text-lg mb-4">Pourquoi iziBooking ?</p>
            <ul className="space-y-3">
              {WHY.map((w) => (
                <li key={w} className="flex items-start gap-2.5 text-sm text-white/85">
                  <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative z-10 inline-flex items-center gap-2 w-fit text-xs font-semibold text-white/70 bg-white/10 border border-white/15 rounded-full px-4 py-2">
          <Lock size={14} /> Plateforme sécurisée
        </div>
      </div>

      {/* Panneau droit : formulaire */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center lg:hidden mb-6">
            <Image src="/logo.png" alt="iziBooking" width={1571} height={314} className="h-8 w-auto" />
          </div>

          <div className="text-center mb-8">
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-ink">
              Content de vous revoir
            </h1>
            <p className="text-ink/60 mt-2">
              Connectez-vous pour gérer vos réservations ou votre profil prestataire.
            </p>
          </div>

          <div className="bg-white border border-ink/10 rounded-3xl shadow-xl shadow-black/5 p-6 sm:p-8 space-y-6">
            <Suspense fallback={null}>
              <LoginError />
            </Suspense>

            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex justify-center items-center gap-3 py-3.5 px-4 border-2 border-ink/10 rounded-xl shadow-sm text-sm font-bold text-ink bg-white hover:bg-ink/5 transition-all duration-200"
            >
              <Globe className="w-5 h-5" />
              Continuer avec Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ink/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-ink/40 uppercase tracking-wider">ou</span>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const target = e.target as typeof e.target & {
                  email: { value: string };
                };
                signIn("email", { email: target.email.value, callbackUrl: "/dashboard" });
              }}
              className="space-y-3"
            >
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-ink/40" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-xl border-ink/20 pl-10 py-3.5 focus:border-primary focus:ring-primary sm:text-sm bg-sand/20"
                  placeholder="vous@exemple.com"
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-accent-600 transition-all duration-200"
              >
                <Mail className="w-4 h-4" /> Recevoir le lien de connexion
              </button>
            </form>

            <p className="text-center text-sm text-ink/60">
              Pas encore de compte ?{" "}
              <Link href="/inscription" className="text-primary font-semibold hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-ink/40 mt-6">
            <ShieldCheck size={14} /> Connexion sécurisée · Données chiffrées
          </div>
        </div>
      </div>
    </div>
  );
}
