import { Suspense } from "react";
import { HomeHero } from "@/components/public/HomeHero";
import { FeaturedProvidersList } from "@/components/public/FeaturedProvidersList";
import { FeaturedProvidersSkeleton } from "@/components/public/FeaturedProvidersSkeleton";
import { HomeCategories, type CategoryCount } from "@/components/public/HomeCategories";
import { HomeEventBlock } from "@/components/public/HomeEventBlock";
import { HomeHowItWorks } from "@/components/public/HomeHowItWorks";
import { HomeCTA } from "@/components/public/HomeCTA";
import { HomeAppBanner } from "@/components/public/HomeAppBanner";
import { HomeAdvantages } from "@/components/public/HomeAdvantages";
import { Testimonials, type Testimonial } from "@/components/public/Testimonials";
import { HomeFooter } from "@/components/public/HomeFooter";
import prisma from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";

// Page régénérée toutes les 2 minutes : les nouveaux prestataires et témoignages y apparaissent
// sans redéploiement, et une coupure de la base ne fait pas planter la page.
export const revalidate = 120;

export default async function Home() {
  const poleLabels: { pole: "DIVERTISSEMENT" | "RECEPTION" | "IMAGE_SOUVENIR" | "SERVICES" | "CULTURE_CINEMA"; name: string }[] = [
    { pole: "DIVERTISSEMENT", name: "Divertissement" },
    { pole: "RECEPTION", name: "Réception & Traiteur" },
    { pole: "IMAGE_SOUVENIR", name: "Photo & vidéo" },
    { pole: "SERVICES", name: "Services" },
    { pole: "CULTURE_CINEMA", name: "Culture & Cinéma" },
  ];
  const categoryCounts: CategoryCount[] = await Promise.all(
    poleLabels.map(async ({ pole, name }) => ({
      name,
      pole,
      count: await safeDb<number | null>(
        () => prisma.providerProfile.count({ where: { isVerified: true, pole, user: { isBanned: false } } }),
        null
      ),
    }))
  );

  const reviews = await safeDb(
    () =>
      prisma.review.findMany({
        where: { rating: { gte: 4 }, comment: { not: null } },
        orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
        take: 3,
        include: {
          organizer: { select: { name: true, image: true } },
          providerProfile: { select: { name: true } },
        },
      }),
    []
  );

  const testimonials: Testimonial[] = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment!,
    organizerName: r.organizer.name || "Organisateur iziBooking",
    organizerImage: r.organizer.image,
    providerName: r.providerProfile.name,
  }));

  return (
    <div className="min-h-screen bg-white text-ink font-sans flex flex-col">
      {/* Hero Section */}
      <HomeHero />

      <div className="w-full bg-[#FCEFDD]">
      {/* Categories Section */}
      <HomeCategories categories={categoryCounts} />

      {/* Featured Providers Section */}
      <section className="pt-16 md:pt-24 pb-16 md:pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <span className="text-primary text-[13px] font-bold tracking-[0.08em] uppercase">
              À LA UNE EN CE MOMENT
            </span>
            <h2 className="font-heading font-bold text-3xl mt-2 text-ink">
              Les réservations du moment
            </h2>
          </div>
          <a href="/search" className="text-primary font-semibold text-sm hover:underline">Voir tous les prestataires →</a>
        </div>

        {/* Dynamic List with Skeleton Loading */}
        <Suspense fallback={<FeaturedProvidersSkeleton />}>
          <FeaturedProvidersList />
        </Suspense>
      </section>
      </div>

      <HomeEventBlock />

      <HomeHowItWorks />

      {/* Categories Links (Footer Grid) */}
      <section className="bg-[#F6EBDD] py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h5 className="text-ink font-heading font-bold tracking-[0.08em] mb-10 text-[13px] uppercase">
            NOS CATÉGORIES DE PRESTATAIRES
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
            <div>
              <h6 className="text-primary font-bold text-[11px] tracking-[0.06em] mb-4">DIVERTISSEMENT</h6>
              <div className="flex flex-col gap-2.5">
                <a href="/search?pole=DIVERTISSEMENT" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Groupes & musiciens</a>
                <a href="/search?pole=DIVERTISSEMENT" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">DJ</a>
                <a href="/search?pole=DIVERTISSEMENT" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Danse & percussions</a>
                <a href="/search?pole=DIVERTISSEMENT" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Artistes & spectacles</a>
                <a href="/search?pole=DIVERTISSEMENT" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">MC / Animateurs</a>
              </div>
            </div>
            <div>
              <h6 className="text-primary font-bold text-[11px] tracking-[0.06em] mb-4">RÉCEPTION</h6>
              <div className="flex flex-col gap-2.5">
                <a href="/search?pole=RECEPTION" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Traiteurs</a>
                <a href="/search?pole=RECEPTION" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Décoration</a>
                <a href="/search?pole=RECEPTION" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Lieux & salles</a>
                <a href="/search?pole=RECEPTION" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Sonorisation & éclairage</a>
              </div>
            </div>
            <div>
              <h6 className="text-primary font-bold text-[11px] tracking-[0.06em] mb-4">IMAGE & SOUVENIR</h6>
              <div className="flex flex-col gap-2.5">
                <a href="/search?pole=IMAGE_SOUVENIR" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Photographes</a>
                <a href="/search?pole=IMAGE_SOUVENIR" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Vidéastes</a>
                <a href="/search?pole=IMAGE_SOUVENIR" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Photobooth</a>
                <a href="/search?pole=IMAGE_SOUVENIR" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Drone</a>
              </div>
            </div>
            <div>
              <h6 className="text-primary font-bold text-[11px] tracking-[0.06em] mb-4">SERVICES</h6>
              <div className="flex flex-col gap-2.5">
                <a href="/search?pole=SERVICES" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Sécurité</a>
                <a href="/search?pole=SERVICES" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Transport / VIP</a>
                <a href="/search?pole=SERVICES" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Hôtesses</a>
                <a href="/search?pole=SERVICES" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Wedding planners</a>
              </div>
            </div>
            <div>
              <h6 className="text-primary font-bold text-[11px] tracking-[0.06em] mb-4">CULTURE & CINÉMA</h6>
              <div className="flex flex-col gap-2.5">
                <a href="/search?pole=CULTURE_CINEMA" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Réalisation & production</a>
                <a href="/search?pole=CULTURE_CINEMA" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Médiation culturelle</a>
                <a href="/search?pole=CULTURE_CINEMA" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Projections & ciné-clubs</a>
                <a href="/search?pole=CULTURE_CINEMA" className="text-neutral-700 hover:text-primary text-[13.5px] transition-colors">Ateliers & animations</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <HomeAdvantages />

      {/* Testimonials Section */}
      <Testimonials testimonials={testimonials} />

      <HomeCTA />

      <HomeAppBanner />

      {/* Footer */}
      <HomeFooter />
    </div>
  );
}
