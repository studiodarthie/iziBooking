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
    take: 6,
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
      <div className="col-span-3 py-12 text-center text-ink/50 bg-white rounded-xl shadow-sm border border-divider">
        Aucun prestataire mis en avant pour le moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {providers.map((provider) => {
        const summary = getRatingSummary(provider.reviews);
        return (
          <div key={provider.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <div className="relative h-[220px] w-full overflow-hidden">
              <Image
                src={provider.mediaLinks[0]?.url || provider.user?.image || "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800"}
                alt={provider.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <span className="bg-white text-ink text-xs font-semibold px-2 py-1 rounded shadow-sm">
                  {provider.pole === "DIVERTISSEMENT" ? "Divertissement" :
                   provider.pole === "RECEPTION" ? "Réception" :
                   provider.pole === "IMAGE_SOUVENIR" ? "Image & Souvenir" : "Services"}
                </span>
                <span className="bg-white text-ink text-xs font-semibold px-2 py-1 rounded shadow-sm w-fit">
                  {provider.category}
                </span>
              </div>

              {summary.count > 0 && (
                <div className="absolute bottom-3 left-3 text-white flex items-center gap-1.5 text-sm font-medium drop-shadow-md">
                  <Star size={14} className="fill-accent text-accent" />
                  {summary.average.toFixed(1)} ({summary.count})
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="font-heading font-bold text-lg text-ink truncate">{provider.name}</h3>
              <p className="text-ink/70 text-sm mt-1 line-clamp-2 min-h-[40px]">
                {provider.bio || `${provider.category} professionnel à ${provider.location}.`}
              </p>

              <div className="flex flex-col gap-2 mt-4 text-xs text-ink/60">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} /> {provider.location}
                </span>
              </div>

              <div className="flex justify-between items-center mt-5 pt-4 border-t border-divider">
                <span className="font-bold text-[17px] text-ink">
                  {provider.basePrice ? `${provider.basePrice.toLocaleString("fr-FR")} ${provider.currency}` : "Sur devis"}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                <Link href={`/p/${provider.id}`} className="flex-1">
                  <button className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-ink font-semibold rounded-lg transition-colors text-sm">
                    Voir profil
                  </button>
                </Link>
                <Link href={`/book/${provider.id}`} className="flex-1">
                  <button className="w-full py-2 bg-primary hover:bg-accent-600 text-white font-semibold rounded-lg transition-colors text-sm">
                    Réserver
                  </button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
