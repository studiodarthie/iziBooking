import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { PublicGallery } from "@/components/public/PublicGallery";
import { BookingWidget } from "@/components/public/BookingWidget";
import { ProviderTabs } from "@/components/public/ProviderTabs";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { HomeFooter } from "@/components/public/HomeFooter";
import { ProviderCard } from "@/components/public/ProviderCard";
import Image from "next/image";
import { MapPin, Star, ShieldCheck, Mail, User, MessageCircle } from "lucide-react";

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
        }
      },
      mediaLinks: true,
      services: true,
      blockedDates: {
        select: { date: true, id: true },
        where: { date: { gte: new Date() } }
      }
    }
  });

  if (!profile) {
    notFound();
  }

  // Fetch similar providers (same category, exclude current)
  const similarProviders = await prisma.providerProfile.findMany({
    where: {
      isVerified: true,
      id: { not: profile.id },
      category: profile.category,
    },
    take: 3,
    include: {
      user: { select: { image: true } },
      mediaLinks: { where: { type: "IMAGE" }, take: 1 }
    },
    orderBy: { createdAt: "desc" }
  });

  const poleLabels: Record<string, string> = {
    DIVERTISSEMENT: "Divertissement",
    RECEPTION: "Réception & Traiteur",
    IMAGE_SOUVENIR: "Image & Souvenir",
    SERVICES: "Services Événementiels",
  };
  const displayPole = poleLabels[profile.pole] || profile.pole;

  return (
    <div className="min-h-screen bg-[#FBF6EE] pb-20 font-sans text-[#0d0d0d]">
      <div className="bg-[#0d0d0d]">
        <PublicNavbar theme="dark" />
      </div>

      {/* Banner */}
      <div 
        className="h-48 md:h-72 w-full bg-[#1a1a1a] relative overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%23ffffff' stroke-width='1.5' fill='none' opacity='0.06'%3E%3C!-- Adinkrahene --%3E%3Ccircle cx='30' cy='30' r='14' /%3E%3Ccircle cx='30' cy='30' r='8' /%3E%3Ccircle cx='30' cy='30' r='2' /%3E%3C!-- Eban --%3E%3Crect x='76' y='16' width='28' height='28' transform='rotate(45 90 30)' /%3E%3Crect x='83' y='23' width='14' height='14' transform='rotate(45 90 30)' /%3E%3C!-- Mmusuyidee --%3E%3Cpath d='M20 90 L40 90 M30 80 L30 100' /%3E%3Ccircle cx='30' cy='90' r='12' /%3E%3C!-- Nsaa --%3E%3Cpath d='M90 76 L104 90 L90 104 L76 90 Z' /%3E%3Cpath d='M90 83 L97 90 L90 97 L83 90 Z' /%3E%3C!-- Grid Dots --%3E%3Ccircle cx='60' cy='60' r='1.5' fill='%23ffffff' /%3E%3Ccircle cx='0' cy='60' r='1.5' fill='%23ffffff' /%3E%3Ccircle cx='60' cy='0' r='1.5' fill='%23ffffff' /%3E%3Ccircle cx='120' cy='60' r='1.5' fill='%23ffffff' /%3E%3Ccircle cx='60' cy='120' r='1.5' fill='%23ffffff' /%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px',
          backgroundRepeat: 'repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/10 via-transparent to-[#0d0d0d]/80 z-10" />
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
                className="object-cover"
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
                <span className="text-[#0d0d0d]/80">5.0 (0 avis)</span>
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
          />
        </div>

        {/* Right Column: Sticky Widget & Buttons */}
        <div className="relative pt-4 md:pt-0">
          <div className="sticky top-24 space-y-4">
            <BookingWidget profile={profile} />
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
                <button className="flex-1 px-4 py-3.5 bg-white text-[#0d0d0d] font-semibold rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                  <Mail size={18} />
                  Contacter
                </button>
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
            <Link href={`/search?category=${encodeURIComponent(profile.category)}`} className="text-[#B5451B] font-semibold hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProviders.map((provider) => (
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
                isOpen={true}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-20">
        <HomeFooter />
      </div>
    </div>
  );
}
