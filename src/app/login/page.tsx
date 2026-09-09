"use client";

import { signIn } from "next-auth/react";
import { Music, Mail, Globe } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-sand flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-sand shadow-lg">
            <Music size={28} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-heading font-extrabold text-ink">
          iziBooking Premium
        </h2>
        <p className="mt-2 text-center text-sm text-ink/60">
          Connectez-vous pour gérer vos réservations ou votre profil prestataire.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-background py-8 px-4 shadow-xl shadow-ink/5 sm:rounded-2xl sm:px-10 border border-ink/5">
          <div className="space-y-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex justify-center items-center gap-3 py-4 px-4 border-2 border-ink/10 rounded-xl shadow-sm text-sm font-bold text-ink bg-background hover:bg-ink/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Globe className="w-5 h-5" />
              Continuer avec Google
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ink/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-ink/50">Ou avec un lien magique</span>
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
              className="space-y-6"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink">
                  Adresse Email
                </label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-ink/40" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-xl border-ink/20 pl-10 py-3 focus:border-primary focus:ring-primary sm:text-sm bg-sand/20"
                    placeholder="vous@exemple.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-sand bg-primary hover:bg-primary/90 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Recevoir le lien de connexion
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
