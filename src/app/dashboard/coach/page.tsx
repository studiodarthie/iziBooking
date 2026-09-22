import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { isPremium } from "@/lib/plan";
import { isAiConfigured } from "@/lib/ai";
import { CoachChat } from "@/components/dashboard/CoachChat";

export default async function CoachPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { providerProfile: true },
  });

  if (!user || user.role !== "PROVIDER" || !user.providerProfile) {
    redirect("/dashboard");
  }

  const premium = isPremium(user.providerProfile);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="bg-accent-2/10 p-2 rounded-lg text-accent-2-700">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-ink">Coach IA</h1>
        </div>
        <p className="mt-2 text-ink/60">
          Un assistant pour vous aider sur vos prix, vos réponses aux organisateurs et la gestion de votre activité sur iziBooking.
        </p>
      </div>

      {isAiConfigured() ? (
        <CoachChat
          premium={premium}
          quotaHint={premium ? "Accès illimité — avantage Premium" : "3 questions gratuites par mois — Premium pour un accès illimité"}
        />
      ) : (
        <div className="bg-white border border-ink/10 rounded-2xl p-6 text-sm text-ink/50">
          Le Coach IA arrive bientôt.
        </div>
      )}
    </div>
  );
}
