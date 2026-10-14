import Link from "next/link";
import prisma from "@/lib/prisma";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { HomeFooter } from "@/components/public/HomeFooter";
import { buildCampaignThumbnailUrl } from "@/lib/poster";
import { Images, Sparkles } from "lucide-react";

export const metadata = {
  title: "Galerie des badges « J'y serai » | iziBooking",
  description:
    "Parcourez les affiches créées par les organisateurs et générez votre propre badge « J'y serai » pour l'événement de votre choix.",
};

// Sans ça, Next.js prérend cette page au build et fige la liste des campagnes à ce moment-là —
// elle ne refléterait jamais les nouvelles affiches créées après le déploiement.
export const dynamic = "force-dynamic";

export default async function JySeraiGalleryPage() {
  const campaigns = await prisma.posterCampaign.findMany({
    orderBy: { createdAt: "desc" },
    take: 60,
    select: {
      id: true,
      slug: true,
      title: true,
      eventDate: true,
      theme: true,
      templatePublicId: true,
      templateWidth: true,
      templateHeight: true,
      generatedCount: true,
      user: { select: { name: true } },
    },
  });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0B1130] via-[#141D45] to-[#1E2A5E]">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-culture/25 blur-3xl pointer-events-none" />
        <div className="absolute top-32 right-[-120px] w-[460px] h-[460px] rounded-full bg-accent/40 blur-3xl pointer-events-none" />
        <PublicNavbar />

        <section className="relative z-10 px-4 md:px-8 pt-8 pb-14 md:pb-20 text-center">
          <span className="inline-block bg-white/10 text-accent-2-300 text-[12px] font-bold tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full mb-5">
            Galerie des badges
          </span>
          <h1 className="font-heading font-extrabold text-[clamp(28px,4vw,46px)] leading-[1.1] text-white max-w-3xl mx-auto">
            Trouvez un événement et créez votre badge « J'y serai »
          </h1>
          <p className="mt-4 text-white/70 max-w-xl mx-auto">
            Parcourez les affiches créées par les organisateurs et générez la vôtre avec votre
            photo, en quelques secondes.
          </p>
        </section>
      </div>

      <section className="flex-1 px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          {campaigns.length === 0 ? (
            <div className="bg-sand/40 border border-dashed border-ink/15 rounded-2xl p-12 text-center max-w-lg mx-auto">
              <Images className="mx-auto text-ink/20" size={36} />
              <p className="mt-3 font-semibold text-ink">Aucun badge pour le moment</p>
              <p className="text-sm text-ink/50 mt-1">
                Soyez le premier à créer une affiche « J'y serai » pour votre événement.
              </p>
              <Link
                href="/dashboard/posters"
                className="mt-5 inline-flex items-center justify-center gap-2 bg-primary hover:bg-accent-600 text-white font-bold rounded-full px-6 py-3 transition-colors"
              >
                <Sparkles size={16} /> Créer la première affiche
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {campaigns.map((c) => {
                const aspectRatio = c.templateWidth && c.templateHeight ? `${c.templateWidth} / ${c.templateHeight}` : "1080 / 1350";
                return (
                  <Link
                    key={c.id}
                    href={`/jyserai/${c.slug}`}
                    className="group block bg-white border border-ink/10 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    <div className="relative overflow-hidden bg-sand/30" style={{ aspectRatio }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={buildCampaignThumbnailUrl(c)}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3.5">
                      <h3 className="font-heading font-bold text-sm text-ink truncate group-hover:text-primary transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-xs text-ink/50 mt-0.5 truncate">
                        {c.eventDate
                          ? new Date(c.eventDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
                          : `Par ${c.user.name || "un organisateur"}`}
                      </p>
                      {c.generatedCount > 0 && (
                        <p className="text-[11px] text-ink/40 mt-1.5 flex items-center gap-1">
                          <Images size={11} /> {c.generatedCount} badge{c.generatedCount > 1 ? "s" : ""} créé
                          {c.generatedCount > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
