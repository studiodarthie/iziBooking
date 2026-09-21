import { locationTerms } from "@/lib/countries";
import { GENRES, OCCASIONS, parseBudget } from "@/lib/filters";
import { CatalogFilterBar } from "@/components/public/CatalogFilterBar";
import Link from "next/link";
import { Suspense } from "react";
import { MapPin, Calendar, Search, ChevronDown, ChevronUp } from "lucide-react";
import prisma from "@/lib/prisma";
import { Prisma, ProviderPole } from "@prisma/client";
import { ProviderCard } from "@/components/public/ProviderCard";
import { ProviderCardSkeleton } from "@/components/public/ProviderCardSkeleton";
import { PageHero } from "@/components/public/PageHero";
import { HomeFooter } from "@/components/public/HomeFooter";
import { SearchSortSelect } from "@/components/public/SearchSortSelect";
import { getRatingSummary } from "@/lib/ratings";
import { startOfDay, endOfDay, parseISO, format } from "date-fns";

type SearchParams = { q?: string; loc?: string; pole?: string; minPrice?: string; maxPrice?: string; date?: string; sort?: string; occasion?: string; genre?: string; budget?: string };

// The layout and sidebar wrapper
export default async function SearchPage(props: {
  searchParams: Promise<SearchParams>
}) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";
  const loc = searchParams.loc || "";
  const pole = searchParams.pole || "";
  const dateStr = searchParams.date || "";

  const POLES = [
    { value: "", label: "Toutes les catégories" },
    { value: "DIVERTISSEMENT", label: "Divertissement" },
    { value: "RECEPTION", label: "Réception & Traiteur" },
    { value: "IMAGE_SOUVENIR", label: "Photo & Vidéo" },
    { value: "SERVICES", label: "Services" },
  ];

  return (
    <div className="min-h-screen bg-[#FCEFDD] font-sans flex flex-col">
      <PageHero
        overlap
        eyebrow="Catalogue"
        title={
          <>
            Trouvez le prestataire <span className="text-primary">idéal.</span>
          </>
        }
        description="Artistes, traiteurs, photographes, décorateurs… Filtrez par catégorie, pays et budget pour réserver en confiance."
      />

      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 -mt-16 md:-mt-20 relative z-30">
        <Suspense fallback={<div className="h-16 rounded-2xl bg-white border border-ink/10" />}>
          <CatalogFilterBar />
        </Suspense>
      </div>

      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8 relative z-20">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-ink/10 sticky top-8 overflow-hidden">
            <div className="p-5 border-b border-ink/5 flex items-center justify-between">
              <h2 className="font-heading font-bold text-xl text-ink">
                Filtres
              </h2>
            </div>

            <form action="/search" method="GET" className="divide-y divide-ink/5">
              {(["occasion", "genre", "budget"] as const).map((k) =>
                searchParams[k] ? <input key={k} type="hidden" name={k} value={searchParams[k]} /> : null
              )}
              
              {/* Keyword Search */}
              <div className="p-5">
                <label className="text-sm font-bold text-ink mb-3 flex items-center justify-between">
                  Mot-clé
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                    <ChevronUp size={12} />
                  </div>
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    name="q"
                    defaultValue={q}
                    placeholder="Ex: DJ, Photographe..."
                    className="w-full pl-3 pr-9 py-2.5 bg-sand/30 border border-ink/10 rounded-lg text-sm text-ink focus:outline-none focus:border-primary/50"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                </div>
              </div>

              {/* Category (Pole) */}
              <details className="group" open>
                <summary className="p-5 flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-sm font-bold text-ink">Catégorie</span>
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center transition-transform group-open:rotate-180">
                    <ChevronDown size={12} />
                  </div>
                </summary>
                <div className="px-5 pb-5 flex flex-col gap-3">
                  {POLES.map(p => (
                    <label key={p.value} className="flex items-center gap-3 text-sm text-ink/80 font-medium cursor-pointer hover:text-ink transition-colors">
                      <input 
                        type="radio" 
                        name="pole" 
                        value={p.value} 
                        defaultChecked={pole === p.value}
                        className="w-4 h-4 text-primary focus:ring-primary border-ink/20 rounded accent-primary"
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              </details>

              {/* Location */}
              <details className="group" open>
                <summary className="p-5 flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-sm font-bold text-ink">Lieu</span>
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center transition-transform group-open:rotate-180">
                    <ChevronDown size={12} />
                  </div>
                </summary>
                <div className="px-5 pb-5">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                    <input 
                      type="text"
                      name="loc"
                      defaultValue={loc}
                      placeholder="Rechercher une ville..."
                      className="w-full pl-9 pr-3 py-2.5 bg-sand/30 border border-ink/10 rounded-lg text-sm text-ink focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>
              </details>

              {/* Date */}
              <details className="group" open>
                <summary className="p-5 flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-sm font-bold text-ink">Date</span>
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center transition-transform group-open:rotate-180">
                    <ChevronDown size={12} />
                  </div>
                </summary>
                <div className="px-5 pb-5">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                    <input 
                      type="date"
                      name="date"
                      defaultValue={dateStr}
                      className="w-full pl-9 pr-3 py-2.5 bg-sand/30 border border-ink/10 rounded-lg text-sm text-ink focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>
              </details>

              {/* Budget */}
              <details className="group" open>
                <summary className="p-5 flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-sm font-bold text-ink">Budget Range</span>
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center transition-transform group-open:rotate-180">
                    <ChevronDown size={12} />
                  </div>
                </summary>
                <div className="px-5 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <input 
                        type="number"
                        name="minPrice"
                        defaultValue={searchParams.minPrice || ""}
                        placeholder="Min (FCFA)"
                        className="w-full px-3 py-2 bg-sand/30 border border-ink/10 rounded-lg text-sm text-ink focus:outline-none focus:border-primary/50 text-center"
                      />
                    </div>
                    <span className="text-ink/40 font-bold">-</span>
                    <div className="flex-1">
                      <input 
                        type="number"
                        name="maxPrice"
                        defaultValue={searchParams.maxPrice || ""}
                        placeholder="Max (FCFA)"
                        className="w-full px-3 py-2 bg-sand/30 border border-ink/10 rounded-lg text-sm text-ink focus:outline-none focus:border-primary/50 text-center"
                      />
                    </div>
                  </div>
                </div>
              </details>

              <div className="p-5 bg-sand/20">
                <button type="submit" className="w-full py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm shadow-sm">
                  Appliquer les filtres
                </button>
                
                {(q || loc || pole || dateStr || searchParams.minPrice || searchParams.maxPrice) && (
                  <Link href="/search" className="block text-center mt-3 text-sm font-semibold text-ink/50 hover:text-ink transition-colors">
                    Réinitialiser
                  </Link>
                )}
              </div>
            </form>
          </div>
        </aside>

        {/* Results with Suspense */}
        <main className="flex-1 min-w-0">
          <Suspense key={JSON.stringify(searchParams)} fallback={<SearchGridSkeleton />}>
            <SearchResults searchParams={searchParams} />
          </Suspense>
        </main>
      </div>
      
      <div className="mt-auto">
        <HomeFooter />
      </div>
    </div>
  );
}

// Skeleton Fallback
function SearchGridSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-ink/10 mb-6">
        <div className="h-5 bg-sand/80 w-48 rounded-lg animate-pulse"></div>
        <div className="h-8 bg-sand/80 w-32 rounded-lg animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProviderCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}

// Data Fetching Component
async function SearchResults({ searchParams }: { searchParams: SearchParams }) {
  const q = searchParams.q || "";
  const loc = searchParams.loc || "";
  const pole = searchParams.pole || "";
  const budget = parseBudget(searchParams.budget);
  const minPrice = searchParams.minPrice ? parseInt(searchParams.minPrice, 10) : budget.min;
  const maxPrice = searchParams.maxPrice ? parseInt(searchParams.maxPrice, 10) : budget.max;
  const dateStr = searchParams.date || "";
  const sort = searchParams.sort || "recent";

  const whereClause: Prisma.ProviderProfileWhereInput = { isVerified: true, user: { isBanned: false } };

  if (q) {
    whereClause.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
      { specialty: { contains: q, mode: "insensitive" } },
    ];
  }

  if (loc) {
    whereClause.AND = [
      { OR: locationTerms(loc).map((t) => ({ location: { contains: t, mode: "insensitive" as const } })) },
    ];
  }

  if (searchParams.occasion && OCCASIONS.includes(searchParams.occasion)) {
    whereClause.occasions = { has: searchParams.occasion };
  }

  if (searchParams.genre && GENRES.includes(searchParams.genre)) {
    const genre = searchParams.genre;
    whereClause.AND = [
      ...((whereClause.AND as Prisma.ProviderProfileWhereInput[] | undefined) ?? []),
      { OR: [{ specialty: { contains: genre, mode: "insensitive" } }, { category: { contains: genre, mode: "insensitive" } }, { bio: { contains: genre, mode: "insensitive" } }] },
    ];
  }

  if (pole && (Object.values(ProviderPole) as string[]).includes(pole)) {
    whereClause.pole = pole as ProviderPole;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    whereClause.basePrice = {};
    if (minPrice !== undefined) whereClause.basePrice.gte = minPrice;
    if (maxPrice !== undefined) whereClause.basePrice.lte = maxPrice;
  }

  if (dateStr) {
    const targetDate = parseISO(dateStr);
    if (!isNaN(targetDate.getTime())) {
      const start = startOfDay(targetDate);
      const end = endOfDay(targetDate);

      whereClause.NOT = [
        {
          bookings: {
            some: {
              eventDate: {
                gte: start,
                lte: end
              },
              status: { in: ['CONFIRMED', 'COMPLETED', 'ACCEPTED'] }
            }
          }
        },
        {
          blockedDates: {
            some: {
              date: {
                gte: start,
                lte: end
              }
            }
          }
        }
      ];
    }
  }

  const secondarySort: Prisma.ProviderProfileOrderByWithRelationInput =
    sort === "price_asc" ? { basePrice: "asc" } :
    sort === "price_desc" ? { basePrice: "desc" } :
    { createdAt: "desc" };

  // Les prestataires Premium remontent toujours en premier, avant le tri choisi par l'utilisateur.
  const orderBy: Prisma.ProviderProfileOrderByWithRelationInput[] = [{ plan: "desc" }, secondarySort];

  const providers = await prisma.providerProfile.findMany({
    where: whereClause,
    orderBy,
    include: {
      user: { select: { image: true } },
      mediaLinks: { where: { type: "IMAGE" }, take: 1 },
      reviews: { select: { rating: true } }
    }
  });

  return (
    <>
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-ink/10 mb-6 shadow-sm gap-4">
        <p className="text-ink/70 font-medium text-sm">
          {providers.length === 0 ? (
            "Aucun résultat"
          ) : (
            <>Affichage de <span className="font-bold text-ink">1–{providers.length}</span> sur <span className="font-bold text-ink">{providers.length}</span> résultats</>
          )}
        </p>
        
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <SearchSortSelect currentSort={sort} />
        </div>
      </div>

      {providers.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-ink/10">
          <div className="w-16 h-16 bg-sand rounded-full flex items-center justify-center mb-4 text-ink/40">
            <Search size={24} />
          </div>
          <h3 className="text-lg font-bold text-ink mb-2">Aucun résultat</h3>
          <p className="text-ink/60 max-w-sm">
            Nous n’avons trouvé aucun prestataire correspondant à vos critères. Essayez de modifier vos filtres ou votre recherche.
          </p>
          <Link href="/search" className="mt-6 px-6 py-2.5 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-colors shadow-sm">
            Voir tout l’annuaire
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {providers.map((provider) => {
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
                availableDate={dateStr && !isNaN(parseISO(dateStr).getTime()) ? format(parseISO(dateStr), "dd/MM/yyyy") : undefined}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
