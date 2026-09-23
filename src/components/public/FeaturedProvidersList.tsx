import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Crown } from "lucide-react";
import { getRatingSummary } from "@/lib/ratings";
import { safeDb } from "@/lib/safe-db";
import { isPremium } from "@/lib/plan";

export async function FeaturedProvidersList() {
  // Simulate delay for skeleton demonstration (remove in production if desired)
  // await new Promise(resolve => setTimeout(resolve, 1500));

  const providers = await safeDb(() => prisma.providerProfile.findMany({
    where: { isVerified: true, user: { isBanned: false } },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: {
      user: {
        select: {
          image: true
        }
      },
      mediaLinks: {
        where: { type: "IMAGE" },
        take: 1
      },
      reviews: { select: { rating: true } }
    }
  }), null);

  if (providers === null) {
    return (
      <div className="col-span-full py-12 text-center text-ink/60 bg-white rounded-xl shadow-sm border border-divider">
        Les prestataires sont momentanément indisponibles. Rechargez la page dans un instant.
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="col-span-full py-14 px-6 text-center bg-white rounded-2xl shadow-sm border border-divider">
        <p className="font-heading font-bold text-2xl text-ink">Les premiers prestataires arrivent bientôt</p>
        <p className="text-neutral-700 mt-2">Artiste, traiteur, photographe… rejoignez iziBooking dès maintenant.</p>
        <Link href="/inscription" className="inline-block mt-5 bg-primary hover:bg-accent-600 text-white font-bold rounded-full px-6 py-3 transition-colors">
          Créer mon profil gratuitement
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {providers.map((provider) => {
        const summary = getRatingSummary(provider.reviews);
        return (
          <div key={provider.id} className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group">
            <Link href={`/p/${provider.id}`} className="absolute inset-0 z-0">
              {provider.mediaLinks[0]?.url || provider.user?.image ? (
                <Image
                  src={(provider.mediaLinks[0]?.url || provider.user?.image) as string}
                  alt={provider.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover object-[center_18%] group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent-700 flex items-center justify-center font-heading font-extrabold text-6xl text-white/90">
                  {provider.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </Link>

            {summary.count > 0 && (
              <div className="absolute top-2 right-2 z-10 bg-white/90 text-ink flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded pointer-events-none">
                <Star size={10} className="fill-accent text-accent" />
                {summary.average.toFixed(1)}
              </div>
            )}

            <div className="absolute bottom-0 inset-x-0 z-10 p-3 pointer-events-none">
              {isPremium(provider) && (
                <span className="inline-flex items-center gap-1 mb-1.5 mr-1.5 bg-accent-2-500 text-ink text-[10px] font-bold px-2 py-0.5 rounded">
                  <Crown size={10} /> Premium
                </span>
              )}
              <span className="inline-block mb-1.5 bg-white/90 text-ink text-[10px] font-semibold px-2 py-0.5 rounded">
                {provider.pole === "DIVERTISSEMENT" ? "Divertissement" :
                 provider.pole === "RECEPTION" ? "Réception" :
                 provider.pole === "IMAGE_SOUVENIR" ? "Image & Souvenir" :
                 provider.pole === "CULTURE_CINEMA" ? "Culture & Cinéma" : "Services"}
              </span>
              <h3 className="font-heading font-bold text-sm text-white truncate">{provider.name}</h3>
              <div className="flex items-center gap-1 text-[11px] text-white/70 mt-0.5 truncate">
                <MapPin size={10} className="shrink-0" /> {provider.location}
              </div>
              <div className="text-xs font-bold text-white mt-1">
                {provider.basePrice ? `${provider.basePrice.toLocaleString("fr-FR")} ${provider.currency}` : "Sur devis"}
              </div>
            </div>

            <Link
              href={`/book/${provider.id}`}
              className="absolute bottom-3 right-3 z-20 bg-primary hover:bg-accent-600 text-white font-semibold rounded-lg px-2.5 py-1.5 text-[11px] transition-colors shadow-sm"
            >
              Réserver
            </Link>
          </div>
        );
      })}
    </div>
  );
}
