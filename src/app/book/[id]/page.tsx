import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { BookingForm } from "@/components/public/BookingForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingPage(props: Props) {
  const params = await props.params;
  const { id } = params;

  // Real authentication check
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    // Si l'utilisateur n'est pas connecté, on l'envoie vers le login avec un callbackUrl
    redirect(`/login?callbackUrl=/book/${id}`);
  }

  // Ensure user exists
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    redirect(`/login?callbackUrl=/book/${id}`);
  }

  const profile = await prisma.providerProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, image: true } },
      services: { orderBy: { startingPrice: 'asc' } }
    }
  });

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FBF6EE] font-sans text-ink">
      <PublicNavbar theme="light" />

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        
        {/* En-tête : Récapitulatif du prestataire */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-4">
            Demande de devis
          </h1>
          
          <div className="inline-flex items-center gap-4 bg-white px-6 py-4 rounded-full shadow-sm border border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-sand overflow-hidden flex items-center justify-center">
              {profile.user.image ? (
                <img src={profile.user.image} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <User size={24} className="text-ink/40" />
              )}
            </div>
            <div className="text-left">
              <div className="text-sm text-ink/60 font-medium">Vous allez réserver :</div>
              <div className="font-bold text-lg text-ink">{profile.name}</div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <BookingForm providerId={profile.id} services={profile.services} />
        
      </main>
    </div>
  );
}
