import { Suspense } from "react";
import { HomeHero } from "@/components/public/HomeHero";
import { FeaturedProvidersList } from "@/components/public/FeaturedProvidersList";
import { FeaturedProvidersSkeleton } from "@/components/public/FeaturedProvidersSkeleton";
import { HomeCategories, type CategoryCount } from "@/components/public/HomeCategories";
import { HomeAdvantages } from "@/components/public/HomeAdvantages";
import { Testimonials } from "@/components/public/Testimonials";
import { HomeFooter } from "@/components/public/HomeFooter";
import prisma from "@/lib/prisma";
import { getRatingSummary } from "@/lib/ratings";

export default async function Home() {
  const featuredProvider = await prisma.providerProfile.findFirst({
    where: { isVerified: true, user: { isBanned: false } },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { image: true } },
      mediaLinks: { where: { type: "IMAGE" }, take: 1 },
      reviews: { select: { rating: true } }
    }
  });

  const poleLabels: { pole: "DIVERTISSEMENT" | "RECEPTION" | "IMAGE_SOUVENIR" | "SERVICES"; name: string }[] = [
    { pole: "DIVERTISSEMENT", name: "Divertissement" },
    { pole: "RECEPTION", name: "Réception & Traiteur" },
    { pole: "IMAGE_SOUVENIR", name: "Photo & vidéo" },
    { pole: "SERVICES", name: "Services" },
  ];
  const categoryCounts: CategoryCount[] = await Promise.all(
    poleLabels.map(async ({ pole, name }) => ({
      name,
      count: await prisma.providerProfile.count({ where: { isVerified: true, pole, user: { isBanned: false } } })
    }))
  );

  const featured = featuredProvider ? (() => {
    const summary = getRatingSummary(featuredProvider.reviews);
    return {
      id: featuredProvider.id,
      name: featuredProvider.name,
      category: featuredProvider.category,
      location: featuredProvider.location,
      image: featuredProvider.mediaLinks[0]?.url || featuredProvider.user?.image || null,
      rating: summary.average,
      reviewCount: summary.count,
    };
  })() : null;

  return (
    <div className="min-h-screen bg-sand text-ink font-sans flex flex-col">
      {/* Hero Section */}
      <HomeHero featured={featured} />

      {/* Featured Providers Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <span className="text-accent text-[13px] font-bold tracking-[0.08em] uppercase">
              PRESTATAIRES EN VEDETTE
            </span>
            <h2 className="font-heading font-bold text-3xl mt-2 text-ink">
              Les réservations du moment
            </h2>
          </div>
        </div>

        {/* Dynamic List with Skeleton Loading */}
        <Suspense fallback={<FeaturedProvidersSkeleton />}>
          <FeaturedProvidersList />
        </Suspense>
      </section>

      {/* Categories Section */}
      <HomeCategories categories={categoryCounts} />

      {/* Categories Links (Footer Grid) */}
      <section className="bg-trust py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h5 className="text-white/90 font-semibold tracking-[0.08em] mb-10 text-[13px] uppercase">
            NOS CATÉGORIES DE PRESTATAIRES
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div>
              <h6 className="text-white/50 text-[11px] tracking-[0.06em] mb-4">DIVERTISSEMENT</h6>
              <div className="flex flex-col gap-2.5">
                <a href="/search?pole=DIVERTISSEMENT" className="text-white/70 hover:text-white text-[13.5px] transition-colors">Groupes & musiciens</a>
                <a href="/search?pole=DIVERTISSEMENT" className="text-white/70 hover:text-white text-[13.5px] transition-colors">DJ</a>
                <a href="/search?pole=DIVERTISSEMENT" className="text-white/70 hover:text-white text-[13.5px] transition-colors">Danse & percussions</a>
                <a href="/search?pole=DIVERTISSEMENT" className="text-white/70 hover:text-white text-[13.5px] transition-colors">Artistes & spectacles</a>
                <a href="/search?pole=DIVERTISSEMENT" className="text-white/70 hover:text-white text-[13.5px] transition-colors">MC / Animateurs</a>
              </div>
            </div>
            <div>
              <h6 className="text-white/50 text-[11px] tracking-[0.06em] mb-4">RÉCEPTION</h6>
              <div className="flex flex-col gap-2.5">
                <a href="/search?pole=RECEPTION" className="text-white/70 hover:text-white text-[13.5px] transition-colors">Traiteurs</a>
                <a href="/search?pole=RECEPTION" className="text-white/70 hover:text-white text-[13.5px] transition-colors">Décoration</a>
                <a href="/search?pole=RECEPTION" className="text-white/70 hover:text-white text-[13.5px] transition-colors">Lieux & salles</a>
                <a href="/search?pole=RECEPTION" className="text-white/70 hover:text-white text-[13.5px] transition-colors">Sonorisation & éclairage</a>
              </div>
            </div>
            <div>
              <h6 className="text-white/50 text-[11px] tracking-[0.06em] mb-4">IMAGE & SOUVENIR</h6>
              <div className="flex flex-col gap-2.5">
                <a href="/search?pole=IMAGE_SOUVENIR" className="text-white/70 hover:text-white text-[13.5px] transition-colors">Photographes</a>
                <a href="/search?pole=IMAGE_SOUVENIR" className="text-white/70 hover:text-white text-[13.5px] transition-colors">Vidéastes</a>
                <a href="/search?pole=IMAGE_SOUVENIR" className="text-white/70 hover:text-white text-[13.5px] transition-colors">Photobooth</a>
                <a href="/search?pole=IMAGE_SOUVENIR" className="text-white/70 hover:text-white text-[13.5px] transition-colors">Drone</a>
              </div>
            </div>
            <div>
              <h6 className="text-white/50 text-[11px] tracking-[0.06em] mb-4">SERVICES</h6>
              <div className="flex flex-col gap-2.5">
                <a href="/search?pole=SERVICES" className="text-white/70 hover:text-white text-[13.5px] transition-colors">Sécurité</a>
                <a href="/search?pole=SERVICES" className="text-white/70 hover:text-white text-[13.5px] transition-colors">Transport / VIP</a>
                <a href="/search?pole=SERVICES" className="text-white/70 hover:text-white text-[13.5px] transition-colors">Hôtesses</a>
                <a href="/search?pole=SERVICES" className="text-white/70 hover:text-white text-[13.5px] transition-colors">Wedding planners</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <HomeAdvantages />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Footer */}
      <HomeFooter />
    </div>
  );
}
