import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Crown, CheckCircle2, Gift } from "lucide-react";
import { isPremium } from "@/lib/plan";
import { PremiumCheckoutButton } from "@/components/dashboard/PremiumCheckoutButton";
import { isTranzakConfigured } from "@/lib/tranzak";

const PREMIUM_BENEFITS = [
  "Commission ramenée à 6 % (au lieu de 12 %)",
  "Photos et services en illimité",
  "Mise en avant dans les résultats de recherche",
  "Badge Premium visible sur votre profil",
  "Statistiques de profil (vues, demandes reçues)",
  "File de vérification admin prioritaire",
];

export default async function PremiumSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      providerProfile: {
        include: { subscriptionPayments: { where: { status: "COMPLETED" }, take: 1 } }
      }
    }
  });

  if (!user || user.role !== "PROVIDER" || !user.providerProfile) {
    redirect("/dashboard");
  }

  const profile = user.providerProfile;
  const active = isPremium(profile);
  // Premium actif sans aucun paiement encore encaissé = essai gratuit d'inscription en cours.
  const isTrial = active && profile.subscriptionPayments.length === 0;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="bg-accent-2/10 p-2 rounded-lg text-accent-2-700">
            <Crown className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-ink">Abonnement Premium</h1>
        </div>
        <p className="mt-2 text-ink/60">
          Un abonnement mensuel, sans engagement — annulable à tout moment, plus de renouvellement dès l&apos;expiration.
        </p>
      </div>

      {active ? (
        <div className="space-y-6">
          <div className="bg-accent-2/10 border border-accent-2/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-accent-2-700 font-bold mb-2">
              {isTrial ? <Gift className="w-5 h-5" /> : <Crown className="w-5 h-5" />}
              {isTrial ? "Essai Premium gratuit en cours" : "Compte Premium actif"}
            </div>
            <p className="text-ink/70 text-sm">
              Valide jusqu&apos;au {profile.planExpiresAt?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              {isTrial && " — offert pour votre inscription. Passez à un forfait payant avant cette date pour garder vos avantages."}
            </p>
          </div>

          {isTrial && isTranzakConfigured() && (
            <div className="bg-white border border-ink/10 rounded-2xl p-6 space-y-4">
              <p className="text-sm font-semibold text-ink">Continuer en Premium après l&apos;essai</p>
              <PremiumCheckoutButton />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-ink/10 rounded-2xl p-6 space-y-6">
          <ul className="space-y-3">
            {PREMIUM_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm text-ink/80">
                <CheckCircle2 className="w-5 h-5 text-accent-2-600 shrink-0 mt-0.5" />
                {benefit}
              </li>
            ))}
          </ul>

          {isTranzakConfigured() ? (
            <PremiumCheckoutButton />
          ) : (
            <div className="text-sm text-ink/50 bg-sand/50 rounded-xl p-4">
              Le paiement en ligne arrive bientôt.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
