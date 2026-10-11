import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Images } from "lucide-react";
import { PosterCampaignList } from "@/components/dashboard/PosterCampaignList";
import { PosterCampaignForm } from "@/components/dashboard/PosterCampaignForm";
import { isPremium } from "@/lib/plan";

export default async function PostersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      providerProfile: { select: { plan: true, planExpiresAt: true } },
      posterCampaigns: {
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { leads: true } } },
      },
    },
  });
  if (!user) redirect("/login");

  const premium = user.providerProfile ? isPremium(user.providerProfile) : false;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Images className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-ink">Affiches « J'y serai »</h1>
        </div>
        <p className="mt-2 text-ink/60 max-w-2xl">
          Créez une affiche personnalisable pour votre événement, partagez le lien : chaque
          invité y ajoute sa photo et génère sa propre affiche à partager sur WhatsApp, Facebook
          ou Instagram. Vous récupérez aussi ses coordonnées — une vraie liste de contacts
          intéressés par votre événement, pas seulement des partages.
        </p>
        {!premium && (
          <p className="mt-2 text-xs text-ink/50">
            Les affiches générées portent un petit filigrane iziBooking.{" "}
            <a href="/dashboard/settings/premium" className="text-primary font-semibold hover:underline">
              Passez Premium
            </a>{" "}
            pour le retirer.
          </p>
        )}
      </div>

      <PosterCampaignForm />

      <PosterCampaignList campaigns={user.posterCampaigns} />
    </div>
  );
}
