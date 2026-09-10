import prisma from "@/lib/prisma";
import { Users, ShieldCheck, CalendarCheck, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  // Fetch global stats
  const totalUsers = await prisma.user.count();
  const totalProviders = await prisma.providerProfile.count();
  const totalBookings = await prisma.booking.count();
  const verifiedProviders = await prisma.providerProfile.count({
    where: { isVerified: true }
  });

  const pendingProviders = await prisma.providerProfile.findMany({
    where: { isVerified: false },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-black text-ink">Vue d’ensemble</h1>
        <p className="text-ink/60 mt-1">Statistiques globales de la plateforme iziBooking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat 1 */}
        <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full -mr-4 -mt-4" />
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-ink/50 uppercase tracking-wider mb-1">Utilisateurs inscrits</p>
          <p className="text-3xl font-black text-ink">{totalUsers}</p>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-bl-full -mr-4 -mt-4" />
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent-700 mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-ink/50 uppercase tracking-wider mb-1">Profils Prestataires</p>
          <p className="text-3xl font-black text-ink">{totalProviders}</p>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-success/10 rounded-bl-full -mr-4 -mt-4" />
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-ink/50 uppercase tracking-wider mb-1">Prestataires Vérifiés</p>
          <p className="text-3xl font-black text-ink">{verifiedProviders}</p>
        </div>

        {/* Stat 4 */}
        <div className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4" />
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-ink/50 uppercase tracking-wider mb-1">Réservations Totales</p>
          <p className="text-3xl font-black text-ink">{totalBookings}</p>
        </div>

      </div>

      {/* Section Action Requise */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-black text-ink">Action Requise</h2>
          <Link href="/admin/providers" className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">
            Voir tous les prestataires &rarr;
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-ink/10 shadow-sm overflow-hidden">
          {pendingProviders.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center text-success mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-ink">Tout est à jour !</h3>
              <p className="text-sm text-ink/60 mt-1">Aucun prestataire n’est en attente de vérification.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-ink/70">
                <thead className="bg-sand/30 text-xs uppercase font-bold text-ink/50 border-b border-ink/10">
                  <tr>
                    <th className="px-6 py-4">Prestataire en attente</th>
                    <th className="px-6 py-4">Date d’inscription</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingProviders.map((provider) => (
                    <tr key={provider.id} className="border-b border-ink/5 hover:bg-sand/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/20 text-accent-700 flex items-center justify-center font-bold">
                            {provider.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-ink">{provider.name}</p>
                            <p className="text-xs text-ink/50">{provider.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(provider.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href="/admin/providers"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          Examiner le dossier
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
