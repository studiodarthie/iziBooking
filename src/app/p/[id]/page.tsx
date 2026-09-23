import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { BookingWidget } from "@/components/public/BookingWidget";
import { ProviderTabs } from "@/components/public/ProviderTabs";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { HomeFooter } from "@/components/public/HomeFooter";
import { ProviderCard } from "@/components/public/ProviderCard";
import Image from "next/image";
import { MapPin, Star, ShieldCheck, User, MessageCircle, Crown } from "lucide-react";
import { getRatingSummary } from "@/lib/ratings";
import { isPremium } from "@/lib/plan";
import { ContactProviderModal } from "@/components/public/ContactProviderModal";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PublicProviderPage(props: Props) {
  const params = await props.params;
  const { id } = params;

  const profile = await prisma.providerProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          image: true,
          name: true,
          email: true,
          isBanned: true,
        }
      },
      mediaLinks: true,
      services: true,
      blockedDates: {
        select: { date: true, id: true },
        where: { date: { gte: new Date() } }
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { organizer: { select: { name: true, image: true } } }
      }
    }
  });

  if (!profile || profile.user.isBanned) {
    notFound();
  }

  // Compte une vue, sauf quand le prestataire consulte sa propre fiche.
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== profile.user.email) {
    prisma.providerProfile.update({
      where: { id: profile.id },
      data: { viewCount: { increment: 1 } }
    }).catch(() => {}); // best-effort, ne doit jamais bloquer l'affichage de la fiche
  }

  const ratingSummary = getRatingSummary(profile.reviews);

  // Fetch similar providers (same category, exclude current)
  const similarProviders = await prisma.providerProfile.findMany({
    where: {
      isVerified: true,
      id: { not: profile.id },
      category: profile.category,
      user: { isBanned: false },
    },
    take: 3,
    include: {
      user: { select: { image: true } },
      mediaLinks: { where: { type: "IMAGE" }, take: 1 },
      reviews: { select: { rating: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  const poleLabels: Record<string, string> = {
    DIVERTISSEMENT: "Divertissement",
    RECEPTION: "Réception & Traiteur",
    IMAGE_SOUVENIR: "Image & Souvenir",
    SERVICES: "Services Événementiels",
    CULTURE_CINEMA: "Culture & Cinéma",
  };
  const displayPole = poleLabels[profile.pole] || profile.pole;

  return (
    <div className="min-h-screen bg-[#FBF6EE] pb-20 font-sans text-[#0d0d0d]">
      {/* Header : même fond que l'accueil, hauteur inchangée (navbar + bandeau) */}
      <div className="relative overflow-hidden bg-[#3A1508]">
        <Image
          src="/images/home/traditional-dance.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#B5451B]/90 via-[#8E3414]/85 to-[#3A1508]/95" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-accent/30 blur-[120px] pointer-events-none" />
        <PublicNavbar />
        <div className="h-48 md:h-72" />
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 relative z-20 -mt-16 md:-mt-20">
        
        {/* Left Column */}
        <div>
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#FBF6EE] bg-white overflow-hidden shadow-xl shrink-0 relative flex items-center justify-center mb-6">
            {profile.user.image ? (
              <Image 
                src={profile.user.image} 
                alt={profile.user.name || profile.name} 
                fill 
                className="object-cover object-[center_20%]"
              />
            ) : (
              <User size={64} className="text-neutral-300" />
            )}
          </div>
          
          {/* Name & Title */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#B5451B]/10 text-[#B5451B] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {displayPole}
              </span>
              {profile.isVerified && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  <ShieldCheck size={14} /> Vérifié
                </span>
              )}
              {isPremium(profile) && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-ink bg-accent-2-500 px-3 py-1 rounded-full">
                  <Crown size={14} /> Premium
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-[#0d0d0d] tracking-tight">
              {profile.name}
            </h1>
            <p className="text-lg md:text-xl text-[#0d0d0d]/70 font-medium mt-2">
              {profile.category} {profile.specialty && <span className="opacity-50">· {profile.specialty}</span>}
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-[#0d0d0d]/60 font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-[#C9982B]" />
                {profile.location}
              </div>
              <div className="flex items-center gap-1 text-[#C9982B]">
                <Star size={16} className="fill-current" />
                <span className="text-[#0d0d0d]/80">
                  {ratingSummary.count > 0
                    ? `${ratingSummary.average.toFixed(1)} (${ratingSummary.count} avis)`
                    : "Nouveau sur iziBooking"}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mb-8">
            <span className="px-3 py-1.5 rounded-full border border-neutral-300 text-sm font-medium bg-white">
              {profile.category}
            </span>
            {profile.specialty && (
              <span className="px-3 py-1.5 rounded-full border border-neutral-300 text-sm font-medium bg-white">
                {profile.specialty}
              </span>
            )}
          </div>

          <ProviderTabs
            bio={profile.bio}
            services={profile.services}
            mediaLinks={profile.mediaLinks}
            reviews={profile.reviews}
          />
        </div>

        {/* Right Column: Sticky Widget & Buttons */}
        <div className="relative pt-4 md:pt-0">
          <div className="sticky top-24 space-y-4">
            <BookingWidget profile={profile} blockedDates={profile.blockedDates.map((b) => b.date)} />
            <div className="flex gap-3">
              {profile.whatsapp ? (
                <a 
                  href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3.5 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#1ebd5a] transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
              ) : (
                <ContactProviderModal providerProfileId={profile.id} providerName={profile.name} />
              )}
              <Link href={`/book/${profile.id}`} className="flex-1 px-4 py-3.5 bg-[#B5451B] text-white font-semibold rounded-xl hover:bg-[#9a3915] transition-colors shadow-lg shadow-[#B5451B]/20 flex items-center justify-center gap-2">
                Réserver
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Providers Section */}
      {similarProviders.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-heading font-bold text-[#0d0d0d]">Prestataires similaires</h2>
            <Link href={`/search?q=${encodeURIComponent(profile.category)}`} className="text-[#B5451B] font-semibold hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProviders.map((provider) => {
              const summary = getRatingSummary(provider.reviews);
              return (
                <ProviderCard
                  key={provider.id}
                  id={provider.id}
                  name={provider.name}
                  category={provider.category}
                  location={provider.location}
                  basePrice={provider.basePrice}
                  currency={provider.currency}
                  image={provider.mediaLinks[0]?.url || provider.user?.image}
                  bio={provider.bio}
                  pole={provider.pole}
                  rating={summary.average}
                  reviewCount={summary.count}
                />
              );
            })}
          </div>
        </div>
      )}
      
      <div className="mt-20">
        <HomeFooter />
      </div>
    </div>
  );
}
