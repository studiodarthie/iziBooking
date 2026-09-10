import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ProviderListClient } from "./ProviderListClient";
import { Search } from "lucide-react";

export type ProviderWithDetails = Prisma.ProviderProfileGetPayload<{
  include: {
    user: { select: { email: true; image: true; name: true } };
    services: true;
    mediaLinks: true;
    _count: { select: { bookings: true } };
  };
}>;

export default async function AdminProvidersPage(props: {
  searchParams: Promise<{ q?: string }>
}) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";

  // Build the Prisma "where" clause dynamically
  const whereClause: Prisma.ProviderProfileWhereInput = {};

  if (q) {
    whereClause.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
      { user: { email: { contains: q, mode: "insensitive" } } },
    ];
  }

  const providers = await prisma.providerProfile.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          email: true,
          image: true,
          name: true
        }
      },
      services: true,
      mediaLinks: true,
      _count: {
        select: { bookings: true }
      }
    },
    // Priorité aux prestataires Premium, puis aux profils non encore vérifiés (les plus anciens d'abord).
    orderBy: [{ plan: "desc" }, { isVerified: "asc" }, { createdAt: "asc" }]
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-black text-ink">Gestion des Prestataires</h1>
        <p className="text-ink/60 mt-1">Examinez et vérifiez les profils des prestataires.</p>
      </div>

      {/* Search Bar - Client Side Form */}
      <div className="bg-white rounded-2xl p-4 border border-ink/10 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-ink/40 ml-2" />
        <form method="GET" action="/admin/providers" className="flex-1">
          <input 
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Rechercher par nom, email ou catégorie..."
            className="w-full bg-transparent border-none focus:ring-0 outline-none text-ink placeholder:text-ink/40"
          />
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-ink/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-ink/70">
            <thead className="bg-sand/30 text-xs uppercase font-bold text-ink/50 border-b border-ink/10">
              <tr>
                <th className="px-6 py-4">Prestataire</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Lieu</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {providers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-ink/50 italic">
                    Aucun prestataire trouvé.
                  </td>
                </tr>
              ) : (
                <ProviderListClient initialProviders={providers} />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
