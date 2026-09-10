import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { getRatingSummary } from "@/lib/ratings";

export async function FeaturedProvidersList() {
  // Simulate delay for skeleton demonstration (remove in production if desired)
  // await new Promise(resolve => setTimeout(resolve, 1500));

  const providers = await prisma.providerProfile.findMany({
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
  });

  if (providers.length === 0) {
    return (
      <div className="col-span-full py-12 text-center text-ink/50 bg-white rounded-xl shadow-sm border border-divider">
        Aucun prestataire mis en avant pour le moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {providers.map((provider) => {
        const summary = getRatingSummary(provider.reviews);
        return (
          <div key={provider.id} className="relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group">
            <Link href={`/p/${provider.id}`} className="absolute inset-0 z-0">
              <Image
                src={provider.mediaLinks[0]?.url || provider.user?.image || "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800"}
                alt={provider.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"></div>
            </Link>

            <span className="absolute top-2 left-2 z-10 bg-white/90 text-ink text-[10px] font-semibold px-2 py-0.5 rounded pointer-events-none">
              {provider.pole === "DIVERTISSEMENT" ? "Divertissement" :
               provider.pole === "RECEPTION" ? "Réception" :
               provider.pole === "IMAGE_SOUVENIR" ? "Image & Souvenir" : "Services"}
            </span>

            {summary.count > 0 && (
              <div className="absolute top-2 right-2 z-10 bg-white/90 text-ink flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded pointer-events-none">
                <Star size={10} className="fill-accent text-accent" />
                {summary.average.toFixed(1)}
              </div>
            )}

            <div className="absolute bottom-0 inset-x-0 z-10 p-3 pointer-events-none">
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
